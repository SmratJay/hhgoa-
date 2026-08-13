import React from "react"
import type {Metadata} from 'next'
import './globals.css'
import FooterSection from "@/components/footer";
import {HeroHeader} from "@/components/header";
import {AppClientShell} from "@/components/AppClientShell";

export const metadata: Metadata = {
    title: 'Hacker House Goa — ID Card Generator & Leaderboard',
    description: 'Create your Hacker House Goa event ID card, download it, check your GitHub Shack tier, and listen to Goa beach vibes.',
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" className="dark">
        <head>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        </head>
        <body className="font-sans antialiased">
        <AppClientShell>
            <HeroHeader/>
            {children}
            <FooterSection/>
        </AppClientShell>
        </body>
        </html>
    )
}
