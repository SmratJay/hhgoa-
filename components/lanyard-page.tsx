"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
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
    <main className="relative flex min-h-screen flex-col items-center justify-start overflow-hidden pt-24 pb-32 sm:pt-28 sm:pb-40 lg:pt-32 lg:pb-48">
      <div className="goa-shell relative w-full max-w-6xl flex flex-col items-center">
        {/* On mobile, text is relative at top; on desktop (lg:), text is absolute on left */}
        <div className="goa-copy pointer-events-none relative lg:absolute left-0 lg:left-12 top-0 lg:top-24 z-10 max-w-sm text-center lg:text-left mx-auto lg:mx-0 px-4 lg:px-0 mb-6 lg:mb-0">
          <div className="relative w-32 h-24 lg:w-36 lg:h-28 mx-auto lg:mx-0 mb-1" style={{ mixBlendMode: 'multiply' }}>
            <Image
              src="/hhg-logo.png"
              alt="Hacker House Goa"
              fill
              className="object-contain"
              priority
            />
          </div>
          <p className="goa-kicker">HACKER HOUSE GOA · 2026</p>
          <h1 className="text-4xl lg:text-6xl font-bold tracking-tight" style={{ fontFamily: "'Space Grotesk', Georgia, serif" }}>Make your mark.<br /><em>Hang it loud.</em></h1>
          <p className="goa-intro mx-auto lg:mx-0">Upload a photo, add your name, then download your event-ready ID card or share it on X.</p>
        </div>
        <LanyardWithControls
          position={[0, 0, 18]}
          containerClassName="relative h-[480px] w-full sm:h-[580px] lg:h-[620px] mt-2 lg:mt-0"
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
