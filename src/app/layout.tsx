import type { Metadata } from "next";
import { Geist, Geist_Mono, Baloo_Chettan_2 } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baloo = Baloo_Chettan_2({
  variable: "--font-malayalam",
  subsets: ["malayalam", "latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Kerala Radio",
  description: "An ambient Kerala backwaters scene with a live radio player.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${baloo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
