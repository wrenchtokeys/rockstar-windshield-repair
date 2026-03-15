import { Phone, FileText } from "lucide-react";
import Button from "@/components/ui/Button";
import { BUSINESS } from "@/lib/constants";

export default function Hero() {
  return (
    <section className="noise-overlay relative flex min-h-[85vh] items-center justify-center bg-zinc-950">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950" />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 text-center">
        <p className="mb-4 font-heading text-sm uppercase tracking-[0.3em] text-blue-400">
          Little Rock&apos;s Premier Mobile Service
        </p>
        <h1 className="font-heading text-5xl font-bold uppercase leading-tight tracking-wider text-white md:text-7xl">
          Rock-Solid
          <br />
          <span className="text-blue-600">Windshield Repair</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400 md:text-xl">
          Fast, professional windshield chip and crack repair — we come to you
          anywhere in {BUSINESS.address.city}, {BUSINESS.address.state}.
          Same-day service. Insurance approved. Fully insured.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button href="/contact" variant="primary">
            <FileText className="mr-2 h-4 w-4" />
            Get a Free Quote
          </Button>
          <Button href={BUSINESS.phoneHref} variant="outline">
            <Phone className="mr-2 h-4 w-4" />
            Call {BUSINESS.phone}
          </Button>
        </div>
      </div>

      {/* Diagonal bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-zinc-950 diagonal-top" />
    </section>
  );
}
