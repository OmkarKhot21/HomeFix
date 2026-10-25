import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import "./globals.css";

// Self-hosted by Next.js: no request to Google from the visitor's browser.
const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", display: "swap" });
const body = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "HomeFix | Fixing Homes, Improving Lives",
  description: "Instant on-demand home repairs in Mumbai, Thane & Navi Mumbai. Book verified plumbers, electricians, and carpenters with 15-minute arrival.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
