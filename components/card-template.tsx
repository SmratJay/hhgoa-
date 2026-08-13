"use client";

import { forwardRef, useImperativeHandle, useEffect, useState, useRef } from "react";

export type CardVariant = "dark" | "light";

export interface StickerPlacement {
  id: string; // unique placement instance id e.g. "st-1"
  stickerId: string; // e.g. "build-loud"
  src: string;
  side: "front" | "back";
  x: number; // 0..100 percentage across face
  y: number; // 0..100 percentage down face
  scale?: number; // scale multiplier, default 1.0
  rotation?: number; // degrees, e.g. -15 to 15
}

export interface PresetSticker {
  id: string;
  name: string;
  src: string;
}

export const AVAILABLE_STICKERS: PresetSticker[] = [
  { id: "build-loud", name: "BUILD LOUD", src: "/stickers/sticker-build-loud.svg" },
  { id: "ship-it", name: "SHIP IT", src: "/stickers/sticker-ship-it.svg" },
  { id: "goa-sun", name: "GOA 2026", src: "/stickers/sticker-goa-sun.svg" },
  { id: "hacker", name: "<HACKER/>", src: "/stickers/sticker-hacker.svg" },
  { id: "vip", name: "HHG VIP", src: "/stickers/sticker-vip.svg" },
  { id: "custom-1", name: "HHG Badge", src: "/stickers/sticker-custom-1.png" },
  { id: "custom-2", name: "Hacker House", src: "/stickers/sticker-custom-2.png" },
  { id: "custom-3", name: "Beach Wave", src: "/stickers/sticker-custom-3.png" },
  { id: "custom-4", name: "Sun Vibe", src: "/stickers/sticker-custom-4.png" },
  { id: "custom-5", name: "Palm Hack", src: "/stickers/sticker-custom-5.png" },
  { id: "custom-6", name: "Goa Chill", src: "/stickers/sticker-custom-6.png" },
];

interface CardTemplateProps {
  userName: string;
  variant?: CardVariant;
  photoUrl?: string;
  stickers?: StickerPlacement[];
  onTextureReady: (dataUrl: string) => void;
  onPreviewUpdate?: (frontUrl: string, backUrl: string) => void;
  city?: string;
  date?: string;
}

export interface CardTemplateRef {
  captureTexture: () => Promise<void>;
  exportCard: (side?: "front" | "back") => void;
}

// The GLB UV layout uses a 2:1 wide texture: left half = front, right half = back.
const SIDE   = 1376;   // each face is a square
const W      = SIDE * 2;
const H      = SIDE;

// ── Palette ────────────────────────────────────────────────────────────────
const BG      = "#078C4A";   // HH Goa brand green
const BG_DARK = "#045c30";   // slightly darker green for accents
const CREAM   = "#fff9df";
const YELLOW  = "#f8db19";
const PINK    = "#ff1680";

// Load an image from a URL, returns an HTMLImageElement promise.
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload  = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function generateQRImage(text: string): Promise<HTMLImageElement | null> {
  try {
    const QRCode = (await import("qrcode")).default;
    const dataUrl = await QRCode.toDataURL(text, {
      margin: 0,
      color: {
        dark: BG_DARK,
        light: CREAM
      }
    });
    return await loadImage(dataUrl);
  } catch {
    return null;
  }
}

