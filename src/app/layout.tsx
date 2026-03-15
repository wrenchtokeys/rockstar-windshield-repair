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
    "Professional mobile windshield repair in Little Rock, AR. Same-day service, insurance claims assistance, fleet services, and lifetime warranty. Fully insured. Call 501-282-7129.",
  metadataBase: new URL(`https://${BUSINESS.domain}`),
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
