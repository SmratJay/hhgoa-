import Link from 'next/link'
import React from "react";

const links = [
    { title: 'Create your card', href: '/lanyard' },
    { title: 'Hacker House Goa', href: '/' },
]

export default function FooterSection() {
    return (
        <footer className="py-16 md:py-32">
            <div className="mx-auto max-w-5xl px-6">
                <Link
                    href="/"
                    aria-label="go home"
                    className="mx-auto block size-fit">
                    <span className="font-mono font-bold tracking-[0.2em] text-[#f8db19]">HHG</span>
                </Link>

                <div className="my-8 flex flex-wrap justify-center gap-6 text-sm">
                    {links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.href}
                            className="text-muted-foreground hover:text-primary block duration-150">
                            <span>{link.title}</span>
                        </Link>
                    ))}
                </div>
                <span className="text-muted-foreground block text-center text-sm font-mono">HACKER HOUSE GOA · BUILD LOUD · SHIP OFTEN</span>
            </div>
        </footer>
    )
}
