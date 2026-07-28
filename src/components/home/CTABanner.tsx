import { AlertTriangle, Phone, MessageSquare } from "lucide-react";
import Button from "@/components/ui/Button";
import { BUSINESS, PRICING } from "@/lib/constants";

export default function CTABanner() {
  return (
    <section className="relative bg-gradient-to-r from-blue-800 to-blue-600 py-16">
      <div className="mx-auto max-w-7xl px-4 text-center">
        <AlertTriangle className="mx-auto h-10 w-10 text-white" />
        <h2 className="mt-4 font-heading text-3xl font-bold uppercase tracking-wider text-white md:text-4xl">
          Don&apos;t Wait — Small Chips Become Big Cracks
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
          A small chip can spread across your entire windshield in days. A $
          {PRICING.chipMin} repair today beats a $400+ replacement next week —
          and with comprehensive insurance it&apos;s usually $0.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button href="/contact" variant="secondary" className="bg-zinc-950 text-white hover:bg-zinc-800">
            Get a Free Quote
          </Button>
          <Button href={BUSINESS.smsHref} variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
            <MessageSquare className="mr-2 h-4 w-4" />
            Text a Photo
          </Button>
          <Button href={BUSINESS.phoneHref} variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
            <Phone className="mr-2 h-4 w-4" />
            Call Now
          </Button>
        </div>
      </div>
    </section>
  );
}
