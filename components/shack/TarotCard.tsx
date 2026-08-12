"use client";

import { useState } from "react";
import { getTarotArchetype } from "@/lib/shack-tarot";
import { Compass, Flame, Sparkles, Moon, Sun, Coffee, HelpCircle, Swords, Skull, Eye } from "lucide-react";

interface TarotCardProps {
  commits: number;
}

export function TarotCard({ commits }: TarotCardProps) {
  const archetype = getTarotArchetype(commits);
  const [isFlipped, setIsFlipped] = useState(false);

  // Map icons for cards
  const getIcon = () => {
    if (commits < 100) return <Sun className="w-10 h-10 text-[#f8db19] animate-pulse" />;
    if (commits < 500) return <Compass className="w-10 h-10 text-[#f8db19]" />;
    if (commits < 800) return <Coffee className="w-10 h-10 text-[#f8db19]" />;
    if (commits < 1500) return <Moon className="w-10 h-10 text-[#f8db19]" />;
    return <Flame className="w-10 h-10 text-[#f8db19] animate-bounce" />;
  };

  const cardStyle: React.CSSProperties = {
    perspective: "1000px",
  };

  const innerStyle: React.CSSProperties = {
    transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
    transformStyle: "preserve-3d",
    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
  };

  const faceStyle: React.CSSProperties = {
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  };

  return (
    <div 
      className="w-full max-w-sm mx-auto aspect-[3/4.2] cursor-pointer group"
      style={cardStyle}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div 
        className="relative w-full h-full transform-style-3d select-none"
        style={innerStyle}
      >
        
        {/* ─── FRONT FACE ─── */}
        <div 
          className="bg-[#043c27] border-4 border-double border-[#f8db19] rounded-lg p-5 shadow-[10px_10px_0_#ff1680] font-mono text-xs flex flex-col justify-between"
          style={faceStyle}
        >
          {/* Mystical corner designs */}
          <div className="absolute top-1.5 left-1.5 text-[#f8db19] text-[8px] font-bold">✦</div>
          <div className="absolute top-1.5 right-1.5 text-[#f8db19] text-[8px] font-bold">✦</div>
          <div className="absolute bottom-1.5 left-1.5 text-[#f8db19] text-[8px] font-bold">✦</div>
          <div className="absolute bottom-1.5 right-1.5 text-[#f8db19] text-[8px] font-bold">✦</div>

          {/* Title block */}
          <div className="border-b border-[#f8db19]/30 pb-3 text-center">
            <span className="text-[#ff1680] text-[9px] font-bold uppercase tracking-[0.2em] block mb-1">
              Hacker House Goa Archetype
            </span>
            <h3 className="text-lg font-bold text-[#fff9df] uppercase tracking-wider" style={{ fontFamily: "Georgia, serif" }}>
              {archetype.name}
            </h3>
            <p className="text-[#fff9df]/60 text-[9px] italic mt-0.5">{archetype.subtitle}</p>
          </div>

          {/* Card Artwork */}
          <div className="aspect-[4/3] bg-[#075b39] border border-[#f8db19]/20 rounded-sm flex flex-col items-center justify-center relative overflow-hidden my-3 shrink-0">
            <div className="absolute w-24 h-24 rounded-full bg-[#f8db19]/5 border border-[#f8db19]/10 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-[#f8db19]/5 border border-[#f8db19]/20 flex items-center justify-center">
                {getIcon()}
              </div>
            </div>
            <span className="absolute bottom-2 text-[#fff9df]/40 text-[9px] tracking-widest uppercase">
              CARD NO. {commits}
            </span>
          </div>

          {/* Stats list */}
          <div className="space-y-2 mb-3 border-b border-[#f8db19]/20 pb-3 flex-1 flex flex-col justify-center">
            {archetype.stats.map((stat) => (
              <div key={stat.label} className="space-y-1">
                <div className="flex justify-between text-[#fff9df]/80 text-[10px]">
                  <span className="uppercase tracking-wider">{stat.label}</span>
                  <span className="font-bold text-[#f8db19]">{stat.value}%</span>
                </div>
                <div className="h-1.5 bg-[#075b39] rounded-sm overflow-hidden border border-[#fff9df]/10">
                  <div
                    className="h-full bg-gradient-to-r from-[#f8db19] to-[#ff1680] rounded-sm transition-all duration-1000"
                    style={{ width: `${stat.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Perk & Bio Footer */}
          <div className="space-y-3 shrink-0">
            <div>
              <span className="text-[#ff1680] font-bold uppercase tracking-wider text-[9px] block mb-1">
                ACTIVE PERK:
              </span>
              <div className="bg-[#075b39] border border-[#ff1680]/20 rounded-sm px-2.5 py-1.5 flex items-center gap-2 text-[#fff9df]">
                <Sparkles className="w-3.5 h-3.5 text-[#f8db19] shrink-0" />
                <span className="font-bold text-[9px] tracking-wide uppercase text-amber-300 truncate">
                  {archetype.perk}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[#fff9df]/40 text-[9px] pt-1">
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3 text-[#ff1680]" /> Click to inspect details
              </span>
              <span>↻ FLIP</span>
            </div>
          </div>
        </div>

        {/* ─── BACK FACE ─── */}
        <div 
          className="bg-[#043c27] border-4 border-double border-[#ff1680] rounded-lg p-5 shadow-[10px_10px_0_#f8db19] font-mono text-xs flex flex-col justify-between"
          style={{
            ...faceStyle,
            transform: "rotateY(180deg)",
          }}
        >
          {/* Mystical corner designs */}
          <div className="absolute top-1.5 left-1.5 text-[#ff1680] text-[8px] font-bold">✦</div>
          <div className="absolute top-1.5 right-1.5 text-[#ff1680] text-[8px] font-bold">✦</div>
          <div className="absolute bottom-1.5 left-1.5 text-[#ff1680] text-[8px] font-bold">✦</div>
          <div className="absolute bottom-1.5 right-1.5 text-[#ff1680] text-[8px] font-bold">✦</div>

          {/* Title block */}
          <div className="border-b border-[#ff1680]/30 pb-3 text-center">
            <span className="text-[#f8db19] text-[9px] font-bold uppercase tracking-[0.2em] block mb-1">
              Hacker Alignment & Quests
            </span>
            <h3 className="text-lg font-bold text-[#fff9df] uppercase tracking-wider" style={{ fontFamily: "Georgia, serif" }}>
              {archetype.alignment}
            </h3>
            <p className="text-[#fff9df]/60 text-[9px] mt-0.5 uppercase tracking-widest text-[#ff1680]">
              {archetype.codingHours}
            </p>
          </div>

          {/* Mystical Quote */}
          <div className="bg-[#075b39] border border-[#ff1680]/20 rounded-sm p-3 text-center italic text-[#fff9df]/90 my-3 text-[10px] leading-relaxed shrink-0">
            {archetype.quote}
          </div>

          {/* Deep Details List */}
          <div className="space-y-3 flex-1 flex flex-col justify-center">
            <div>
              <span className="text-[#f8db19] font-bold uppercase tracking-wider text-[9px] flex items-center gap-1.5">
                <Swords className="w-3.5 h-3.5 text-[#ff1680]" /> Weapon of Choice
              </span>
              <p className="text-[#fff9df]/80 text-[10px] mt-1 pl-5">
                {archetype.weaponOfChoice}
              </p>
            </div>

            <div>
              <span className="text-[#f8db19] font-bold uppercase tracking-wider text-[9px] flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#ff1680]" /> Active Quest
              </span>
              <p className="text-[#fff9df]/80 text-[10px] mt-1 pl-5 leading-normal">
                {archetype.quest}
              </p>
            </div>

            <div>
              <span className="text-[#ff1680] font-bold uppercase tracking-wider text-[9px] flex items-center gap-1.5">
                <Skull className="w-3.5 h-3.5 text-[#ff1680]" /> Secret Weakness
              </span>
              <p className="text-[#fff9df]/80 text-[10px] mt-1 pl-5">
                {archetype.weakness}
              </p>
            </div>
          </div>

          {/* Footer controls */}
          <div className="pt-3 border-t border-[#ff1680]/20 flex items-center justify-between text-[#fff9df]/40 text-[9px] shrink-0">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3 text-[#f8db19]" /> Click to view stats
            </span>
            <span>↻ FLIP</span>
          </div>

        </div>

      </div>
    </div>
  );
}