const CardTemplate = forwardRef<CardTemplateRef, CardTemplateProps>(
  ({ userName, photoUrl, stickers = [], onTextureReady, onPreviewUpdate }, ref) => {
    const [photo, setPhoto]         = useState<HTMLImageElement | null>(null);
    const [logo,  setLogo]          = useState<HTMLImageElement | null>(null);
    const [qrImage, setQrImage]     = useState<HTMLImageElement | null>(null);
    const [stickerImgs, setStickerImgs] = useState<Map<string, HTMLImageElement>>(new Map());

    // Load user photo whenever photoUrl changes
    useEffect(() => {
      if (!photoUrl) { setPhoto(null); return; }
      const img    = new Image();
      img.onload   = () => setPhoto(img);
      img.src      = photoUrl;
    }, [photoUrl]);

    // Load the HHG logo once on mount
    useEffect(() => {
      loadImage("/hhg-logo.png")
        .then(setLogo)
        .catch(() => setLogo(null));
    }, []);

    // Pre-generate the QR image once on mount
    useEffect(() => {
      generateQRImage("https://hhgoa.com").then(setQrImage);
    }, []);

    // Load sticker images whenever stickers array changes
    useEffect(() => {
      if (!stickers.length) return;
      let isMounted = true;
      const loadAll = async () => {
        const newMap = new Map(stickerImgs);
        let updated = false;
        for (const st of stickers) {
          if (!newMap.has(st.src)) {
            try {
              const img = await loadImage(st.src);
              newMap.set(st.src, img);
              updated = true;
            } catch {
              // ignore broken src
            }
          }
        }
        if (isMounted && updated) {
          setStickerImgs(newMap);
        }
      };
      loadAll();
      return () => { isMounted = false; };
    }, [stickers]);

    // Re-capture texture whenever assets change
    const isFirstRender = useRef(true);
    useEffect(() => {
      if (isFirstRender.current) { isFirstRender.current = false; return; }
      if (logo && qrImage) captureTexture();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [logo, qrImage, userName, photo, stickerImgs, stickers]);

    const renderCard = (isFor3D: boolean = false) => {
      const canvas   = document.createElement("canvas");
      canvas.width   = W;
      canvas.height  = H;
      const ctx      = canvas.getContext("2d");
      if (!ctx) return null;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // FRONT — left half (0 … SIDE)
      drawFront(ctx, userName, photo, logo, stickers, stickerImgs, isFor3D);

      // BACK — right half (SIDE … 2*SIDE)
      drawBack(ctx, qrImage, stickers, stickerImgs, isFor3D);

      return canvas;
    };

    const captureTexture = async () => {
      const canvas3D = renderCard(true);
      if (canvas3D) {
        onTextureReady(canvas3D.toDataURL("image/png"));
      }

      // Generate clean previews for 2D Live Preview Window
      if (onPreviewUpdate) {
        const canvas2D = renderCard(false);
        if (canvas2D) {
          const fOut = document.createElement("canvas");
          fOut.width = SIDE; fOut.height = SIDE;
          fOut.getContext("2d")!.drawImage(canvas2D, 0, 0, SIDE, SIDE, 0, 0, SIDE, SIDE);

          const bOut = document.createElement("canvas");
          bOut.width = SIDE; bOut.height = SIDE;
          bOut.getContext("2d")!.drawImage(canvas2D, SIDE, 0, SIDE, SIDE, 0, 0, SIDE, SIDE);

          onPreviewUpdate(fOut.toDataURL("image/png"), bOut.toDataURL("image/png"));
        }
      }
    };

    const exportCard = (side: "front" | "back" = "front") => {
      const canvas = renderCard(false);
      if (!canvas) return;
      const out  = document.createElement("canvas");
      out.width  = SIDE;
      out.height = SIDE;
      const octx = out.getContext("2d")!;
      const srcX = side === "front" ? 0 : SIDE;
      octx.drawImage(canvas, srcX, 0, SIDE, SIDE, 0, 0, SIDE, SIDE);

      const link   = document.createElement("a");
      link.download = `hhgoa-id-${side}-${(userName || "attendee").toLowerCase().replace(/\s+/g, "-")}.png`;
      link.href    = out.toDataURL("image/png", 1);
      link.click();
    };

    useImperativeHandle(ref, () => ({ captureTexture, exportCard }));

    return null;
  }
);

CardTemplate.displayName = "CardTemplate";
export default CardTemplate;

// ── Front face renderer ───────────────────────────────────────────────────
function drawFront(
  ctx: CanvasRenderingContext2D,
  userName: string,
  photo: HTMLImageElement | null,
  logo: HTMLImageElement | null,
  stickers: StickerPlacement[],
  stickerImgs: Map<string, HTMLImageElement>,
  isFor3D: boolean
) {
  const ox = 0; // x-offset for the front half

  // Background
  ctx.fillStyle = BG;
  ctx.fillRect(ox, 0, SIDE, SIDE);

  // Subtle diagonal pattern overlay
  ctx.save();
  ctx.globalAlpha = 0.06;
  ctx.strokeStyle = CREAM;
  ctx.lineWidth   = 2;
  for (let i = -SIDE; i < SIDE * 2; i += 40) {
    ctx.beginPath();
    ctx.moveTo(ox + i, 0);
    ctx.lineTo(ox + i + SIDE, SIDE);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.restore();

  // ── Yellow border ─────────────────────────────────────────────────────
  ctx.strokeStyle = YELLOW;
  ctx.lineWidth   = 14;
  ctx.strokeRect(ox + 24, 24, SIDE - 48, SIDE - 48);

  // ── Pink thin inner border ────────────────────────────────────────────
  ctx.strokeStyle = PINK;
  ctx.lineWidth   = 4;
  ctx.strokeRect(ox + 36, 36, SIDE - 72, SIDE - 72);

  // ── HHG Logo — top left ───────────────────────────────────────────────
  // Logo is 1402×1122 (landscape ratio ~1.248:1). Render at natural aspect
  // ratio so nothing gets cropped. Use 'multiply' blend: white bg × green = green,
  // so the white background vanishes and only the yellow/pink artwork shows.
  const logoRenderW = 380;
  const logoRenderH = Math.round(logoRenderW * (1122 / 1402)); // ~304px
  const logoPadX = 52;
  const logoPadY = 48;
  if (logo) {
    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.globalCompositeOperation = "multiply";
    ctx.drawImage(logo, ox + logoPadX, logoPadY, logoRenderW, logoRenderH);
    ctx.restore();
  } else {
    ctx.fillStyle  = YELLOW;
    ctx.font       = 'bold 56px "Arial Narrow", sans-serif';
    ctx.textAlign  = "left";
    ctx.fillText("HHG", ox + logoPadX, logoPadY + 64);
  }

  // ── User photo — square in upper-centre area ──────────────────────────
  const photoSize   = 600;
  const photoW      = photoSize; // Always crisp perfect square
  const photoX      = ox + (SIDE - photoW) / 2;
  const photoY      = 210;

  // Photo frame — green shadow then yellow border then pink accent
  ctx.fillStyle = BG_DARK;
  ctx.fillRect(photoX - 12, photoY - 12, photoW + 24, photoSize + 24);
  ctx.fillStyle = YELLOW;
  ctx.fillRect(photoX - 6,  photoY - 6,  photoW + 12, photoSize + 12);

  // Square clip
  ctx.save();
  ctx.beginPath();
  ctx.rect(photoX, photoY, photoW, photoSize);
  ctx.clip();

  if (photo) {
    ctx.drawImage(photo, photoX, photoY, photoW, photoSize);
  } else {
    // Placeholder
    ctx.fillStyle = BG_DARK;
    ctx.fillRect(photoX, photoY, photoW, photoSize);
    ctx.setLineDash([16, 10]);
    ctx.strokeStyle = YELLOW + "aa";
    ctx.lineWidth   = 5;
    ctx.strokeRect(photoX + 30, photoY + 30, photoW - 60, photoSize - 60);
    ctx.setLineDash([]);
    ctx.fillStyle = YELLOW;
    ctx.textAlign = "center";
    ctx.font      = 'bold 44px "Arial Narrow", sans-serif';
    ctx.fillText("UPLOAD PHOTO", ox + SIDE / 2, photoY + photoSize / 2 - 20);
    ctx.fillStyle = CREAM + "99";
    ctx.font      = '28px monospace';
    ctx.fillText("square works best", ox + SIDE / 2, photoY + photoSize / 2 + 36);
  }
  ctx.restore();

  // ── Name ──────────────────────────────────────────────────────────────
  const nameY = photoY + photoSize + 85;
  ctx.textAlign  = "center";
  ctx.font       = 'bold 84px "Arial Narrow", Arial, sans-serif';
  const displayName = (userName || "YOUR NAME").toUpperCase();
  
  // Pink with yellow crisp border
  ctx.lineJoin = 'miter';
  ctx.miterLimit = 3;
  ctx.lineWidth = 14;
  ctx.strokeStyle = YELLOW;
  ctx.strokeText(displayName, ox + SIDE / 2, nameY, SIDE - 120);
  
  ctx.fillStyle  = PINK;
  ctx.fillText(displayName, ox + SIDE / 2, nameY, SIDE - 120);

  // ── ATTENDEE label — bottom right ─────────────────────────────────────
  ctx.textAlign  = "right";
  ctx.fillStyle  = YELLOW;
  ctx.font       = 'bold 30px monospace';
  ctx.letterSpacing = "0.18em";
  ctx.fillText("ATTENDEE", ox + SIDE - 60, SIDE - 60);
  ctx.letterSpacing = "0";

  // ── Small event text — bottom left ────────────────────────────────────
  ctx.textAlign  = "left";
  ctx.fillStyle  = CREAM + "99";
  ctx.font       = '26px monospace';
  ctx.fillText("28–31 OCT 2026 · GOA", ox + 60, SIDE - 60);

  // ── Stickers (Front) — only drawn when NOT rendering for 3D (where Sticker3DMesh handles them) ──
  if (!isFor3D) {
    const frontStickers = stickers.filter(s => s.side === "front");
    drawStickersOnFace(ctx, ox, frontStickers, stickerImgs);
  }
}

// ── Back face renderer ────────────────────────────────────────────────────
function drawBack(
  ctx: CanvasRenderingContext2D,
  qrImage: HTMLImageElement | null,
  stickers: StickerPlacement[],
  stickerImgs: Map<string, HTMLImageElement>,
  isFor3D: boolean
) {
  const ox = SIDE; // x-offset for the back half

  // Background
  ctx.fillStyle = BG;
  ctx.fillRect(ox, 0, SIDE, SIDE);

  // ── Yellow border ─────────────────────────────────────────────────────
  ctx.strokeStyle = YELLOW;
  ctx.lineWidth   = 14;
  ctx.strokeRect(ox + 24, 24, SIDE - 48, SIDE - 48);

  // ── Pink thin inner border ────────────────────────────────────────────
  ctx.strokeStyle = PINK;
  ctx.lineWidth   = 4;
  ctx.strokeRect(ox + 36, 36, SIDE - 72, SIDE - 72);

  // ── QR code — centred ─────────────────────────────────────────────────
  const qrSize = 620;
  const qrX    = ox + (SIDE - qrSize) / 2;
  const qrY    = (SIDE - qrSize) / 2 - 40;

  // White padding container
  const pad = 32;
  ctx.fillStyle  = CREAM;
  ctx.beginPath();
  ctx.roundRect(qrX - pad, qrY - pad, qrSize + pad * 2, qrSize + pad * 2, 16);
  ctx.fill();

  if (qrImage) {
    ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);
  } else {
    ctx.fillStyle  = BG_DARK;
    ctx.font       = 'bold 36px monospace';
    ctx.textAlign  = "center";
    ctx.fillText("hhgoa.com", ox + SIDE / 2, qrY + qrSize / 2);
  }

  // ── "Scan to visit" label below QR ────────────────────────────────────
  const labelY = qrY + qrSize + pad + 60;
  ctx.textAlign  = "center";
  ctx.fillStyle  = YELLOW;
  ctx.font       = 'bold 34px monospace';
  ctx.fillText("hhgoa.com", ox + SIDE / 2, labelY);

  ctx.fillStyle  = CREAM + "aa";
  ctx.font       = '26px "Arial Narrow", sans-serif';
  ctx.fillText("SCAN TO VISIT", ox + SIDE / 2, labelY + 46);

  // ── Stickers (Back) — only drawn for export/preview, not 3D texture ──
  if (!isFor3D) {
    const backStickers = stickers.filter(s => s.side === "back");
    drawStickersOnFace(ctx, ox, backStickers, stickerImgs);
  }
}

// ── Draw sticker placements onto 2D canvas (export / preview only) ───────────
function drawStickersOnFace(
  ctx: CanvasRenderingContext2D,
  ox: number,
  stickers: StickerPlacement[],
  stickerImgs: Map<string, HTMLImageElement>
) {
  for (const st of stickers) {
    const img = stickerImgs.get(st.src);
    if (!img) continue;

    // Convert percentage to canvas pixel coordinates
    const sx = ox + (st.x / 100) * SIDE;
    const sy = (st.y / 100) * SIDE;

    const baseSize = 240;
    const scale    = st.scale || 1.0;
    const sw       = baseSize * scale;
    const sh       = baseSize * scale;
    const rot      = ((st.rotation || 0) * Math.PI) / 180;

    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(rot);

    // Draw Sticker image directly (100% clean background-less)
    ctx.drawImage(img, -sw / 2, -sh / 2, sw, sh);

    ctx.restore();
  }
}
