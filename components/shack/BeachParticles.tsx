"use client";

import { useEffect, useRef } from "react";
import { type WavePattern } from "@/components/MusicContext";

interface BeachParticlesProps {
  isPlaying?: boolean;
  wavePattern?: WavePattern;
}

// HHGOA color palette [r,g,b]
const PALETTE = {
  green:   [7,   140,  74],
  yellow:  [248, 219,  25],
  pink:    [255,  22, 128],
  cream:   [255, 249, 223],
  dark:    [4,   60,  39],
} as const;

type Rgb = readonly [number, number, number];

// Per-pattern color weight tables  [green, yellow, pink, cream, dark]
const PATTERN_COLORS: Record<WavePattern, Rgb[]> = {
  ocean:   [PALETTE.green, PALETTE.green, PALETTE.dark, PALETTE.cream, PALETTE.yellow],
  vortex:  [PALETTE.green, PALETTE.yellow, PALETTE.pink, PALETTE.dark, PALETTE.cream],
  cascade: [PALETTE.dark, PALETTE.green, PALETTE.cream, PALETTE.yellow, PALETTE.pink],
  pulse:   [PALETTE.green, PALETTE.pink, PALETTE.yellow, PALETTE.dark, PALETTE.cream],
};

export function BeachParticles({ isPlaying = false, wavePattern = "ocean" }: BeachParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  // Keep a ref to current pattern so the animation loop always reads the latest
  const patternRef   = useRef<WavePattern>(wavePattern);
  const playingRef   = useRef(isPlaying);

  useEffect(() => { patternRef.current   = wavePattern; }, [wavePattern]);
  useEffect(() => { playingRef.current   = isPlaying;   }, [isPlaying]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const CELL = 13;
    const GAP  = 3;
    const STEP = CELL + GAP;
    const R    = 3;    // border radius

    let cols = 0, rows = 0;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      cols = Math.ceil(canvas.width  / STEP) + 2;
      rows = Math.ceil(canvas.height / STEP) + 2;
    };
    resize();
    window.addEventListener("resize", resize);

    // Fast rounded-rect fill
    const fillRR = (x: number, y: number) => {
      ctx.beginPath();
      ctx.moveTo(x + R, y);
      ctx.lineTo(x + CELL - R, y);
      ctx.quadraticCurveTo(x + CELL, y, x + CELL, y + R);
      ctx.lineTo(x + CELL, y + CELL - R);
      ctx.quadraticCurveTo(x + CELL, y + CELL, x + CELL - R, y + CELL);
      ctx.lineTo(x + R, y + CELL);
      ctx.quadraticCurveTo(x, y + CELL, x, y + CELL - R);
      ctx.lineTo(x, y + R);
      ctx.quadraticCurveTo(x, y, x + R, y);
      ctx.closePath();
      ctx.fill();
    };

    const startTime = performance.now();

    const draw = (now: number) => {
      const t       = (now - startTime) / 1000;
      const playing = playingRef.current;
      const pattern = patternRef.current;
      const speed   = playing ? 0.65 : 0.28;
      const amp     = playing ? 0.75 : 0.42;
      const colors  = PATTERN_COLORS[pattern];

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = cols * 0.5;
      const cy = rows * 0.5;

      for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
          const px = col * STEP;
          const py = row * STEP;

          // ── Wave functions per pattern ──────────────────────────────
          let intensity: number;

          if (pattern === "ocean") {
            // Smooth horizontal rolling ocean waves — 3 overlapping sine planes
            const w1 = Math.sin(t * speed        + col * 0.18 + row * 0.10);
            const w2 = Math.sin(t * speed * 1.35 + col * 0.08 - row * 0.09) * 0.5;
            const w3 = Math.sin(t * speed * 0.72 - col * 0.12 + row * 0.06) * 0.3;
            intensity = (w1 + w2 + w3) / 1.8;

          } else if (pattern === "vortex") {
            // Swirling spiral emanating from the centre
            const dx    = col - cx;
            const dy    = row - cy;
            const angle = Math.atan2(dy, dx);
            const dist  = Math.hypot(dx, dy);
            const w1 = Math.sin(t * speed * 1.1 + angle * 2.8 - dist * 0.22);
            const w2 = Math.sin(t * speed * 0.8 + angle * 1.4 + dist * 0.15) * 0.4;
            intensity = (w1 + w2) / 1.4;

          } else if (pattern === "cascade") {
            // Diagonal rain — forward and back diagonal sines, feels like monsoon on the beach
            const w1 = Math.sin(t * speed * 1.6 + (col + row) * 0.14);
            const w2 = Math.sin(t * speed * 1.1 + (col - row) * 0.11) * 0.55;
            const w3 = Math.sin(t * speed * 2.1 + col * 0.09)         * 0.3;
            intensity = (w1 + w2 + w3) / 1.85;

          } else {
            // pulse — concentric rings expanding from the centre
            const dist = Math.hypot(col - cx, row - cy);
            const w1 = Math.sin(t * speed * 1.8 - dist * 0.28);
            const w2 = Math.sin(t * speed * 1.1 - dist * 0.18 + Math.PI) * 0.45;
            intensity = (w1 + w2) / 1.45;
          }

          // ── Alpha ───────────────────────────────────────────────────
          // Edge vignette using sine envelope
          const edgeX = Math.sin((col / cols) * Math.PI);
          const edgeY = Math.sin((row / rows) * Math.PI);
          const vignette = Math.pow(edgeX * edgeY, 0.45);
          const alpha = ((intensity * 0.5 + 0.5) * 0.20 + 0.025) * vignette;
          if (alpha < 0.01) continue; // skip invisible cells

          // ── Color selection ─────────────────────────────────────────
          // Map intensity + position to a smooth color blend
          const colorPhase = ((intensity * 0.5 + 0.5) + col * 0.03 + row * 0.02) % 1;
          const colorIdx   = Math.floor(colorPhase * colors.length) % colors.length;
          const [r, g, b]  = colors[colorIdx];

          ctx.fillStyle = `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
          fillRR(px, py);
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []); // Run once — pattern/playing changes via refs

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  );
}
