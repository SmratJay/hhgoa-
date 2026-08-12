"use client";

import { forwardRef, useImperativeHandle, useEffect, useState } from "react";

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

const CardTemplate = forwardRef<CardTemplateRef, CardTemplateProps>(
  ({ userName, variant, photoUrl, onTextureReady, city = "GOA, INDIA", date = "28–31 OCT 2026" }, ref) => {
    const [photo, setPhoto] = useState<HTMLImageElement | null>(null);

    useEffect(() => {
      if (!photoUrl) {
        setPhoto(null);
        return;
      }
      const img = new Image();
      img.onload = () => setPhoto(img);
      img.src = photoUrl;
    }, [photoUrl]);

    const renderCard = () => {
      const canvas = document.createElement("canvas");
      canvas.width = CANVAS_SIZE;
      canvas.height = CANVAS_SIZE;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      const green = variant === "dark" ? "#075b39" : "#fff9df";
      const ink = variant === "dark" ? "#fff9df" : "#075b39";
      const yellow = "#f8db19";
      const pink = "#ff1680";
      ctx.fillStyle = green;
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      // Goa-inspired border and repeating geometric trim.
      ctx.strokeStyle = yellow;
      ctx.lineWidth = 18;
      ctx.strokeRect(32, 32, CANVAS_SIZE - 64, CANVAS_SIZE - 64);
      ctx.strokeStyle = pink;
      ctx.lineWidth = 7;
      for (let x = 50; x < CANVAS_SIZE - 50; x += 48) {
        ctx.beginPath(); ctx.moveTo(x, 50); ctx.lineTo(x + 18, 32); ctx.lineTo(x + 36, 50); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x, CANVAS_SIZE - 50); ctx.lineTo(x + 18, CANVAS_SIZE - 32); ctx.lineTo(x + 36, CANVAS_SIZE - 50); ctx.stroke();
      }

      // Palm silhouettes.
      ctx.strokeStyle = yellow;
      ctx.lineWidth = 12;
      ctx.beginPath(); ctx.moveTo(105, 790); ctx.quadraticCurveTo(170, 475, 280, 355); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(CANVAS_SIZE - 105, 790); ctx.quadraticCurveTo(CANVAS_SIZE - 170, 475, CANVAS_SIZE - 280, 355); ctx.stroke();
      ctx.fillStyle = "#0a7a46";
      [[260, 350], [CANVAS_SIZE - 260, 350]].forEach(([x, y]) => {
        for (let i = 0; i < 6; i++) {
          ctx.beginPath(); ctx.ellipse(x, y, 120, 28, (i - 2.5) * 0.45, 0, Math.PI * 2); ctx.fill();
        }
      });

      ctx.fillStyle = ink;
      ctx.textAlign = "center";
      ctx.font = 'bold 42px "Arial Narrow", sans-serif';
      ctx.fillText("HACKER HOUSE", CANVAS_SIZE / 2, 145);
      ctx.fillStyle = yellow;
      ctx.font = 'bold 94px Georgia, serif';
      ctx.fillText("GOA", CANVAS_SIZE / 2, 250);
      ctx.fillStyle = pink;
      ctx.font = 'bold 48px "Arial Narrow", sans-serif';
      ctx.fillText("HACKER बाबा", CANVAS_SIZE / 2, 315);

      // Photo window with a crisp event-poster treatment.
      const photoX = 250, photoY = 390, photoW = 876, photoH = 540;
      ctx.fillStyle = pink;
      ctx.fillRect(photoX - 18, photoY - 18, photoW + 36, photoH + 36);
      ctx.fillStyle = yellow;
      ctx.fillRect(photoX - 7, photoY - 7, photoW + 14, photoH + 14);
      ctx.save();
      ctx.beginPath(); ctx.roundRect(photoX, photoY, photoW, photoH, 18); ctx.clip();
      if (photo) {
        const scale = Math.max(photoW / photo.width, photoH / photo.height);
        const w = photo.width * scale, h = photo.height * scale;
        ctx.drawImage(photo, photoX + (photoW - w) / 2, photoY + (photoH - h) / 2, w, h);
      } else {
        ctx.fillStyle = "#0b412e"; ctx.fillRect(photoX, photoY, photoW, photoH);
        ctx.fillStyle = yellow; ctx.font = 'bold 44px "Arial Narrow", sans-serif';
        ctx.fillText("UPLOAD YOUR PHOTO", CANVAS_SIZE / 2, photoY + photoH / 2);
      }
      ctx.restore();

      ctx.fillStyle = ink;
      ctx.font = 'bold 72px "Arial Narrow", sans-serif';
      ctx.fillText((userName || "YOUR NAME").toUpperCase(), CANVAS_SIZE / 2, 1035);
      ctx.fillStyle = yellow;
      ctx.font = 'bold 34px monospace';
      ctx.fillText(`${city}  •  ${date}`, CANVAS_SIZE / 2, 1100);
      ctx.fillStyle = pink;
      ctx.font = 'bold 30px monospace';
      ctx.fillText("BUILD LOUD · SHIP OFTEN · GOA 2026", CANVAS_SIZE / 2, 1195);
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
