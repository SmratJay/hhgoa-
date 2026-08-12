import Link from "next/link";

export default function Home() {
    return (
        <>
            <section className="goa-page flex min-h-dvh items-center justify-center px-6 pt-20 text-center">
                <div className="max-w-3xl">
                    <p className="goa-kicker mb-5">HACKER HOUSE GOA · 28–31 OCT 2026</p>
                    <h1 className="goa-copy text-6xl font-bold tracking-tight text-[#fff9df] md:text-9xl">Make your mark.<br /><em className="text-[#f8db19]">Hang it loud.</em></h1>
                    <p className="mx-auto mt-8 max-w-xl font-mono text-sm leading-6 text-[#fff9df]/80">Upload your photo. Get your Hacker House Goa ID card. Download it, share it, and let the internet know you’re building from the sand.</p>
                    <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link href="/lanyard" className="inline-flex bg-[#f8db19] px-7 py-4 font-mono text-sm font-bold uppercase tracking-wider text-[#075b39] shadow-[7px_7px_0_#ff1680] transition hover:-translate-y-1">Create my ID card →</Link>
                        <Link href="/shack" className="inline-flex bg-[#ff1680] px-7 py-4 font-mono text-sm font-bold uppercase tracking-wider text-[#fff9df] shadow-[7px_7px_0_#f8db19] transition hover:-translate-y-1">Check my GitHub Shack →</Link>
                    </div>
                </div>
            </section>
        </>
    )
}
