import React from "react"
import type {Metadata} from 'next'
import './globals.css'
import FooterSection from "@/components/footer";
import {HeroHeader} from "@/components/header";

export const metadata: Metadata = {
    title: 'Hacker House Goa — ID Card Generator',
    description: 'Create your Hacker House Goa event ID card, download it, and share it on X.',
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" className="dark">
        <body className="font-sans antialiased">
        <HeroHeader/>
        {children}
        <FooterSection/>
        </body>
        </html>
    )
}
