"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import LanyardWithControls from "@/components/lanyard-with-controls";
import { decryptLanyardData, type LanyardData } from "@/lib/utils";

function LanyardContent() {
  const searchParams = useSearchParams();
  
  // Decrypt lanyard data (username + variant) from URL params if present
  const lanyardData = useMemo((): LanyardData | null => {
    const encrypted = searchParams.get("u");
    if (encrypted) {
      return decryptLanyardData(encrypted);
    }
    return null;
  }, [searchParams]);

  return (
    <main className="goa-page relative flex min-h-dvh flex-col items-center justify-center overflow-hidden">
      <div className="goa-shell relative w-full max-w-6xl">
        <div className="goa-copy pointer-events-none absolute left-6 top-24 z-10 max-w-sm lg:left-12 lg:top-36">
          <p className="goa-kicker">HACKER HOUSE GOA · 2026</p>
          <h1>Make your mark.<br /><em>Hang it loud.</em></h1>
          <p className="goa-intro">Upload a photo, add your name, then download your event-ready ID card or share it on X.</p>
        </div>
        <LanyardWithControls
          position={[0, 0, 18]}
          containerClassName="relative h-[790px] w-full sm:h-[850px]"
          defaultName={lanyardData?.username || ""}
          defaultVariant={lanyardData?.variant || "dark"}
        />
      </div>
    </main>
  );
}

export default function LanyardPage() {
  return (
    <Suspense fallback={
      <main className="relative flex min-h-dvh flex-col items-center justify-center">
        <div className="relative w-full max-w-2xl">
          <div className="flex h-screen items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        </div>
      </main>
    }>
      <LanyardContent />
    </Suspense>
  );
}
