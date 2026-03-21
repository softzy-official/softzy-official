import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Poppins,
  Playfair_Display,
  Inter,
  Nunito,
} from "next/font/google";
import "./globals.css";
import Navbar from "@/components/extras/navbar";
import Footer from "@/components/extras/footer";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { NextAuthProvider } from "@/components/NextAuthProvider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://softzy.co.in"),
  title: {
    default: "SOFTZY | Premium Fashion & Lifestyle Store",
    template: "%s | SOFTZY",
  },
  description:
    "Shop premium fashion, accessories, and lifestyle essentials at SOFTZY. Secure checkout, fast delivery, and curated collections for everyday style.",
  keywords: [
    "SOFTZY",
    "ecommerce",
    "online shopping",
    "fashion",
    "lifestyle",
    "accessories",
    "india",
  ],
  applicationName: "SOFTZY",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://softzy.co.in",
    siteName: "SOFTZY",
    title: "SOFTZY | Premium Fashion & Lifestyle Store",
    description:
      "Discover curated fashion and lifestyle products with secure payments and fast shipping.",
    images: [
      {
        url: "/logo2.png",
        width: 1200,
        height: 630,
        alt: "SOFTZY",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SOFTZY | Premium Fashion & Lifestyle Store",
    description:
      "Discover curated fashion and lifestyle products with secure payments and fast shipping.",
    images: ["/logo2.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          ${poppins.variable}
          ${playfair.variable}
          ${inter.variable}
          ${nunito.variable}
          antialiased
        `}
      >
        <NextAuthProvider>
          <Toaster position="top-center" richColors />
          {children}
          <Analytics />
          <SpeedInsights />
        </NextAuthProvider>
      </body>
    </html>
  );
}
