import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SmoothCursor } from "@/components/ui/smooth-cursor";
import { Orbitron, Rajdhani } from 'next/font/google'

const orbitron = Orbitron({ subsets: ['latin'], weight: ['400','700','900'], variable: '--font-orbitron' })
const rajdhani = Rajdhani({ subsets: ['latin'], weight: ['400','500','600','700'], variable: '--font-rajdhani' })


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Metallix '26",
  description: "The official website for Metallix '26, the annual Techno-Management fest of Jadavpur University. Explore events, workshops, and more!",
  icons: {
    icon: "/met2026Logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} ${rajdhani.variable} antialiased`}
      >
        
        <SmoothCursor/>
        {children}
      </body>
    </html>
  );
}
