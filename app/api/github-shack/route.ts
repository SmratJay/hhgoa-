import { NextResponse } from "next/server";
import { getGithubShack, ShackError } from "@/lib/github-shack";
import { getLeaderboard, upsertLeaderboardEntry } from "@/lib/shack-leaderboard";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username") ?? "";

  try {
    const entry = await getGithubShack(username);
    const persistence = await upsertLeaderboardEntry(entry);
    const leaderboard = await getLeaderboard(10);

    return NextResponse.json({
      entry,
      leaderboard: leaderboard.entries,
      leaderboardEnabled: leaderboard.enabled,
      persistence,
    });
  } catch (error) {
    if (error instanceof ShackError) {
      return NextResponse.json(
        {
          error: error.code,
          message: error.message,
        },
        { status: error.status }
      );
    }

    return NextResponse.json(
      {
        error: "github_error",
        message: "Couldn't check GitHub right now.",
      },
      { status: 502 }
    );
  }
}

