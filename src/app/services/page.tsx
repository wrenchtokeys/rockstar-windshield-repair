import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import { SERVICES } from "@/lib/services-data";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { CheckCircle } from "lucide-react";

export const metadata: Metadata = createMetadata(
  "Services",
  "Windshield chip repair, crack repair, star break repair, mobile service, insurance claims, and fleet services in Little Rock, AR.",
  "/services"
);

export default function ServicesPage() {
  return (
    <div className="bg-zinc-950 py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading subtitle="Expert windshield repair for the general public and commercial fleets.">
          Our Services
        </SectionHeading>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <Card key={service.slug}>
              <service.icon className="h-8 w-8 text-blue-600" />
              <h3 className="mt-4 font-heading text-xl font-bold uppercase tracking-wider text-white">
                {service.title}
              </h3>
              <p className="mt-2 text-sm text-zinc-400">
                {service.description}
              </p>
              <ul className="mt-4 space-y-2">
                {service.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-zinc-300"
                  >
                    <CheckCircle className="h-4 w-4 flex-shrink-0 text-blue-600" />
                    {feature}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button href="/contact">Get a Free Quote</Button>
        </div>
      </div>
    </div>
  );
}
