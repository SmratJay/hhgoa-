import Link from 'next/link'
import Image from 'next/image'
import React from "react";

const socialLinks = [
    {
        label: 'hhgoa.com',
        href: 'https://hhgoa.com',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
        ),
    },
    {
        label: '@247pmstudio',
        href: 'https://x.com/247pmstudio',
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
        ),
    },
    {
        label: 'Telegram',
        href: 'https://t.me/twofourtysevenpm',
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.4 14.28l-2.95-.924c-.64-.203-.654-.64.136-.954l11.52-4.443c.534-.194 1.003.131.456.289z"/>
            </svg>
        ),
    },
    {
        label: 'Email',
        href: 'https://mail.google.com/mail/u/0/?fs=1&to=satapathyprayasu@gmail.com&tf=cm',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
        ),
    },
]

export default function FooterSection() {
    return (
        <footer className="border-t border-[#fff9df]/10 py-16 md:py-24 relative overflow-hidden">
            {/* subtle dot grid */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage: 'radial-gradient(#f8db19 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                }}
            />

            <div className="relative mx-auto max-w-5xl px-6">
                {/* Logo */}
                <Link href="/" aria-label="go home" className="mx-auto block w-fit mb-6">
                    <div className="relative w-[200px] h-[160px]" style={{ mixBlendMode: 'multiply' }}>
                        <Image
                            src="/hhg-logo.png"
                            alt="Hacker House Goa"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </Link>

                {/* HHGOA 2026 badge */}
                <div className="text-center mb-10">
                    <span
                        className="inline-block text-[#f8db19] text-3xl md:text-4xl font-black tracking-tight"
                        style={{ fontFamily: 'Georgia, "Times New Roman", serif', letterSpacing: '-0.04em' }}
                    >
                        HACKER HOUSE{' '}
                        <em className="not-italic text-[#ff1680]">GOA</em>
                        {' '}
                        <span className="text-[#fff9df]/40 text-2xl md:text-3xl font-bold">2026</span>
                    </span>
                    <p className="text-[#fff9df]/40 font-mono text-xs tracking-[0.25em] uppercase mt-2">
                        28–31 OCT · PANAJI, GOA
                    </p>
                </div>

                {/* Social links */}
                <div className="flex flex-wrap justify-center gap-4 mb-10">
                    {socialLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2.5 rounded-sm border border-[#fff9df]/15 text-[#fff9df]/60 hover:text-[#f8db19] hover:border-[#f8db19]/40 font-mono text-xs uppercase tracking-widest transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(248,219,25,0.15)]"
                        >
                            {link.icon}
                            {link.label}
                        </a>
                    ))}
                </div>

                {/* Nav links */}
                <div className="flex flex-wrap justify-center gap-6 text-xs font-mono mb-10">
                    <Link href="/lanyard" className="text-[#fff9df]/40 hover:text-[#fff9df] transition-colors uppercase tracking-widest">
                        Create ID Card
                    </Link>
                    <Link href="/shack" className="text-[#fff9df]/40 hover:text-[#fff9df] transition-colors uppercase tracking-widest">
                        GitHub Shack
                    </Link>
                </div>

                {/* Tagline */}
                <p className="text-center text-[#fff9df]/25 font-mono text-[11px] tracking-[0.3em] uppercase">
                    BUILD LOUD · SHIP OFTEN · HACK FROM THE SAND
                </p>
            </div>
        </footer>
    )
}
