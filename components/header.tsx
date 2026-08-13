'use client'
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'

export const HeroHeader = () => {
    return (
        <header>
            <nav className="bg-background/50 fixed z-20 w-full border-b backdrop-blur-3xl">
                <div className="mx-auto max-w-6xl px-6 transition-all duration-300">
                    <div className="relative flex items-center justify-between py-2.5 lg:py-3">
                        <Link
                            href="/"
                            aria-label="home"
                            className="flex items-center gap-3 group">
                            <div className="relative w-12 h-10 overflow-hidden rounded-sm" style={{ mixBlendMode: 'multiply' }}>
                                <Image
                                    src="/hhg-logo.png"
                                    alt="Hacker House Goa"
                                    fill
                                    className="object-contain transition-transform duration-300 group-hover:scale-105"
                                    priority
                                />
                            </div>
                            <span className='font-mono font-bold tracking-[0.16em] text-[#f8db19] text-sm group-hover:text-[#ff1680] transition-colors'>
                                HHG / 26
                            </span>
                        </Link>
                    </div>
                </div>
            </nav>
        </header>
    )
}
