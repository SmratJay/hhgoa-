"use client";

import { useMusicContext } from "@/components/MusicContext";
import { BeachParticles } from "@/components/shack/BeachParticles";

export function GlobalBackgroundParticles() {
  const { isPlaying, wavePattern } = useMusicContext();
  return <BeachParticles isPlaying={isPlaying} wavePattern={wavePattern} />;
}
