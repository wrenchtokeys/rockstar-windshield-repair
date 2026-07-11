import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import SectionHeading from "@/components/ui/SectionHeading";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";
import MapEmbed from "@/components/contact/MapEmbed";

// Force dynamic rendering so this route is never served from the CDN cache.
// The contact form uses a Server Action (POST /contact); if the page is
// statically prerendered, CloudFront serves the cached page for the POST and
// the action never reaches the compute ("Connection closed" / action not run).
export const dynamic = "force-dynamic";

export const metadata: Metadata = createMetadata(
  "Contact Us",
  "Get a free windshield repair quote in Little Rock, AR. Fill out our contact form or call us for same-day service.",
  "/contact"
);

export default function ContactPage() {
  return (
    <div className="bg-zinc-950 py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading subtitle="Get your free quote in minutes.">
          Contact Us
        </SectionHeading>

        <div className="grid gap-12 lg:grid-cols-5">
          {/* Form */}
          <div className="lg:col-span-3">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6 md:p-8">
              <ContactForm />
            </div>
          </div>

          {/* Info + Map */}
          <div className="lg:col-span-2">
            <ContactInfo />
            <MapEmbed />
          </div>
        </div>
      </div>
    </div>
  );
}
