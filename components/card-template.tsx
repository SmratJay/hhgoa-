"use client";

import { forwardRef, useImperativeHandle, useEffect, useState, useRef } from "react";

export type CardVariant = "dark" | "light";

interface CardTemplateProps {
  userName: string;
  variant: CardVariant;
  photoUrl?: string;
  onTextureReady: (dataUrl: string) => void;
  city?: string;
  date?: string;
}

export interface CardTemplateRef {
  captureTexture: () => Promise<void>;
  exportCard: () => void;
}

const CANVAS_SIZE = 1376;

// Load an image from a URL, returns an HTMLImageElement promise.
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

const CardTemplate = forwardRef<CardTemplateRef, CardTemplateProps>(
  ({ userName, variant, photoUrl, onTextureReady, city = "GOA, INDIA", date = "28–31 OCT 2026" }, ref) => {
    const [photo, setPhoto] = useState<HTMLImageElement | null>(null);
    const [logo, setLogo] = useState<HTMLImageElement | null>(null);

    // Load user photo whenever photoUrl changes
    useEffect(() => {
      if (!photoUrl) { setPhoto(null); return; }
      const img = new Image();
      img.onload = () => setPhoto(img);
      img.src = photoUrl;
    }, [photoUrl]);

    // Load the HHG logo once on mount
    useEffect(() => {
      loadImage("/hhg-logo.png")
        .then(setLogo)
        .catch(() => setLogo(null));
    }, []);

    // Re-capture texture whenever logo becomes available (so the 3D card
    // shows the logo without the user needing to press Apply)
    const isFirstRender = useRef(true);
    useEffect(() => {
      if (isFirstRender.current) { isFirstRender.current = false; return; }
      if (logo) captureTexture();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [logo]);

    const renderCard = () => {
      const canvas = document.createElement("canvas");
      canvas.width = CANVAS_SIZE;
      canvas.height = CANVAS_SIZE;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      // ── Palette ───────────────────────────────────────────────────────────
      const cardBg   = "#078C4A";   // new brand green
      const yellow   = "#f8db19";
      const pink     = "#ff1680";
      const cream    = "#fff9df";
      // Ink colour flips per variant (dark = cream text, light = dark text)
      const ink      = variant === "dark" ? cream : "#043c27";

      // ── Background ───────────────────────────────────────────────────────
      ctx.fillStyle = cardBg;
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      // ── Gold border ───────────────────────────────────────────────────────
      ctx.strokeStyle = yellow;
      ctx.lineWidth = 20;
      ctx.strokeRect(34, 34, CANVAS_SIZE - 68, CANVAS_SIZE - 68);

      // ── Pink chevron trim on top & bottom edges ───────────────────────────
      ctx.strokeStyle = pink;
      ctx.lineWidth = 7;
      for (let x = 54; x < CANVAS_SIZE - 54; x += 48) {
        ctx.beginPath(); ctx.moveTo(x, 54); ctx.lineTo(x + 18, 34); ctx.lineTo(x + 36, 54); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x, CANVAS_SIZE - 54); ctx.lineTo(x + 18, CANVAS_SIZE - 34); ctx.lineTo(x + 36, CANVAS_SIZE - 54); ctx.stroke();
      }

      // ── HHG Logo — top-right corner ───────────────────────────────────────
      const logoSize = 180;
      const logoPad  = 70;
      if (logo) {
        // Draw with circular clip for a clean badge look
        ctx.save();
        ctx.beginPath();
        ctx.arc(
          CANVAS_SIZE - logoPad - logoSize / 2,
          logoPad + logoSize / 2,
          logoSize / 2,
          0,
          Math.PI * 2
        );
        ctx.clip();
        ctx.drawImage(
          logo,
          CANVAS_SIZE - logoPad - logoSize,
          logoPad,
          logoSize,
          logoSize
        );
        ctx.restore();
      } else {
        // Fallback text badge if logo not loaded
        ctx.fillStyle = yellow;
        ctx.font = 'bold 56px "Arial Narrow", sans-serif';
        ctx.textAlign = "right";
        ctx.fillText("HHG", CANVAS_SIZE - logoPad, logoPad + 60);
      }

      // ── Header text (top-left) ────────────────────────────────────────────
      ctx.textAlign = "left";
      ctx.fillStyle = cream;
      ctx.font = 'bold 38px "Arial Narrow", sans-serif';
      ctx.fillText("HACKER HOUSE", logoPad, 125);
      ctx.fillStyle = yellow;
      ctx.font = 'bold 84px Georgia, serif';
      ctx.fillText("GOA", logoPad, 225);
      ctx.fillStyle = pink;
      ctx.font = 'bold 34px monospace';
      ctx.fillText(`${city}  •  ${date}`, logoPad, 280);

      // ── User photo — FULL square, centre of card ──────────────────────────
      // This is the hero element. If a photo is uploaded, it fills the entire
      // square. No other background graphics overlay it.
      const photoMargin = 60;
      const photoX = photoMargin;
      const photoY = 320;
      const photoSize = CANVAS_SIZE - photoMargin * 2;

      // Pink outer glow frame
      ctx.fillStyle = pink;
      ctx.fillRect(photoX - 14, photoY - 14, photoSize + 28, photoSize + 28);
      // Yellow inner border
      ctx.fillStyle = yellow;
      ctx.fillRect(photoX - 6, photoY - 6, photoSize + 12, photoSize + 12);

      // Square clip for the photo / placeholder
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(photoX, photoY, photoSize, photoSize, 8);
      ctx.clip();

      if (photo) {
        // Cover-fit: fill the square, crop equally from both sides
        const scale  = Math.max(photoSize / photo.width, photoSize / photo.height);
        const drawW  = photo.width  * scale;
        const drawH  = photo.height * scale;
        const drawX  = photoX + (photoSize - drawW) / 2;
        const drawY  = photoY + (photoSize - drawH) / 2;
        ctx.drawImage(photo, drawX, drawY, drawW, drawH);
      } else {
        // Placeholder — attractive, minimal
        ctx.fillStyle = "#056035";
        ctx.fillRect(photoX, photoY, photoSize, photoSize);

        // Dashed centre prompt
        ctx.setLineDash([18, 10]);
        ctx.strokeStyle = yellow;
        ctx.lineWidth = 6;
        ctx.strokeRect(photoX + 40, photoY + 40, photoSize - 80, photoSize - 80);
        ctx.setLineDash([]);

        ctx.fillStyle = yellow;
        ctx.textAlign = "center";
        ctx.font = 'bold 52px "Arial Narrow", sans-serif';
        ctx.fillText("UPLOAD YOUR PHOTO", CANVAS_SIZE / 2, photoY + photoSize / 2 - 30);
        ctx.fillStyle = cream + "99";
        ctx.font = '32px monospace';
        ctx.fillText("square works best", CANVAS_SIZE / 2, photoY + photoSize / 2 + 30);
      }
      ctx.restore();

      // ── Name strip + event info — below the photo ─────────────────────────
      const stripY = photoY + photoSize + 28;

      ctx.textAlign = "center";
      ctx.fillStyle = ink;
      ctx.font = 'bold 68px "Arial Narrow", sans-serif';
      ctx.fillText((userName || "YOUR NAME").toUpperCase(), CANVAS_SIZE / 2, stripY + 72);

      ctx.fillStyle = yellow;
      ctx.font = 'bold 30px monospace';
      ctx.fillText("BUILD LOUD  ·  SHIP OFTEN  ·  GOA 2026", CANVAS_SIZE / 2, stripY + 122);

      return canvas;
    };

    const captureTexture = async () => {
      const canvas = renderCard();
      if (canvas) onTextureReady(canvas.toDataURL("image/png"));
    };

    const exportCard = () => {
      const canvas = renderCard();
      if (!canvas) return;
      const link = document.createElement("a");
      link.download = `hacker-house-goa-${(userName || "id-card").toLowerCase().replace(/\s+/g, "-")}.png`;
      link.href = canvas.toDataURL("image/png", 1);
      link.click();
    };

    useImperativeHandle(ref, () => ({ captureTexture, exportCard }));

    return null;
  }
);

CardTemplate.displayName = "CardTemplate";
export default CardTemplate;
