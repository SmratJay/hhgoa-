import { NextResponse } from "next/server";
import { getLeaderboard } from "@/lib/shack-leaderboard";

export const dynamic = "force-dynamic";

export async function GET() {
  const leaderboard = await getLeaderboard(10);

  return NextResponse.json({
    entries: leaderboard.entries,
    enabled: leaderboard.enabled,
    error: leaderboard.error,
  });
}

