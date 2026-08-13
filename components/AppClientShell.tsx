"use client";

import React from "react";
import { MusicProvider } from "@/components/MusicContext";
import { GlobalBackgroundParticles } from "@/components/GlobalBackgroundParticles";
import { MusicPlayer } from "@/components/shack/MusicPlayer";

export function AppClientShell({ children }: { children: React.ReactNode }) {
  return (
    <MusicProvider>
      <GlobalBackgroundParticles />
      {children}
      <MusicPlayer />
    </MusicProvider>
  );
}
