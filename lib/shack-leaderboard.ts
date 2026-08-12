import { ShackEntry } from "@/lib/github-shack";
import { getContributionTier, getPintsFromCommits, getTierMetadata } from "@/lib/shack-tiers";

const TABLE_NAME = "github_shack_leaderboard";

function hasSupabaseConfig() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function getSupabaseHeaders() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  return {
    apikey: serviceRoleKey ?? "",
    Authorization: `Bearer ${serviceRoleKey}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  };
}

function getSupabaseTableUrl(search = "") {
  const baseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
  return `${baseUrl}/rest/v1/${TABLE_NAME}${search}`;
}

function normalizeLeaderboardEntry(row: Record<string, unknown>, index = 0): ShackEntry {
  const contributions = Number(row.contributions ?? row.commits ?? 0);
  const tier = getContributionTier(contributions);
  const tierMeta = getTierMetadata(tier);

  return {
    username: String(row.username ?? ""),
    avatarUrl: typeof row.avatar_url === "string" ? row.avatar_url : undefined,
    contributions,
    commits: Number(row.commits ?? contributions),
    pints: Number(row.pints ?? getPintsFromCommits(contributions)),
    tier,
    tierLabel: tierMeta.label,
    tierAsset: tierMeta.asset,
    rank: index + 1,
    dataSource: "supabase",
  };
}

export function isLeaderboardEnabled() {
  return hasSupabaseConfig();
}

export async function upsertLeaderboardEntry(entry: ShackEntry) {
  if (!hasSupabaseConfig()) {
    console.warn("Supabase config is missing. Skipping leaderboard write.");
    return { enabled: false };
  }

  try {
    const response = await fetch(getSupabaseTableUrl("?on_conflict=username"), {
      method: "POST",
      headers: {
        ...getSupabaseHeaders(),
        Prefer: "resolution=merge-duplicates,return=representation",
      },
      body: JSON.stringify({
        username: entry.username.toLowerCase(),
        display_username: entry.username,
        avatar_url: entry.avatarUrl ?? null,
        contributions: entry.contributions,
        commits: entry.commits,
        pints: entry.pints,
        tier: entry.tier,
        checked_at: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`Supabase write failed (Status ${response.status}):`, errText);
      return { enabled: true, error: "supabase_write_failed", detail: errText };
    }

    return { enabled: true };
  } catch (err) {
    console.error("Network error writing to Supabase:", err);
    return { enabled: true, error: "supabase_write_failed", detail: String(err) };
  }
}

export async function getLeaderboard(limit = 10) {
  if (!hasSupabaseConfig()) {
    return { enabled: false, entries: [] as ShackEntry[] };
  }

  try {
    const search = `?select=username,display_username,avatar_url,contributions,commits,pints,tier,checked_at&order=contributions.desc&limit=${limit}`;
    const response = await fetch(getSupabaseTableUrl(search), {
      headers: getSupabaseHeaders(),
      cache: "no-store",
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`Supabase read failed (Status ${response.status}):`, errText);
      return { enabled: true, entries: [] as ShackEntry[], error: "supabase_read_failed", detail: errText };
    }

    const rows = (await response.json()) as Record<string, unknown>[];
    const entries = rows.map((row, index) =>
      normalizeLeaderboardEntry(
        {
          ...row,
          username: row.display_username ?? row.username,
        },
        index
      )
    );

    return { enabled: true, entries };
  } catch (err) {
    console.error("Network error reading from Supabase:", err);
    return { enabled: true, entries: [] as ShackEntry[], error: "supabase_read_failed", detail: String(err) };
  }
}

