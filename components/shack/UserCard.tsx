import { type ShackEntry } from "@/lib/github-shack";
import { Github, Trophy, Beer } from "lucide-react";
import Image from "next/image";

interface UserCardProps {
  entry: ShackEntry;
}

export function UserCard({ entry }: UserCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-6 md:p-8 backdrop-blur-md shadow-xl flex flex-col md:flex-row items-center gap-6">
      <div className="relative w-24 h-24 md:w-32 md:h-32 shrink-0">
        {entry.avatarUrl ? (
          <Image
            src={entry.avatarUrl}
            alt={`${entry.username}'s avatar`}
            fill
            className="rounded-full object-cover border-4 border-white/20 shadow-lg"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-white/10 flex items-center justify-center border-4 border-white/20 shadow-lg">
            <Github className="w-12 h-12 text-white/50" />
          </div>
        )}
        <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-amber-400 to-orange-500 w-10 h-10 rounded-full flex items-center justify-center border-2 border-[#1a1a1a] shadow-lg">
          <span className="font-bold text-white text-sm">T{entry.tier}</span>
        </div>
      </div>

      <div className="flex-1 text-center md:text-left space-y-2">
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
          <h1 className="text-3xl md:text-4xl font-bold text-white">@{entry.username}</h1>
          <a
            href={`https://github.com/${entry.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center mx-auto md:mx-0 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
        <p className="text-amber-400 font-semibold text-lg">{entry.tierLabel}</p>
      </div>

      <div className="flex gap-4 w-full md:w-auto">
        <div className="flex-1 md:w-32 bg-black/40 rounded-xl p-4 border border-white/5 flex flex-col items-center justify-center text-center">
          <Trophy className="w-5 h-5 text-zinc-400 mb-2" />
          <span className="text-2xl font-black text-white">{entry.commits.toLocaleString()}</span>
          <span className="text-xs text-zinc-400 uppercase tracking-wider font-semibold mt-1">Commits</span>
        </div>
        
        <div className="flex-1 md:w-32 bg-black/40 rounded-xl p-4 border border-white/5 flex flex-col items-center justify-center text-center">
          <Beer className="w-5 h-5 text-amber-500 mb-2" />
          <span className="text-2xl font-black text-white">{entry.pints.toLocaleString()}</span>
          <span className="text-xs text-amber-500/80 uppercase tracking-wider font-semibold mt-1">Pints</span>
        </div>
      </div>
    </div>
  );
}
