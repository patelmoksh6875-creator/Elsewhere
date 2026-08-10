import type { Metadata } from "next";
import { Geist, Geist_Mono, Yatra_One, Space_Grotesk } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const titleFont = Yatra_One({
  variable: "--font-title",
  subsets: ["devanagari", "latin"],
  weight: "400",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-clock",
  subsets: ["latin"],
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  title: "Elsewhere",
  description: "An ambient multi-scene radio — Kerala backwaters, summer coast, and more.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${titleFont.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
