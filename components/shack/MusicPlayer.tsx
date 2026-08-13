"use client";

import { useState } from "react";
import { useMusicContext, PLAYLIST } from "@/components/MusicContext";

const PATTERN_LABELS: Record<string, string> = {
  ocean:   "🌊 Ocean",
  vortex:  "🌀 Vortex",
  cascade: "🌧️ Cascade",
  pulse:   "💥 Pulse",
};

export function MusicPlayer() {
  const { isPlaying, currentIdx, progress, wavePattern, track, togglePlay, next, prev, seekTo } = useMusicContext();
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none" style={{ fontFamily: "'Geist Mono', monospace" }}>

      {/* ── Collapsed pill ── */}
      {!expanded ? (
        <button
          onClick={() => setExpanded(true)}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-[#f8db19]/30 bg-[#043c27]/90 backdrop-blur-md text-[#fff9df] hover:border-[#f8db19] transition-all shadow-[0_4px_24px_rgba(0,0,0,0.4)] hover:shadow-[0_4px_32px_rgba(248,219,25,0.2)]"
          title="Open Music Player"
        >
          {/* Vinyl */}
          <div className="relative w-7 h-7 shrink-0">
            <svg viewBox="0 0 32 32" className={`w-7 h-7 ${isPlaying ? "animate-spin [animation-duration:3s]" : ""}`}>
              <circle cx="16" cy="16" r="15" fill="#111" stroke="#f8db19" strokeWidth="1.5"/>
              <circle cx="16" cy="16" r="10" fill="none" stroke="#333" strokeWidth="3"/>
              <circle cx="16" cy="16" r="5"  fill="none" stroke="#555" strokeWidth="2"/>
              <circle cx="16" cy="16" r="2.5" fill="#f8db19"/>
            </svg>
            {isPlaying && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#ff1680] rounded-full animate-pulse" />}
          </div>
          <span className="text-[10px] uppercase tracking-widest text-[#fff9df]/60 max-w-[80px] truncate">
            {isPlaying ? track.title : "Beach Mix"}
          </span>
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 text-[#fff9df]/40 rotate-180">
            <path d="M2 8l6-6 6 6"/>
          </svg>
        </button>

      ) : (
        /* ── Expanded player ── */
        <div className="w-72 rounded-xl border border-[#f8db19]/30 bg-[#043c27]/95 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.5),0_0_0_1px_rgba(248,219,25,0.08)] overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#fff9df]/10">
            <span className="text-[#ff1680] text-[9px] font-bold uppercase tracking-widest">🛖 Beach Mix</span>
            <button onClick={() => setExpanded(false)} className="text-[#fff9df]/30 hover:text-[#fff9df] transition-colors text-xs" title="Minimize">▼</button>
          </div>

          {/* Vinyl art */}
          <div className="flex flex-col items-center justify-center py-6 gap-2 bg-[#033221]">
            <div className="relative">
              <svg viewBox="0 0 100 100" className={`w-24 h-24 drop-shadow-2xl ${isPlaying ? "animate-spin [animation-duration:4s]" : ""}`}>
                <circle cx="50" cy="50" r="48" fill="#111" stroke="#f8db19" strokeWidth="2"/>
                {[42, 36, 30, 24].map((r) => (
                  <circle key={r} cx="50" cy="50" r={r} fill="none" stroke="#1f1f1f" strokeWidth="2"/>
                ))}
                <circle cx="50" cy="50" r="12" fill="#1a1a1a"/>
                <circle cx="50" cy="50" r="5" fill="#f8db19"/>
              </svg>
              {isPlaying && <div className="absolute inset-0 rounded-full border-2 border-[#ff1680]/30 animate-ping"/>}
            </div>
            {/* Wave pattern badge */}
            <span className="text-[9px] font-mono uppercase tracking-widest text-[#fff9df]/30 border border-[#fff9df]/10 rounded-full px-2 py-0.5">
              {PATTERN_LABELS[wavePattern]}
            </span>
          </div>

          {/* Track info */}
          <div className="px-4 py-3 text-center border-b border-[#fff9df]/10">
            <p className="text-[#fff9df] text-sm font-bold truncate" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{track.title}</p>
            <p className="text-[#fff9df]/40 text-[10px] uppercase tracking-widest mt-0.5">{track.artist}</p>
          </div>

          {/* Progress */}
          <div className="px-4 pt-3">
            <div className="h-1 bg-[#075b39] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#f8db19] to-[#ff1680] rounded-full transition-all duration-300"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-5 px-4 py-4">
            <button onClick={prev} className="text-[#fff9df]/50 hover:text-[#fff9df] transition-colors" title="Previous">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/></svg>
            </button>

            <button
              onClick={togglePlay}
              className="w-12 h-12 rounded-full bg-[#f8db19] hover:bg-[#f8db19]/90 text-[#043c27] flex items-center justify-center shadow-[0_4px_16px_rgba(248,219,25,0.4)] transition-all hover:scale-105 active:scale-95"
            >
              {isPlaying
                ? <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                : <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-0.5"><path d="M8 5v14l11-7z"/></svg>
              }
            </button>

            <button onClick={next} className="text-[#fff9df]/50 hover:text-[#fff9df] transition-colors" title="Next">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
            </button>
          </div>

          {/* Playlist */}
          <div className="border-t border-[#fff9df]/10">
            {PLAYLIST.map((t, i) => (
              <button
                key={t.src}
                onClick={() => seekTo(i)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                  i === currentIdx ? "bg-[#075b39] text-[#f8db19]" : "text-[#fff9df]/40 hover:bg-[#075b39]/50 hover:text-[#fff9df]"
                }`}
              >
                <span className="text-[9px] font-mono font-bold w-4 text-right shrink-0">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold truncate">{t.title}</p>
                  <p className="text-[9px] opacity-50 truncate">{PATTERN_LABELS[t.pattern]}</p>
                </div>
                {i === currentIdx && isPlaying && <span className="w-2 h-2 rounded-full bg-[#ff1680] animate-pulse shrink-0"/>}
              </button>
            ))}
          </div>

          <div className="px-4 py-2 border-t border-[#fff9df]/10">
            <p className="text-[#fff9df]/20 text-[9px] text-center uppercase tracking-widest">Add tracks to /public/music/</p>
          </div>
        </div>
      )}
    </div>
  );
}
