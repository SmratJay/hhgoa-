import Image from "next/image";
import { type ShackEntry } from "@/lib/github-shack";

interface ShackVisualProps {
  entry: ShackEntry;
}

export function ShackVisual({ entry }: ShackVisualProps) {
  return (
    <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-xl shadow-2xl border border-white/10 group">
      <div className="aspect-[16/9] relative w-full h-full bg-slate-900 flex items-center justify-center">
        {/* We use next/image to optimize the large tier images */}
        <Image
          src={entry.tierAsset}
          alt={`Tier ${entry.tier} Goa Shack`}
          fill
          className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
          priority
        />
        
        {/* Overlay gradient for text readability at the bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
        
        <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between z-10">
          <div>
            <h2 className="text-3xl md:text-5xl font-black text-white drop-shadow-md tracking-tight">
              {entry.tierLabel}
            </h2>
            <p className="text-white/80 text-lg md:text-xl font-medium mt-1 drop-shadow">
              Tier {entry.tier}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
