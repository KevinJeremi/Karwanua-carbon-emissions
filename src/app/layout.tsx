import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { AIProvider } from "@/contexts/AIContext";
import { AppDataProvider } from "@/contexts/AppDataContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Karwanua - Real-time Carbon Monitoring",
  description: "Monitor real-time carbon emissions with GPS-based detection and WebGIS visualization",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AIProvider>
          <AppDataProvider>
            {children}
          </AppDataProvider>
        </AIProvider>
      </body>
    </html>
  );
}
