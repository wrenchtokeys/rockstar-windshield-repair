import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { SERVICE_CITIES, BUSINESS } from "@/lib/constants";
import { MapPin } from "lucide-react";

export const metadata: Metadata = createMetadata(
  "Service Area",
  "Rockstar Windshield Repair serves Little Rock, North Little Rock, Conway, Benton, Bryant, and surrounding Central Arkansas communities.",
  "/service-area"
);

export default function ServiceAreaPage() {
  return (
    <div className="bg-zinc-950 py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading subtitle="We bring professional windshield repair to your doorstep across Central Arkansas.">
          Service Area
        </SectionHeading>

        <div className="grid gap-6 md:grid-cols-2">
          {SERVICE_CITIES.map((city) => (
            <div
              key={city.name}
              className="rounded-lg border border-zinc-800 bg-zinc-900 p-6"
            >
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <h3 className="font-heading text-lg font-bold uppercase tracking-wider text-white">
                  {city.name}, {BUSINESS.address.state}
                </h3>
              </div>
              <p className="mt-2 text-sm text-zinc-400">{city.description}</p>
            </div>
          ))}
        </div>

        {/* Map Embed */}
        <div className="mt-12 overflow-hidden rounded-lg border border-zinc-800">
          <iframe
            title="Rockstar Windshield Repair Service Area"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d209730.29885498995!2d-92.4445!3d34.7465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87d2a134a11f569b%3A0x3405f5100df35b17!2sLittle%20Rock%2C%20AR!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="mt-12 text-center">
          <p className="mb-4 text-zinc-400">
            Don&apos;t see your area? Give us a call — we may still be able to
            come to you!
          </p>
          <Button href="/contact">Schedule Your Repair</Button>
        </div>
      </div>
    </div>
  );
}
