import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PalmAI - Read Your Future in Seconds",
  description: "AI-powered palm reading. Upload a photo of your palm and receive personalized insights about your heart line, head line, life line, and fate line.",
  keywords: "palm reading, AI palmistry, hand reading, fortune telling, palm lines",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased" style={{ background: '#0a0a0f' }}>
        {children}
      </body>
    </html>
  );
}
