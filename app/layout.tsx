import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
