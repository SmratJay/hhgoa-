"use client";

import { useState, useEffect } from "react";
import { Github, Search, Loader2, Beer, Trophy, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { type ShackEntry } from "@/lib/github-shack";
import { TarotCard } from "@/components/shack/TarotCard";
import { BeachParticles } from "@/components/shack/BeachParticles";
import { MusicPlayer } from "@/components/shack/MusicPlayer";

/* ─── Shack Visual ─────────────────────────────────────────────── */
function ShackVisual({ entry }: { entry: ShackEntry | null }) {
  const [imgSrc, setImgSrc] = useState("/images-hut/baseimage.png");
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (!entry) {
      setImgSrc("/images-hut/baseimage.png");
      return;
    }
    // Cross-fade: fade out then swap src, then fade back in
    setFading(true);
    const t = setTimeout(() => {
      setImgSrc(entry.tierAsset);
      setFading(false);
    }, 350);
    return () => clearTimeout(t);
  }, [entry]);

  return (
    <div className="relative w-full max-w-3xl mx-auto overflow-hidden rounded-sm shadow-[8px_8px_0_#f8db19] border-2 border-[#f8db19] group">
      <div className="aspect-[16/9] relative w-full bg-[#043c27]">
        <Image
          src={imgSrc}
          alt={entry ? `Tier ${entry.tier} Goa Shack` : "Base Goa Shack"}
          fill
          className="object-cover transition-all duration-700 ease-in-out group-hover:scale-105"
          style={{ opacity: fading ? 0 : 1, transition: "opacity 0.35s ease, transform 0.7s ease" }}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#043c27]/90 via-transparent to-transparent pointer-events-none" />
        {entry && (
          <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between z-10">
            <div>
              <span className="text-[#ff1680] font-mono text-xs font-bold uppercase tracking-[.2em]">TIER {entry.tier}</span>
              <h2
                className="text-3xl md:text-5xl font-bold text-[#fff9df] mt-1"
                style={{ fontFamily: "'Space Grotesk', Georgia, serif", letterSpacing: "-.04em" }}
              >
                {entry.tierLabel}
              </h2>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── User Card ─────────────────────────────────────────────────── */
function UserCard({ entry }: { entry: ShackEntry }) {
  return (
    <div className="w-full max-w-3xl mx-auto bg-[#043c27]/70 border-2 border-[#fff9df]/20 rounded-sm p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
      <div className="relative w-24 h-24 md:w-28 md:h-28 shrink-0">
        {entry.avatarUrl ? (
          <Image src={entry.avatarUrl} alt={entry.username} fill className="rounded-sm object-cover border-2 border-[#f8db19]" />
        ) : (
          <div className="w-full h-full rounded-sm bg-[#075b39] flex items-center justify-center border-2 border-[#f8db19]">
            <Github className="w-10 h-10 text-[#f8db19]" />
          </div>
        )}
      </div>

      <div className="flex-1 text-center md:text-left space-y-1">
        <p className="text-[#ff1680] font-mono text-xs font-bold uppercase tracking-[.2em]">GITHUB SHACK</p>
        <h1
          className="text-2xl md:text-3xl font-bold text-[#fff9df]"
          style={{ fontFamily: "'Space Grotesk', Georgia, serif" }}
        >
          @{entry.username}
        </h1>
        <p className="text-[#fff9df]/60 font-mono text-sm">{entry.tierLabel} · Tier {entry.tier}</p>
      </div>

      <div className="flex gap-4">
        <div className="bg-[#075b39] border border-[#fff9df]/10 rounded-sm px-5 py-4 flex flex-col items-center text-center min-w-[80px]">
          <Trophy className="w-4 h-4 text-[#fff9df]/50 mb-2" />
          <span className="text-2xl font-bold text-[#fff9df]">{entry.commits.toLocaleString()}</span>
          <span className="text-[10px] font-mono text-[#fff9df]/50 uppercase tracking-widest mt-1">Commits</span>
        </div>
        <div className="bg-[#075b39] border border-[#f8db19]/30 rounded-sm px-5 py-4 flex flex-col items-center text-center min-w-[80px] shadow-[4px_4px_0_#ff1680]">
          <Beer className="w-4 h-4 text-[#f8db19] mb-2" />
          <span className="text-2xl font-bold text-[#f8db19]">{entry.pints.toLocaleString()}</span>
          <span className="text-[10px] font-mono text-[#f8db19]/70 uppercase tracking-widest mt-1">Pints</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Leaderboard ────────────────────────────────────────────────── */
function Leaderboard({ entries }: { entries: ShackEntry[] }) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-12 bg-[#043c27]/50 border border-[#fff9df]/10 rounded-sm">
        <p className="text-[#fff9df]/50 font-mono text-sm">No entries yet. Be the first to check your shack!</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#043c27]/50 border border-[#fff9df]/10 rounded-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-[#fff9df]/10 flex items-center gap-3">
        <Trophy className="w-5 h-5 text-[#f8db19]" />
        <div>
          <h2
            className="text-[#fff9df] font-bold text-lg"
            style={{ fontFamily: "'Space Grotesk', Georgia, serif" }}
          >
            Cracked Dev Leaderboard
          </h2>
          <p className="text-[#fff9df]/40 font-mono text-xs mt-0.5">5 commits = 1 pint · ranked by commits</p>
        </div>
      </div>

      <div className="divide-y divide-[#fff9df]/5">
        {entries.map((entry, idx) => (
          <div key={entry.username} className="flex items-center gap-4 px-5 py-4 hover:bg-[#075b39]/40 transition-colors">
            <span className={`font-mono font-bold text-lg w-8 text-right shrink-0 ${idx === 0 ? "text-[#f8db19]" : idx === 1 ? "text-[#fff9df]/60" : idx === 2 ? "text-amber-700" : "text-[#fff9df]/20"}`}>
              #{idx + 1}
            </span>

            <div className="relative w-10 h-10 shrink-0">
              {entry.avatarUrl ? (
                <Image src={entry.avatarUrl} alt={entry.username} fill className="rounded-sm object-cover border border-[#f8db19]/40" />
              ) : (
                <div className="w-full h-full rounded-sm bg-[#075b39] flex items-center justify-center border border-[#fff9df]/10">
                  <Github className="w-4 h-4 text-[#fff9df]/30" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <a
                href={`https://github.com/${entry.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#fff9df] font-mono font-bold text-sm hover:text-[#f8db19] transition-colors truncate block"
              >
                @{entry.username}
              </a>
              <span className="text-[#ff1680] font-mono text-xs">{entry.tierLabel}</span>
            </div>

            <div className="hidden md:flex flex-col items-end">
              <span className="text-[#fff9df] font-mono font-bold text-sm">{entry.commits.toLocaleString()}</span>
              <span className="text-[#fff9df]/30 font-mono text-[10px]">commits</span>
            </div>

            <div className="bg-[#075b39] border border-[#f8db19]/30 rounded-sm px-3 py-1.5 flex items-center gap-1.5 shadow-[3px_3px_0_#ff1680] shrink-0">
              <Beer className="w-3.5 h-3.5 text-[#f8db19]" />
              <span className="text-[#f8db19] font-mono font-bold text-sm">{entry.pints}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────── */
export default function ShackPage() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [entry, setEntry] = useState<ShackEntry | null>(null);
  const [leaderboard, setLeaderboard] = useState<ShackEntry[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    fetch("/api/github-shack/leaderboard")
      .then((r) => r.ok ? r.json() : null)
      .then((d) => d && setLeaderboard(d.entries || []))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = username.trim();
    if (!clean) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/github-shack?username=${encodeURIComponent(clean)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch data");
      setEntry(data.entry);
      if (data.leaderboard) setLeaderboard(data.leaderboard);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen text-[#fff9df] pb-24 selection:bg-[#f8db19]/30" style={{ background: "radial-gradient(circle at 70% 35%, #128052 0, #075b39 46%, #043c27 100%)" }}>

      {/* Header */}
      <header className="relative z-10 border-b border-[#fff9df]/10 bg-[#043c27]/60 backdrop-blur-md">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[#fff9df]/70 hover:text-[#fff9df] transition-colors text-xs font-mono uppercase tracking-widest">
            <ArrowLeft className="w-3.5 h-3.5" />
            Hacker House Goa
          </Link>
          <span className="text-[#ff1680] font-mono text-xs font-bold uppercase tracking-[.2em]">🛖 GitHub Shack</span>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 pt-14 md:pt-20 max-w-4xl">
        {/* Hero */}
        <div className="text-center mb-14">
          <p className="text-[#ff1680] font-mono text-xs font-bold uppercase tracking-[.25em] mb-4">
            HACKER HOUSE GOA · 28–31 OCT 2026
          </p>
          <h1
            className="text-5xl md:text-7xl font-black text-[#fff9df] mb-5"
            style={{ fontFamily: "'Space Grotesk', Georgia, serif", letterSpacing: "-.05em" }}
          >
            How stacked<br />
            <em className="text-[#f8db19] not-italic">is your shack?</em>
          </h1>
          <p className="text-[#fff9df]/60 font-mono text-sm max-w-sm mx-auto leading-relaxed">
            Type your GitHub username. Every 5 commits earns you a pint. See where you rank on the leaderboard.
          </p>
        </div>

        {/* Base shack image always visible */}
        <div className="mb-10">
          <ShackVisual entry={entry} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="relative max-w-lg mx-auto mb-14 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Github className="h-5 w-5 text-[#fff9df]/30 group-focus-within:text-[#f8db19] transition-colors" />
          </div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="your-github-username"
            className="w-full bg-[#043c27] border-2 border-[#fff9df]/20 focus:border-[#f8db19] rounded-sm py-4 pl-12 pr-36 text-[#fff9df] placeholder-[#fff9df]/25 focus:outline-none focus:bg-[#043c27]/80 transition-all text-sm font-mono shadow-[6px_6px_0_#ff1680]"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
          <button
            type="submit"
            disabled={loading || !username.trim()}
            className="absolute right-1.5 top-1.5 bottom-1.5 px-5 bg-[#f8db19] hover:bg-[#f8db19]/90 text-[#075b39] font-mono text-xs font-bold uppercase tracking-widest rounded-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Search className="w-3.5 h-3.5" /><span>Check</span></>}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="mb-8 max-w-lg mx-auto px-5 py-4 bg-[#ff1680]/10 border border-[#ff1680]/30 rounded-sm text-[#ff1680] font-mono text-sm text-center">
            {error}
          </div>
        )}

        {/* Result */}
        {entry && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20 animate-in fade-in slide-in-from-bottom-6 duration-500 items-start">
            <div className="lg:col-span-2 space-y-6">
              <UserCard entry={entry} />
            </div>
            <div className="flex justify-center w-full">
              <TarotCard commits={entry.commits} />
            </div>
          </div>
        )}

        {/* Leaderboard */}
        <Leaderboard entries={leaderboard} />
      </main>
    </div>
  );
}
