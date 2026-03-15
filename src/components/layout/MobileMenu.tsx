"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { NAV_LINKS, BUSINESS } from "@/lib/constants";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-72 transform bg-zinc-900 shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-zinc-800 p-4">
          <span className="font-heading text-lg font-bold uppercase tracking-wider text-blue-600">
            Menu
          </span>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex flex-col p-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="border-b border-zinc-800 py-3 font-heading text-sm uppercase tracking-widest text-zinc-300 transition-colors hover:text-blue-600"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={BUSINESS.phoneHref}
            className="mt-6 flex items-center justify-center bg-blue-600 py-3 text-sm font-bold uppercase tracking-widest text-white btn-angular"
          >
            Call {BUSINESS.phone}
          </a>
        </nav>
      </div>
    </>
  );
}
