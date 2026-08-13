"use client";

import { useState } from "react";
import { getTarotArchetype } from "@/lib/shack-tarot";
import { Compass, Flame, Sparkles, Moon, Sun, Coffee, Eye, Swords, Skull } from "lucide-react";

interface TarotCardProps {
  commits: number;
}

export function TarotCard({ commits }: TarotCardProps) {
  const archetype = getTarotArchetype(commits);
  const [isFlipped, setIsFlipped] = useState(false);

  const getIcon = () => {
    if (commits < 100) return <Sun className="w-10 h-10 text-[#f8db19] animate-pulse" />;
    if (commits < 500) return <Compass className="w-10 h-10 text-[#f8db19]" />;
    if (commits < 800) return <Coffee className="w-10 h-10 text-[#f8db19]" />;
    if (commits < 1500) return <Moon className="w-10 h-10 text-[#f8db19]" />;
    return <Flame className="w-10 h-10 text-[#f8db19] animate-bounce" />;
  };

  return (
    <div
      className="w-full max-w-[300px] mx-auto cursor-pointer select-none"
      style={{ perspective: "1200px", aspectRatio: "3/4.4" }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      {/* Flip container — MUST be relative + sized for absolute children */}
      <div
        className="relative w-full h-full"
        style={{
          transformStyle: "preserve-3d",
          transition: "transform 0.85s cubic-bezier(0.23, 1, 0.32, 1)",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* ─── FRONT FACE — ARCHETYPE ─── */}
        <div
          className="absolute inset-0 rounded-xl overflow-hidden"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
        >
          {/* Pink offset shadow rendered as a pseudo-layer behind */}
          <div className="absolute inset-0 rounded-xl bg-[#ff1680] translate-x-[10px] translate-y-[10px] -z-10" />

          <div className="relative w-full h-full bg-[#043c27] border-4 border-double border-[#f8db19] rounded-xl p-4 font-mono text-xs flex flex-col overflow-hidden">
            {/* Corner dots */}
            <span className="absolute top-2 left-2 text-[#f8db19] text-[9px]">✦</span>
            <span className="absolute top-2 right-2 text-[#f8db19] text-[9px]">✦</span>
            <span className="absolute bottom-2 left-2 text-[#f8db19] text-[9px]">✦</span>
            <span className="absolute bottom-2 right-2 text-[#f8db19] text-[9px]">✦</span>

            {/* Title — ARCHETYPE (larger) */}
            <div className="border-b border-[#f8db19]/30 pb-2.5 mb-2.5 text-center shrink-0">
              <span className="text-[#ff1680] text-[9px] font-bold uppercase tracking-[0.2em] block mb-1">
                Hacker House Goa Archetype
              </span>
              <h3
                className="text-xl font-black text-[#fff9df] uppercase leading-tight"
                style={{ fontFamily: "'Space Grotesk', Georgia, serif", letterSpacing: "-0.03em" }}
              >
                {archetype.name}
              </h3>
              <p className="text-[#fff9df]/50 text-[9px] italic mt-0.5">{archetype.subtitle}</p>
            </div>

            {/* Card Artwork */}
            <div className="bg-[#075b39] border border-[#f8db19]/20 rounded-md flex flex-col items-center justify-center relative overflow-hidden shrink-0 mb-2.5" style={{ aspectRatio: "4/2.8" }}>
              <div className="absolute w-20 h-20 rounded-full bg-[#f8db19]/5 border border-[#f8db19]/10 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-[#f8db19]/5 border border-[#f8db19]/20 flex items-center justify-center">
                  {getIcon()}
                </div>
              </div>
              <span className="absolute bottom-2 text-[#fff9df]/40 text-[8px] tracking-widest uppercase">
                CARD NO. {commits}
              </span>
            </div>

            {/* Stats */}
            <div className="space-y-1.5 flex-1 border-b border-[#f8db19]/20 pb-2.5 mb-2.5 overflow-hidden">
              {archetype.stats.map((stat) => (
                <div key={stat.label}>
                  <div className="flex justify-between text-[#fff9df]/70 text-[9px] mb-0.5">
                    <span className="uppercase tracking-wider">{stat.label}</span>
                    <span className="font-bold text-[#f8db19]">{stat.value}%</span>
                  </div>
                  <div className="h-1 bg-[#075b39] rounded-full overflow-hidden border border-[#fff9df]/10">
                    <div
                      className="h-full bg-gradient-to-r from-[#f8db19] to-[#ff1680] rounded-full transition-all duration-1000"
                      style={{ width: `${stat.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Perk */}
            <div className="shrink-0 space-y-2">
              <div>
                <span className="text-[#ff1680] font-bold uppercase tracking-wider text-[9px] block mb-1">ACTIVE PERK:</span>
                <div className="bg-[#075b39] border border-[#ff1680]/20 rounded-sm px-2 py-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#f8db19] shrink-0" />
                  <span className="font-bold text-[9px] tracking-wide uppercase text-amber-300 truncate">
                    {archetype.perk}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-[#fff9df]/30 text-[9px]">
                <span className="flex items-center gap-1"><Eye className="w-3 h-3 text-[#ff1680]" /> Tap to flip</span>
                <span>↻ FLIP</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── BACK FACE — ALIGNMENT & QUESTS ─── */}
        <div
          className="absolute inset-0 rounded-xl overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {/* Yellow offset shadow for back */}
          <div className="absolute inset-0 rounded-xl bg-[#f8db19] translate-x-[10px] translate-y-[10px] -z-10" />

          <div className="relative w-full h-full bg-[#043c27] border-4 border-double border-[#ff1680] rounded-xl p-4 font-mono text-xs flex flex-col overflow-hidden">
            {/* Corner dots */}
            <span className="absolute top-2 left-2 text-[#ff1680] text-[9px]">✦</span>
            <span className="absolute top-2 right-2 text-[#ff1680] text-[9px]">✦</span>
            <span className="absolute bottom-2 left-2 text-[#ff1680] text-[9px]">✦</span>
            <span className="absolute bottom-2 right-2 text-[#ff1680] text-[9px]">✦</span>

            {/* Title — ALIGNMENT (smaller, compact) */}
            <div className="border-b border-[#ff1680]/30 pb-2.5 mb-2.5 text-center shrink-0">
              <span className="text-[#f8db19] text-[9px] font-bold uppercase tracking-[0.2em] block mb-0.5">
                Hacker Alignment &amp; Quests
              </span>
              <h3
                className="text-sm font-bold text-[#fff9df] uppercase leading-tight"
                style={{ fontFamily: "'Space Grotesk', Georgia, serif", letterSpacing: "0.01em" }}
              >
                {archetype.alignment}
              </h3>
              <p className="text-[#ff1680] text-[9px] mt-0.5 uppercase tracking-widest">
                {archetype.codingHours}
              </p>
            </div>

            {/* Quote */}
            <div className="bg-[#075b39] border border-[#ff1680]/20 rounded-md p-2.5 text-center italic text-[#fff9df]/85 mb-2.5 text-[10px] leading-relaxed shrink-0">
              {archetype.quote}
            </div>

            {/* Details */}
            <div className="space-y-3 flex-1 overflow-hidden">
              <div>
                <span className="text-[#f8db19] font-bold uppercase tracking-wider text-[9px] flex items-center gap-1">
                  <Swords className="w-3 h-3 text-[#ff1680]" /> Weapon of Choice
                </span>
                <p className="text-[#fff9df]/70 text-[10px] mt-0.5 pl-4 leading-relaxed">{archetype.weaponOfChoice}</p>
              </div>
              <div>
                <span className="text-[#f8db19] font-bold uppercase tracking-wider text-[9px] flex items-center gap-1">
                  <Compass className="w-3 h-3 text-[#ff1680]" /> Active Quest
                </span>
                <p className="text-[#fff9df]/70 text-[10px] mt-0.5 pl-4 leading-relaxed">{archetype.quest}</p>
              </div>
              <div>
                <span className="text-[#ff1680] font-bold uppercase tracking-wider text-[9px] flex items-center gap-1">
                  <Skull className="w-3 h-3 text-[#ff1680]" /> Secret Weakness
                </span>
                <p className="text-[#fff9df]/70 text-[10px] mt-0.5 pl-4 leading-relaxed">{archetype.weakness}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-2.5 border-t border-[#ff1680]/20 flex items-center justify-between text-[#fff9df]/30 text-[9px] shrink-0">
              <span className="flex items-center gap-1"><Eye className="w-3 h-3 text-[#f8db19]" /> Tap to view stats</span>
              <span>↻ FLIP</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
