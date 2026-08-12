import { getContributionTier, getPintsFromCommits, getTierMetadata } from "@/lib/shack-tiers";

const GITHUB_API_URL = "https://api.github.com";
const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";
const USERNAME_PATTERN = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;

export interface ShackEntry {
  username: string;
  avatarUrl?: string;
  contributions: number;
  commits: number;
  pints: number;
  tier: number;
  tierLabel: string;
  tierAsset: string;
  rank?: number;
  dataSource?: "github-graphql" | "github-search" | "supabase";
}

export type ShackErrorCode = "invalid_username" | "not_found" | "rate_limited" | "github_error";

export class ShackError extends Error {
  code: ShackErrorCode;
  status: number;

  constructor(code: ShackErrorCode, message: string, status: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

function getGithubHeaders() {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  return headers;
}

export function sanitizeGithubUsername(username: string) {
  return username.trim().replace(/^@/, "");
}

export function validateGithubUsername(username: string) {
  return USERNAME_PATTERN.test(username);
}

function getContributionWindow() {
  const to = new Date();
  const from = new Date(to);
  from.setFullYear(to.getFullYear() - 1);

  return {
    from,
    to,
    fromIso: from.toISOString(),
    toIso: to.toISOString(),
    fromDate: from.toISOString().slice(0, 10),
  };
}

async function fetchGithubUser(username: string) {
  const response = await fetch(`${GITHUB_API_URL}/users/${encodeURIComponent(username)}`, {
    headers: getGithubHeaders(),
    next: { revalidate: 1800 },
  });

  if (response.status === 404) {
    throw new ShackError("not_found", "Couldn't find that GitHub user.", 404);
  }

  if (response.status === 403 || response.status === 429) {
    throw new ShackError("rate_limited", "GitHub temporarily limited the request.", 429);
  }

  if (!response.ok) {
    throw new ShackError("github_error", "Couldn't check GitHub right now.", 502);
  }

  return response.json() as Promise<{ login: string; avatar_url?: string }>;
}

async function fetchGraphqlContributions(username: string) {
  if (!process.env.GITHUB_TOKEN) return null;

  const { fromIso, toIso } = getContributionWindow();
  const query = `
    query UserContributions($login: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $login) {
        contributionsCollection(from: $from, to: $to) {
          totalCommitContributions
          totalRepositoryContributions
          totalPullRequestContributions
          totalIssueContributions
          totalPullRequestReviewContributions
        }
      }
    }
  `;

  const response = await fetch(GITHUB_GRAPHQL_URL, {
    method: "POST",
    headers: {
      ...getGithubHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: { login: username, from: fromIso, to: toIso },
    }),
    next: { revalidate: 1800 },
  });

  if (response.status === 403 || response.status === 429) {
    throw new ShackError("rate_limited", "GitHub temporarily limited the request.", 429);
  }

  if (!response.ok) return null;

  const json = await response.json();
  const collection = json?.data?.user?.contributionsCollection;
  if (!collection) return null;

  return Number(collection.totalCommitContributions ?? 0);
}

/**
 * Fallback: count public PushEvent commits via the public events API.
 * Much more accurate than the search API (which only indexes a subset).
 * Paginates up to 10 pages (300 events) — GitHub's max for public events.
 * Filters by year so we only count the current calendar year's commits.
 */
async function fetchPublicEventsCommitCount(username: string) {
  const currentYear = new Date().getFullYear();
  let totalCommits = 0;

  for (let page = 1; page <= 10; page++) {
    const response = await fetch(
      `${GITHUB_API_URL}/users/${encodeURIComponent(username)}/events/public?per_page=30&page=${page}`,
      {
        headers: getGithubHeaders(),
        next: { revalidate: 1800 },
      }
    );

    if (response.status === 403 || response.status === 429) {
      throw new ShackError("rate_limited", "GitHub temporarily limited the request.", 429);
    }

    if (!response.ok) {
      throw new ShackError("github_error", "Couldn't check GitHub right now.", 502);
    }

    const events = (await response.json()) as Array<{
      type: string;
      created_at: string;
      payload?: { commits?: Array<unknown>; size?: number; distinct_size?: number };
    }>;

    if (!events || events.length === 0) break;

    let reachedOldEvents = false;
    for (const event of events) {
      const eventYear = new Date(event.created_at).getFullYear();
      if (eventYear < currentYear) {
        reachedOldEvents = true;
        break;
      }
      if (event.type === "PushEvent" && event.payload) {
        // distinct_size excludes merge commits; size includes them — use distinct_size
        totalCommits += event.payload.distinct_size ?? event.payload.commits?.length ?? 0;
      }
    }

    if (reachedOldEvents) break;
  }

  return totalCommits;
}

export async function getGithubShack(usernameInput: string): Promise<ShackEntry> {
  const username = sanitizeGithubUsername(usernameInput);

  if (!validateGithubUsername(username)) {
    throw new ShackError("invalid_username", "Enter a valid GitHub username.", 400);
  }

  const user = await fetchGithubUser(username);
  const graphqlCommits = await fetchGraphqlContributions(user.login);
  const commits = graphqlCommits ?? (await fetchPublicEventsCommitCount(user.login));
  const tier = getContributionTier(commits);
  const tierMeta = getTierMetadata(tier);

  return {
    username: user.login,
    avatarUrl: user.avatar_url,
    contributions: commits,
    commits,
    pints: getPintsFromCommits(commits),
    tier,
    tierLabel: tierMeta.label,
    tierAsset: tierMeta.asset,
    dataSource: graphqlCommits === null ? "github-search" : "github-graphql",
  };
}

