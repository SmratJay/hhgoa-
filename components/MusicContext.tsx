"use client";

import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from "react";

export interface Track {
  title: string;
  artist: string;
  src: string;
  pattern: WavePattern;
}

export type WavePattern = "ocean" | "vortex" | "cascade" | "pulse";

export const PLAYLIST: Track[] = [
  { title: "Stereogenic Ocean Sound", artist: "Stereogenic Studio", src: "/music/stereogenicstudio-beach-02-404144.mp3", pattern: "ocean" },
  { title: "Beach Atmosphere",       artist: "Sound Reality",      src: "/music/soundreality-beach-atmosphere-408792.mp3", pattern: "pulse" },
  { title: "Chill Lofi Hip Hop",     artist: "Vibehorn",           src: "/music/vibehorn-chill-lofi-hip-hop-482143.mp3",     pattern: "vortex" },
  { title: "8-Bit Game Chiptune",    artist: "Freesound Community",src: "/music/freesound_community-gamemusic-6082.mp3",     pattern: "cascade" },
  { title: "Rainy ASMR Soundscape",  artist: "Seeking Nexus Media",src: "/music/seekingnexusmedia-rainy-asmr-soundscape-1-work-from-home-sounds-560019.mp3", pattern: "ocean" },
];

interface MusicContextValue {
  isPlaying: boolean;
  currentIdx: number;
  progress: number;
  wavePattern: WavePattern;
  track: Track;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  seekTo: (idx: number) => void;
}

const MusicContext = createContext<MusicContextValue | null>(null);

export function useMusicContext() {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error("useMusicContext must be inside MusicProvider");
  return ctx;
}

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying]   = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [progress, setProgress]     = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPlayingRef = useRef(false);
  isPlayingRef.current = isPlaying;

  // Helper to play current audio safely
  const attemptPlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
        // Instant gesture handler on any mouse move, touch, click, scroll or key
        const handleUserGesture = () => {
          if (!audioRef.current) return;
          audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
          window.removeEventListener("pointerdown", handleUserGesture);
          window.removeEventListener("touchstart", handleUserGesture);
          window.removeEventListener("mousemove", handleUserGesture);
          window.removeEventListener("scroll", handleUserGesture);
          window.removeEventListener("keydown", handleUserGesture);
        };
        window.addEventListener("pointerdown", handleUserGesture, { once: true });
        window.addEventListener("touchstart", handleUserGesture, { once: true });
        window.addEventListener("mousemove", handleUserGesture, { once: true });
        window.addEventListener("scroll", handleUserGesture, { once: true });
        window.addEventListener("keydown", handleUserGesture, { once: true });
      });
    }
  }, []);

  // Initialize audio element once
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "auto";
    audioRef.current = audio;

    const onTimeUpdate = () => {
      if (audio.duration) setProgress(audio.currentTime / audio.duration);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);

    // Initial load: set default track 0 and attempt autoplay
    audio.src = PLAYLIST[0].src;
    audio.load();
    attemptPlay();

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [attemptPlay]);

  // Handle track ended -> automatically play NEXT track!
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onEnded = () => {
      const nextIdx = (currentIdx + 1) % PLAYLIST.length;
      setCurrentIdx(nextIdx);
      setProgress(0);
      audio.src = PLAYLIST[nextIdx].src;
      audio.load();
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    };

    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("ended", onEnded);
    };
  }, [currentIdx]);

  const playTrackIndex = useCallback((nextIdx: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setCurrentIdx(nextIdx);
    setProgress(0);
    audio.src = PLAYLIST[nextIdx].src;
    audio.load();
    audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlayingRef.current) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, []);

  const next = useCallback(() => {
    const nextIdx = (currentIdx + 1) % PLAYLIST.length;
    playTrackIndex(nextIdx);
  }, [currentIdx, playTrackIndex]);

  const prev = useCallback(() => {
    const prevIdx = (currentIdx - 1 + PLAYLIST.length) % PLAYLIST.length;
    playTrackIndex(prevIdx);
  }, [currentIdx, playTrackIndex]);

  const seekTo = useCallback((idx: number) => {
    playTrackIndex(idx);
  }, [playTrackIndex]);

  const track = PLAYLIST[currentIdx];

  return (
    <MusicContext.Provider value={{
      isPlaying, currentIdx, progress,
      wavePattern: track.pattern,
      track, togglePlay, next, prev, seekTo,
    }}>
      {children}
    </MusicContext.Provider>
  );
}
