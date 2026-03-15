import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, Clock } from "lucide-react";
import { BUSINESS, NAV_LINKS } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 pb-20 md:pb-0">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Image
              src="/images/logo-white.png"
              alt="Rockstar Windshield Repair"
              width={200}
              height={50}
              className="h-12 w-auto"
            />
            <p className="mt-4 text-sm text-zinc-400">
              Professional mobile windshield repair in{" "}
              {BUSINESS.address.city}, {BUSINESS.address.state} and surrounding
              areas. Fully insured.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-widest text-blue-600">
              Quick Links
            </h3>
            <nav className="mt-3 flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-zinc-400 transition-colors hover:text-blue-600"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-widest text-blue-600">
              Contact Us
            </h3>
            <div className="mt-3 flex flex-col gap-3">
              <a
                href={BUSINESS.phoneHref}
                className="flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-blue-600"
              >
                <Phone className="h-4 w-4 text-blue-600" />
                {BUSINESS.phone}
              </a>
              <a
                href={`mailto:${BUSINESS.email}`}
                className="flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-blue-600"
              >
                <Mail className="h-4 w-4 text-blue-600" />
                {BUSINESS.email}
              </a>
              <div className="flex items-start gap-2 text-sm text-zinc-400">
                <Clock className="mt-0.5 h-4 w-4 text-blue-600" />
                <div>
                  <p>{BUSINESS.hours.weekdays}</p>
                  <p>{BUSINESS.hours.saturday}</p>
                  <p>{BUSINESS.hours.sunday}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-zinc-800 pt-6 text-center text-sm text-zinc-400">
          &copy; {new Date().getFullYear()} {BUSINESS.name}. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
