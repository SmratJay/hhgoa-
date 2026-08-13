'use client'
import Link from 'next/link'
import Image from 'next/image'
import {Menu, X} from 'lucide-react'
import React from 'react'

export const HeroHeader = () => {
    const [menuState, setMenuState] = React.useState(false)
    return (
        <header>
            <nav
                data-state={menuState && 'active'}
                className="bg-background/50 fixed z-20 w-full border-b backdrop-blur-3xl">
                <div className="mx-auto max-w-6xl px-6 transition-all duration-300">
                    <div className="relative flex flex-wrap items-center justify-between gap-6 py-2.5 lg:gap-0 lg:py-3">
                        <div className="flex w-full items-center justify-between gap-12 lg:w-auto">
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

                            <button
                                onClick={() => setMenuState(!menuState)}
                                aria-label={menuState ? 'Close Menu' : 'Open Menu'}
                                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                                <Menu
                                    className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200"/>
                                <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200"/>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}
