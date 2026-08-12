import { ImageResponse } from "next/og";

// Decryption helper
function decryptLanyardData(
  encrypted: string
): { username: string; variant: "dark" | "light" } | null {
  const OBFUSCATION_KEY = "hhg26";

  if (!encrypted) return null;
  try {
    let base64 = encrypted.replace(/-/g, "+").replace(/_/g, "/");
    const padding = (4 - (base64.length % 4)) % 4;
    base64 += "=".repeat(padding);

    const binary = atob(base64);
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

export async function GET(request: Request) {
  try {

      const EVENT_CITY = "Goa, India";
      const EVENT_DATE = "28 - 31 Oct 2026";
      const TITLE = 'Hacker House Goa'

    const { searchParams } = new URL(request.url);
    const encrypted = searchParams.get("u");
    const format = searchParams.get("format") || "og"; // og, twitter, linkedin, square

    const data = encrypted ? decryptLanyardData(encrypted) : null;
    const userName = data?.username || "Attendee";
    const variant = data?.variant || "dark";

    // Format dimensions
    const dimensions = {
      og: { width: 1200, height: 630 }, // Facebook, LinkedIn, Discord
      twitter: { width: 1200, height: 600 }, // Twitter summary_large_image
      linkedin: { width: 1200, height: 627 }, // LinkedIn optimal
      square: { width: 1200, height: 1200 }, // Instagram, WhatsApp
    };

    const { width, height } = dimensions[format as keyof typeof dimensions] || dimensions.og;

    const bgColor = "#075b39";
    const textColor = variant === "light" ? "#fffaf0" : "#f8db19";
    const accentColor = "#ff1680";
    const mutedColor = "#fffaf0";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
              backgroundColor: bgColor,
              fontFamily: 'Arial, Helvetica, sans-serif',
              fontSize: 48,
            padding: "60px",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              border: "18px solid #f8db19",
              boxSizing: "border-box",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: 18,
              backgroundColor: accentColor,
            }}
          />
          <div style={{
              display: 'flex',
              gap: '36px',
              alignItems: 'center'
          }}>
            <div
              style={{
                width: 152,
                height: 152,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "8px solid #f8db19",
                color: "#f8db19",
                fontSize: 54,
                fontWeight: 900,
                letterSpacing: 8,
              }}
            >
              HHG
            </div>
              <div style={{
                  display: 'flex',
                  flexDirection: 'column',
              }}>
                <span style={{
                    color: textColor,
                    textTransform: 'uppercase',
                    lineHeight: '56px',
                }}>{EVENT_CITY}</span>
                <span style={{
                    color: mutedColor,
                    textTransform: 'uppercase',
                    lineHeight: '56px'
                }}>{EVENT_DATE}</span>
              </div>
          </div>
            <div style={{
                display: 'flex',
                gap: '36px',
                marginBottom: '32px'
            }}>
                <span style={{
                    color: textColor,
                    fontSize: '130px',
                    lineHeight: '122px',
                    fontWeight: 900,
                }}>
                    {TITLE}
                </span>
            </div>
            <div style={{
                display: 'flex',
                gap: '36px',
            }}>
                <span style={{
                    color: mutedColor,
                    lineHeight: '56px',
                    textTransform: 'uppercase'
                }}>
                    {userName}
                </span>
            </div>
        </div>
      ),
      {
        width,
        height,
      }
    );
  } catch (e) {
    console.log(`OG Image Generation Error: ${e}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
