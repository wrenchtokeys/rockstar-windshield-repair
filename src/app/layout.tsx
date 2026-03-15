import type { Metadata } from "next";
import { Oswald, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ClickToCall from "@/components/common/ClickToCall";
import JsonLd from "@/components/common/JsonLd";
import { BUSINESS } from "@/lib/constants";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${BUSINESS.name} | Mobile Windshield Repair in ${BUSINESS.address.city}, ${BUSINESS.address.state}`,
    template: `%s | ${BUSINESS.name}`,
  },
  description:
    "Professional mobile windshield chip and crack repair in Little Rock, AR. Same-day service, insurance approved, 3-year warranty. We come to you.",
  metadataBase: new URL(`https://${BUSINESS.domain}`),
  keywords: [
    "windshield repair Little Rock",
    "mobile windshield repair AR",
    "chip repair near me",
    "crack repair Little Rock Arkansas",
    "auto glass repair Central Arkansas",
    "fleet windshield service",
    "insurance windshield repair",
    "Rockstar Windshield Repair",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: BUSINESS.name,
    images: [
      {
        url: `/images/logo.png`,
        width: 1200,
        height: 630,
        alt: BUSINESS.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [`/images/logo.png`],
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
  verification: {},
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${oswald.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-zinc-950 font-sans text-white antialiased">
        <JsonLd />
        <Header />
        <main>{children}</main>
        <Footer />
        <ClickToCall />
      </body>
    </html>
  );
}
