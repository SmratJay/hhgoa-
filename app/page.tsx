import Link from "next/link";
import Image from "next/image";

export default function Home() {
    return (
        <main className="relative flex min-h-dvh items-center justify-center px-6 pt-24 pb-16 text-center overflow-hidden">
            <div className="relative z-10 max-w-4xl flex flex-col items-center">
                {/* Original colorful HHGOA logo image */}
                <div className="relative w-[240px] h-[180px] md:w-[320px] md:h-[230px] mb-4" style={{ mixBlendMode: 'multiply' }}>
                    <Image
                        src="/hhg-logo.png"
                        alt="Hacker House Goa"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>

                <p className="goa-kicker mb-4">HACKER HOUSE GOA · 28–31 OCT 2026</p>
                <h1 className="goa-copy text-5xl font-bold tracking-tight text-[#fff9df] md:text-8xl" style={{ fontFamily: "'Space Grotesk', Georgia, serif" }}>
                    Make your mark.<br />
                    <em className="text-[#f8db19] not-italic">Hang it loud.</em>
                </h1>
                <p className="mx-auto mt-6 max-w-xl font-mono text-sm leading-relaxed text-[#fff9df] drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                    Upload your photo. Get your Hacker House Goa ID card. Download it, share it, and let the internet know you’re building from the sand.
                </p>
                <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-5">
                    <Link
                        href="/lanyard"
                        className="inline-flex bg-[#f8db19] px-7 py-4 font-mono text-sm font-bold uppercase tracking-wider text-[#075b39] shadow-[7px_7px_0_#ff1680] transition hover:-translate-y-1 hover:shadow-[9px_9px_0_#ff1680]"
                    >
                        Create my ID card →
                    </Link>
                    <Link
                        href="/shack"
                        className="inline-flex bg-[#ff1680] px-7 py-4 font-mono text-sm font-bold uppercase tracking-wider text-[#fff9df] shadow-[7px_7px_0_#f8db19] transition hover:-translate-y-1 hover:shadow-[9px_9px_0_#f8db19]"
                    >
                        Check my GitHub Shack →
                    </Link>
                </div>
            </div>
        </main>
    );
}
