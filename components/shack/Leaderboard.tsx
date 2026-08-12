import { type ShackEntry } from "@/lib/github-shack";
import Image from "next/image";
import { Beer, Github, Trophy } from "lucide-react";

interface LeaderboardProps {
  entries: ShackEntry[];
}

export function Leaderboard({ entries }: LeaderboardProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
        <p className="text-white/60">No entries yet. Be the first to check your shack!</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md overflow-hidden shadow-xl">
      <div className="p-6 border-b border-white/10">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Trophy className="w-6 h-6 text-amber-400" />
          Cracked Dev Leaderboard
        </h2>
        <p className="text-white/60 mt-1">Ranking by Github contributions (every 5 = 1 pint)</p>
      </div>

      <div className="divide-y divide-white/5">
        {entries.map((entry, idx) => (
          <div
            key={entry.username}
            className="flex items-center gap-4 p-4 md:p-6 hover:bg-white/5 transition-colors"
          >
            {/* Rank */}
            <div className="flex-shrink-0 w-8 md:w-12 text-center">
              <span className={`text-xl md:text-2xl font-black ${
                idx === 0 ? "text-amber-400" :
                idx === 1 ? "text-zinc-300" :
                idx === 2 ? "text-amber-700" :
                "text-white/30"
              }`}>
                #{idx + 1}
              </span>
            </div>

            {/* Avatar */}
            <div className="relative w-12 h-12 md:w-14 md:h-14 flex-shrink-0">
              {entry.avatarUrl ? (
                <Image
                  src={entry.avatarUrl}
                  alt={entry.username}
                  fill
                  className="rounded-full object-cover border border-white/20"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                  <Github className="w-6 h-6 text-white/50" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <a
                href={`https://github.com/${entry.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white font-bold text-lg md:text-xl truncate hover:underline hover:text-amber-400 transition-colors"
              >
                @{entry.username}
              </a>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs md:text-sm text-white/60 font-medium">Tier {entry.tier}</span>
                <span className="text-xs text-white/30">•</span>
                <span className="text-xs md:text-sm text-amber-400/80 truncate">{entry.tierLabel}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 md:gap-8 flex-shrink-0">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-white font-bold">{entry.commits.toLocaleString()}</span>
                <span className="text-xs text-zinc-400">commits</span>
              </div>
              <div className="flex flex-col items-end bg-black/30 px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-white/5">
                <div className="flex items-center gap-1.5">
                  <Beer className="w-4 h-4 text-amber-500" />
                  <span className="text-white font-bold text-lg">{entry.pints.toLocaleString()}</span>
                </div>
                <span className="text-[10px] md:text-xs text-amber-500/80 uppercase font-bold tracking-wider">Pints</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
