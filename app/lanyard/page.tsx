import type { Metadata } from "next";
import LanyardPage from "@/components/lanyard-page";

const EVENT_CITY = "Goa, India";
const EVENT_DATE = "28 - 31 Oct 2026";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// Decryption helper for metadata generation
function decryptLanyardData(encrypted: string): { username: string; variant: "dark" | "light" } | null {
  const OBFUSCATION_KEY = "hhg26";
  
  if (!encrypted) return null;
  try {
    let base64 = encrypted.replace(/-/g, "+").replace(/_/g, "/");
    const padding = (4 - (base64.length % 4)) % 4;
    base64 += "=".repeat(padding);
    
    const binary = Buffer.from(base64, "base64").toString("binary");
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const decoded = new TextDecoder().decode(bytes);
    
    if (decoded.startsWith(`${OBFUSCATION_KEY}:`)) {
      const withoutKey = decoded.slice(OBFUSCATION_KEY.length + 1);
      const colonIndex = withoutKey.indexOf(":");
      if (colonIndex === -1) return null;
      
      const variant = withoutKey.slice(0, colonIndex) as "dark" | "light";
      const username = withoutKey.slice(colonIndex + 1);
      
      if (variant !== "dark" && variant !== "light") return null;
      
      return { username, variant };
    }
    return null;
  } catch {
    return null;
  }
}

interface PageProps {
  searchParams: Promise<{ u?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const encrypted = resolvedSearchParams.u;
  const data = encrypted ? decryptLanyardData(encrypted) : null;
  
  const userName = data?.username || "Attendee";
  const hasUser = !!data?.username;
  
  const title = hasUser
    ? `${userName} | Hacker House Goa`
    : `Hacker House Goa ID Card Generator`;
  
  const description = hasUser
    ? `${userName} is building at Hacker House Goa, ${EVENT_CITY}, ${EVENT_DATE}.`
    : `Create your Hacker House Goa ID card, download it, and share it on X.`;

  const pageUrl = encrypted 
    ? `${SITE_URL}/lanyard?u=${encrypted}`
    : `${SITE_URL}/lanyard`;

  // OG Image URLs - different formats for different platforms
  const ogImageUrl = encrypted
    ? `${SITE_URL}/api/og?u=${encrypted}&format=og`
    : `${SITE_URL}/api/og?format=og`;
  
  const twitterImageUrl = encrypted
    ? `${SITE_URL}/api/og?u=${encrypted}&format=twitter`
    : `${SITE_URL}/api/og?format=twitter`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: `Hacker House Goa`,
      type: "website",
      locale: "en_US",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${userName} - Hacker House Goa`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@247pmstudio",
      images: [twitterImageUrl],
    },
  };
}

export default function Page() {
  return <LanyardPage />;
}
