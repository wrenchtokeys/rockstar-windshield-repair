"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Menu } from "lucide-react";
import { NAV_LINKS, BUSINESS } from "@/lib/constants";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo-white.png"
              alt="Rockstar Windshield Repair"
              width={240}
              height={60}
              className="h-12 w-auto"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-6 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium uppercase tracking-widest text-zinc-400 transition-colors hover:text-blue-600"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <a
            href={BUSINESS.phoneHref}
            className="hidden items-center gap-2 bg-blue-600 px-5 py-2 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-blue-500 btn-angular lg:flex"
          >
            <Phone className="h-4 w-4" />
            {BUSINESS.phone}
          </a>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(true)}
            className="p-2 text-zinc-400 hover:text-white lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
