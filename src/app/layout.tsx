import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { PWARegister } from "@/components/PWARegister";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#f59e0b",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://xixibolahacked.vercel.app"),
  title: "XIXIBOLA PRIME - Elemental Strategy Arena",
  description: "Ultimate Tic-Tac-Toe com poderes elementais épicos! Estratégia, magia e batalhas lendárias. Jogue offline!",
  keywords: ["jogo", "game", "tic-tac-toe", "estratégia", "elemental", "poderes", "offline", "pwa"],
  authors: [{ name: "XIXIBOLA Team" }],
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-72x72.png", sizes: "72x72", type: "image/png" },
      { url: "/icons/icon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/icons/icon-128x128.png", sizes: "128x128", type: "image/png" },
      { url: "/icons/icon-144x144.png", sizes: "144x144", type: "image/png" },
      { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-384x384.png", sizes: "384x384", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "XIXIBOLA PRIME",
    startupImage: "/icons/icon-512x512.png",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "XIXIBOLA PRIME - Elemental Strategy Arena",
    description: "Ultimate Tic-Tac-Toe com poderes elementais épicos! Jogue offline!",
    url: "https://xixibolahacked.vercel.app",
    siteName: "XIXIBOLA PRIME",
    type: "website",
    images: [
      {
        url: "/logo-game.png",
        width: 512,
        height: 512,
        alt: "XIXIBOLA PRIME Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "XIXIBOLA PRIME - Elemental Strategy Arena",
    description: "Ultimate Tic-Tac-Toe com poderes elementais épicos!",
    images: ["/logo-game.png"],
  },
  applicationName: "XIXIBOLA PRIME",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* PWA Meta Tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="XIXIBOLA PRIME" />
        <meta name="application-name" content="XIXIBOLA PRIME" />
        <meta name="mobileoptimized" content="width" />
        <meta name="handheldfriendly" content="true" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-TileColor" content="#f59e0b" />
        <meta name="msapplication-tap-highlight" content="no" />
        {/* TWA specific */}
        <meta name="chrome-webstore-item" content="https://chrome.google.com/webstore/detail/xixibola-prime" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <PWARegister />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
