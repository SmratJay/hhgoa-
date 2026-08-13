"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Lanyard from "@/components/ui/lanyard";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CardTemplate, {
  type CardTemplateRef,
  type CardVariant,
  type StickerPlacement,
  type PresetSticker,
  AVAILABLE_STICKERS,
} from "@/components/card-template";
import { Download, Link, Check, ImagePlus, Sparkles, Trash2, Eye, RotateCw, GripHorizontal, RotateCcw } from "lucide-react";
import { encryptLanyardData } from "@/lib/utils";

// X (Twitter) icon component
function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

// LinkedIn icon component
function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const MAX_CHARACTERS = 20;

const PRESET_POSITIONS = [
  { x: 76, y: 22 }, // Top Right
  { x: 22, y: 48 }, // Center Left
  { x: 78, y: 48 }, // Center Right
  { x: 24, y: 76 }, // Bottom Left
  { x: 76, y: 76 }, // Bottom Right
  { x: 22, y: 22 }, // Top Left
];

interface LanyardWithControlsProps {
  position?: [number, number, number];
  containerClassName?: string;
  defaultName?: string;
  defaultVariant?: CardVariant;
}

export default function LanyardWithControls({
  position = [0, 0, 20],
  containerClassName,
  defaultName = "",
}: LanyardWithControlsProps) {
  const [inputValue, setInputValue] = useState(defaultName);
  const [appliedName, setAppliedName] = useState(defaultName);
  const [cardTextureUrl, setCardTextureUrl] = useState<string | undefined>(undefined);
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);
  const [stickers, setStickers] = useState<StickerPlacement[]>([]);
  const [frontPreviewUrl, setFrontPreviewUrl] = useState<string | null>(null);
  const [backPreviewUrl, setBackPreviewUrl] = useState<string | null>(null);
  const [previewTab, setPreviewTab] = useState<"front" | "back">("front");
  const [stickerSide, setStickerSide] = useState<"front" | "back">("front");
  const [textureKey, setTextureKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Dragging state for Movable Control Window
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const isDraggingWindow = useRef(false);
  const dragStartRef = useRef<{ startX: number; startY: number; posX: number; posY: number } | null>(null);

  const cardTemplateRef = useRef<CardTemplateRef>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Auto-capture texture on mount
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (cardTemplateRef.current) {
        await cardTemplateRef.current.captureTexture();
      }
      setIsInitialized(true);
    }, 150);
    return () => clearTimeout(timer);
  }, [defaultName]);

  const getShareableUrl = useCallback(() => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    if (appliedName) {
      const encrypted = encryptLanyardData(appliedName, "dark");
      return `${baseUrl}/lanyard?u=${encrypted}`;
    }
    return `${baseUrl}/lanyard`;
  }, [appliedName]);

  const shareMessage = appliedName
    ? `I made my Hacker House Goa 2026 ID card! 🌴 Build loud, ship often.`
    : `Make your Hacker House Goa 2026 ID card 🌴`;

  const handleShareX = useCallback(() => {
    // Automatically export front and back ID card PNG images so the user can attach them to the tweet
    cardTemplateRef.current?.exportCard("front");
    setTimeout(() => {
      cardTemplateRef.current?.exportCard("back");
    }, 400);

    const url = getShareableUrl();
    const tweetText = appliedName
      ? `Just created my official Hacker House Goa 2026 ID card for ${appliedName.toUpperCase()}! 🏖️⚡️ Building from the sand @247pmstudio. Check out your card or github shack at hhgoa.com! #HHGOA2026 #HackerHouseGoa`
      : `Just created my official Hacker House Goa 2026 ID card! 🏖️⚡️ Building from the sand @247pmstudio. Check out your card or github shack at hhgoa.com! #HHGOA2026 #HackerHouseGoa`;

    const twitterUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, "_blank", "noopener,noreferrer");
  }, [appliedName, getShareableUrl]);

  const handleShareLinkedIn = useCallback(() => {
    const url = getShareableUrl();
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedInUrl, "_blank", "noopener,noreferrer");
  }, [getShareableUrl]);

  const handleCopyLink = useCallback(async () => {
    const url = getShareableUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  }, [getShareableUrl]);

  const characterCount = inputValue.length;
  const isAtLimit = characterCount >= MAX_CHARACTERS;
  const isNearLimit = characterCount >= MAX_CHARACTERS - 5;
  const hasChanges = inputValue !== appliedName || !!photoUrl;

  const handleTextureReady = useCallback((dataUrl: string) => {
    setCardTextureUrl(dataUrl);
    setTextureKey((prev) => prev + 1);
  }, []);

  const handlePreviewUpdate = useCallback((frontUrl: string, backUrl: string) => {
    setFrontPreviewUrl(frontUrl);
    setBackPreviewUrl(backUrl);
  }, []);

  const handleExport = (side: "front" | "back" = "front") => {
    cardTemplateRef.current?.exportCard(side);
  };

  const handleApplyName = async () => {
    setAppliedName(inputValue);
    await cardTemplateRef.current?.captureTexture();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoUrl(String(reader.result));
      setTimeout(() => cardTemplateRef.current?.captureTexture(), 50);
    };
    reader.readAsDataURL(file);
  };

  const handleAddSticker = (preset: PresetSticker) => {
    const sideStickers = stickers.filter((s) => s.side === stickerSide);
    const pos = PRESET_POSITIONS[sideStickers.length % PRESET_POSITIONS.length];
    const newSticker: StickerPlacement = {
      id: `st-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      stickerId: preset.id,
      src: preset.src,
      side: stickerSide,
      x: pos.x,
      y: pos.y,
      scale: 1.0,
      rotation: (sideStickers.length % 2 === 0 ? 1 : -1) * (8 + (sideStickers.length * 5) % 16),
    };
    setStickers((prev) => [...prev, newSticker]);
  };

  const handleRemoveSticker = (id: string) => {
    setStickers((prev) => prev.filter((s) => s.id !== id));
  };

  const handleRotateSticker = (id: string) => {
    setStickers((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, rotation: ((s.rotation || 0) + 25) % 360 } : s
      )
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_CHARACTERS) {
      setInputValue(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && hasChanges) {
      handleApplyName();
    }
  };

  // ── Drag handlers for Smooth Window Movement ─────────────────────────────
  const animFrameRef = useRef<number | null>(null);

  const handleHeaderPointerDown = (e: React.PointerEvent) => {
    // If user clicked on a button inside header (e.g. Reset Position), do NOT start drag!
    if ((e.target as HTMLElement).closest("button")) return;

    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
    isDraggingWindow.current = true;
    const currentX = dragPos?.x || 0;
    const currentY = dragPos?.y || 0;
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      posX: currentX,
      posY: currentY,
    };
  };

  const handleHeaderPointerMove = (e: React.PointerEvent) => {
    if (!isDraggingWindow.current || !dragStartRef.current) return;
    const clientX = e.clientX;
    const clientY = e.clientY;

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(() => {
      if (!dragStartRef.current) return;
      const dx = clientX - dragStartRef.current.startX;
      const dy = clientY - dragStartRef.current.startY;
      setDragPos({
        x: dragStartRef.current.posX + dx,
        y: dragStartRef.current.posY + dy,
      });
    });
  };

  const handleHeaderPointerUp = (e: React.PointerEvent) => {
    if (isDraggingWindow.current) {
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
      isDraggingWindow.current = false;
      dragStartRef.current = null;
    }
  };

  if (!isInitialized) {
    return (
      <div className="flex flex-col">
        <CardTemplate
          ref={cardTemplateRef}
          userName={inputValue}
          variant="dark"
          photoUrl={photoUrl}
          stickers={stickers}
          onTextureReady={handleTextureReady}
          onPreviewUpdate={handlePreviewUpdate}
        />
        <div className={containerClassName}>
          <div className="flex h-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        </div>
      </div>
    );
  }

  const activeStickersForSide = stickers.filter((s) => s.side === previewTab);

  return (
    <div className="flex flex-col">
      {/* Hidden card template for rendering textures & live preview */}
      <CardTemplate
        ref={cardTemplateRef}
        userName={inputValue}
        variant="dark"
        photoUrl={photoUrl}
        stickers={stickers}
        onTextureReady={handleTextureReady}
        onPreviewUpdate={handlePreviewUpdate}
      />

      {/* 3D Hanging Lanyard */}
      <Lanyard
        key={textureKey}
        position={position}
        containerClassName={containerClassName}
        cardTextureUrl={cardTextureUrl}
        stickers={stickers}
        canvasRef={canvasRef}
      />

      {/* ── MOVABLE & EMBEDDED LIVE PREVIEW STUDIO WINDOW ───────────────── */}
      <div
        style={dragPos ? { transform: `translate3d(${dragPos.x}px, ${dragPos.y}px, 0px)` } : undefined}
        className="relative z-30 mx-auto mt-16 sm:mt-24 lg:mt-28 w-full max-w-4xl px-4 pb-16 will-change-transform"
      >
        <div className="rounded-2xl border-2 border-[#f8db19] bg-[#075b39]/95 shadow-[10px_10px_0_#ff1680] backdrop-blur">
          
          {/* ── Drag Header Bar ───────────────────────────────────────────── */}
          <div
            onPointerDown={handleHeaderPointerDown}
            onPointerMove={handleHeaderPointerMove}
            onPointerUp={handleHeaderPointerUp}
            className="flex cursor-grab items-center justify-between border-b border-[#fff9df]/20 bg-[#04452a] px-4 py-2.5 select-none active:cursor-grabbing rounded-t-2xl touch-none"
          >
            <div className="flex items-center gap-2">
              <GripHorizontal className="h-4 w-4 text-[#f8db19]" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#f8db19]">
                ID Card Studio & Live Preview
              </span>
            </div>
            <div className="flex items-center gap-2">
              {dragPos && (
                <button
                  type="button"
                  onClick={() => setDragPos(null)}
                  className="flex items-center gap-1 rounded bg-[#022e1b] px-2 py-0.5 font-mono text-[10px] font-bold text-[#fff9df]/80 transition hover:text-white"
                >
                  <RotateCcw className="h-3 w-3 text-[#f8db19]" /> Reset Position
                </button>
              )}
              <span className="hidden font-mono text-[10px] text-[#fff9df]/50 sm:inline">
                Drag bar to move window
              </span>
            </div>
          </div>

          {/* ── Main Studio Window Body ───────────────────────────────────── */}
          <div className="flex flex-col gap-6 p-4 md:flex-row md:items-start md:p-6">
            
            {/* ── EMBEDDED EXPANDED LIVE PREVIEW WINDOW ─────────────────── */}
            <div className="flex flex-col items-center rounded-xl border border-[#fff9df]/30 bg-[#04452a] p-4 md:w-80 shrink-0">
              <div className="mb-3 flex w-full items-center justify-between gap-2 border-b border-[#fff9df]/20 pb-2">
                <span className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-[#f8db19]">
                  <Eye className="h-4 w-4" />
                  Live Preview
                </span>
                {/* Front / Back Perspective Tabs */}
                <div className="flex rounded-md bg-[#022e1b] p-0.5">
                  <button
                    type="button"
                    onClick={() => setPreviewTab("front")}
                    className={`rounded px-2.5 py-1 font-mono text-xs font-bold uppercase transition ${
                      previewTab === "front"
                        ? "bg-[#f8db19] text-[#04452a]"
                        : "text-[#fff9df]/60 hover:text-[#fff9df]"
                    }`}
                  >
                    Front
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewTab("back")}
                    className={`rounded px-2.5 py-1 font-mono text-xs font-bold uppercase transition ${
                      previewTab === "back"
                        ? "bg-[#f8db19] text-[#04452a]"
                        : "text-[#fff9df]/60 hover:text-[#fff9df]"
                    }`}
                  >
                    Back
                  </button>
                </div>
              </div>

              {/* Expanded Card Preview Box */}
              <div className="relative aspect-square w-60 overflow-hidden rounded-xl border-2 border-[#f8db19]/60 bg-[#078C4A] shadow-xl sm:w-64">
                {previewTab === "front" ? (
                  frontPreviewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={frontPreviewUrl}
                      alt="ID Card Front Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center font-mono text-xs text-[#fff9df]">
                      Rendering...
                    </div>
                  )
                ) : backPreviewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={backPreviewUrl}
                    alt="ID Card Back Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center font-mono text-xs text-[#fff9df]">
                    Rendering...
                  </div>
                )}
              </div>

              <p className="mt-2 text-center font-mono text-[10px] text-[#fff9df]/70">
                {previewTab === "front" ? "Front: Photo, Name & Stickers" : "Back: QR Code & Custom Stickers"}
              </p>

              {/* Share to X (Twitter) Quick Action */}
              <Button
                type="button"
                onClick={handleShareX}
                size="sm"
                className="mt-1 w-full gap-2 bg-[#f8db19] font-mono text-xs font-bold uppercase tracking-wider text-[#04452a] shadow-[4px_4px_0_#ff1680] transition hover:-translate-y-0.5 hover:bg-[#fff9df] hover:shadow-[6px_6px_0_#ff1680]"
              >
                <XIcon className="h-4 w-4" /> Share ID Card on X
              </Button>
            </div>

            {/* ── CONTROLS & STICKER CUSTOMIZER ──────────────────────────── */}
            <div className="flex flex-1 flex-col gap-4">
              <div>
                <label className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-[#fff9df]">
                  Customize Your Card
                </label>
                <p className="mt-0.5 font-mono text-xs text-[#fff9df]/60">
                  Tap 3D card to flip · Drag window header to relocate
                </p>
              </div>

              {/* Photo Upload */}
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#fff9df]/60 bg-[#06472d] px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-[#fff9df] transition hover:border-[#f8db19] hover:text-[#f8db19]">
                <ImagePlus className="h-4 w-4" />
                {photoUrl ? "Replace photo" : "Upload photo"}
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="sr-only" />
              </label>

              {/* Name Input + Apply */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    id="userName"
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter your name"
                    maxLength={MAX_CHARACTERS}
                    className="h-11 w-full rounded-lg border border-[#fff9df]/50 bg-[#06472d] px-4 py-2 pr-14 font-mono text-sm text-[#fff9df] placeholder:text-[#fff9df]/60 focus:outline-none focus:ring-2 focus:ring-[#f8db19]"
                  />
                  <span
                    className={`absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs transition-colors ${
                      isAtLimit
                        ? "text-destructive"
                        : isNearLimit
                          ? "text-amber-400"
                          : "text-[#fff9df]/50"
                    }`}
                  >
                    {characterCount}/{MAX_CHARACTERS}
                  </span>
                </div>
                <Button
                  onClick={handleApplyName}
                  disabled={!hasChanges}
                  size="default"
                  className="h-11 shrink-0 bg-[#f8db19] font-mono font-bold text-[#075b39] hover:bg-[#fff9df]"
                >
                  Apply
                </Button>
              </div>

              {/* STICKERS SECTION */}
              <div className="rounded-xl border border-[#fff9df]/20 bg-[#04452a] p-3.5">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-[#f8db19]">
                    <Sparkles className="h-4 w-4 text-[#ff1680]" />
                    Paste Stickers ({stickers.length})
                  </span>

                  {/* Side Switcher */}
                  <div className="flex items-center gap-1 font-mono text-xs text-[#fff9df]/80">
                    <span>Target:</span>
                    <button
                      type="button"
                      onClick={() => { setStickerSide("front"); setPreviewTab("front"); }}
                      className={`rounded px-2 py-0.5 font-bold uppercase transition ${
                        stickerSide === "front" ? "bg-[#ff1680] text-white" : "bg-[#022e1b] text-[#fff9df]/60"
                      }`}
                    >
                      Front
                    </button>
                    <button
                      type="button"
                      onClick={() => { setStickerSide("back"); setPreviewTab("back"); }}
                      className={`rounded px-2 py-0.5 font-bold uppercase transition ${
                        stickerSide === "back" ? "bg-[#ff1680] text-white" : "bg-[#022e1b] text-[#fff9df]/60"
                      }`}
                    >
                      Back
                    </button>
                  </div>
                </div>

                {/* Sticker Badges Grid */}
                <div className="mt-3 flex flex-wrap gap-2 max-h-[150px] overflow-y-auto pr-1">
                  {AVAILABLE_STICKERS.map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => {
                        handleAddSticker(st);
                        setPreviewTab(stickerSide);
                      }}
                      className="flex flex-col items-center gap-1 rounded-lg border border-[#fff9df]/30 bg-[#065335] p-2 text-center transition hover:scale-105 hover:border-[#f8db19] hover:bg-[#086a44]"
                      title={`Paste ${st.name} sticker onto ${stickerSide}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={st.src} alt={st.name} className="h-8 w-8 object-contain" />
                      <span className="line-clamp-1 font-mono text-[9px] font-bold text-[#fff9df]">
                        +Add
                      </span>
                    </button>
                  ))}
                </div>

                {/* Active Stickers List */}
                {activeStickersForSide.length > 0 && (
                  <div className="mt-3.5 border-t border-[#fff9df]/15 pt-2.5">
                    <span className="font-mono text-xs font-bold text-[#fff9df]/70 uppercase">
                      Active {previewTab} Stickers:
                    </span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {activeStickersForSide.map((st, index) => (
                        <div
                          key={st.id}
                          className="flex items-center gap-1.5 rounded-md border border-[#f8db19]/50 bg-[#022e1b] px-2.5 py-1 font-mono text-xs text-[#fff9df]"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={st.src} alt="sticker" className="h-5 w-5 object-contain" />
                          <span>Sticker #{index + 1}</span>
                          <button
                            type="button"
                            onClick={() => handleRotateSticker(st.id)}
                            className="ml-1 text-[#f8db19] hover:text-white"
                            title="Rotate Sticker"
                          >
                            <RotateCw className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveSticker(st.id)}
                            className="text-[#ff1680] hover:text-red-400"
                            title="Remove Sticker"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Export & Sharing Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#fff9df]/20 pt-3">
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleExport("front")}
                    variant="outline"
                    size="sm"
                    className="gap-1.5 border-[#fff9df] font-mono text-xs text-[#fff9df] hover:bg-[#ff1680] hover:text-white"
                  >
                    <Download className="h-3.5 w-3.5" /> Export Front
                  </Button>
                  <Button
                    onClick={() => handleExport("back")}
                    variant="outline"
                    size="sm"
                    className="gap-1.5 border-[#fff9df] font-mono text-xs text-[#fff9df] hover:bg-[#ff1680] hover:text-white"
                  >
                    <Download className="h-3.5 w-3.5" /> Export Back
                  </Button>
                </div>

                {/* Social Share Buttons */}
                {appliedName && (
                  <div className="flex items-center gap-2">
                    <TooltipProvider delayDuration={200}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={handleShareX}
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 border-[#fff9df] text-[#fff9df] hover:bg-[#f8db19] hover:text-[#04452a]"
                          >
                            <XIcon className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Share on X</p></TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider delayDuration={200}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={handleShareLinkedIn}
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 border-[#fff9df] text-[#fff9df] hover:bg-[#f8db19] hover:text-[#04452a]"
                          >
                            <LinkedInIcon className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Share on LinkedIn</p></TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider delayDuration={200}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={handleCopyLink}
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 border-[#fff9df] text-[#fff9df] hover:bg-[#f8db19] hover:text-[#04452a]"
                          >
                            {copied ? (
                              <Check className="h-4 w-4 text-green-400" />
                            ) : (
                              <Link className="h-4 w-4" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>{copied ? "Copied!" : "Copy link"}</p></TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
