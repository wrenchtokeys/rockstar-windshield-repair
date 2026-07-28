import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import { SERVICES } from "@/lib/services-data";
import { BUSINESS, PRICING } from "@/lib/constants";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import { CheckCircle, BadgeDollarSign, Truck } from "lucide-react";

export const metadata: Metadata = createMetadata(
  "Services & Pricing",
  "Windshield chip repair ($65–$85), crack repair ($125), fleet volume pricing, mobile service, and insurance claims in Little Rock, AR. Often $0 with insurance.",
  "/services"
);

export default function ServicesPage() {
  return (
    <div className="bg-zinc-950 py-20">
      <Breadcrumbs items={[{ label: "Services", href: "/services" }]} />
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          as="h1"
          subtitle="Expert windshield repair for the general public and commercial fleets."
        >
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

        {/* Pricing */}
        <div className="mt-20">
          <SectionHeading subtitle="No surprises — know what your repair costs before you ever pick up the phone.">
            Straightforward Pricing
          </SectionHeading>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Everyday drivers */}
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-8">
              <div className="flex items-center gap-3">
                <BadgeDollarSign className="h-8 w-8 text-blue-600" />
                <h3 className="font-heading text-xl font-bold uppercase tracking-wider text-white">
                  Everyday Drivers
                </h3>
              </div>
              <ul className="mt-6 space-y-4">
                <li className="flex items-baseline justify-between gap-4 border-b border-zinc-800 pb-4">
                  <span className="text-zinc-300">Chip repair</span>
                  <span className="whitespace-nowrap font-heading text-2xl font-bold text-white">
                    ${PRICING.chipMin}&ndash;${PRICING.chipMax}
                  </span>
                </li>
                <li className="flex items-baseline justify-between gap-4 border-b border-zinc-800 pb-4">
                  <span className="text-zinc-300">
                    Crack repair ({PRICING.crackMinInches}&ndash;
                    {PRICING.crackMaxInches} inches)
                  </span>
                  <span className="whitespace-nowrap font-heading text-2xl font-bold text-white">
                    ${PRICING.crack}
                  </span>
                </li>
              </ul>
              <p className="mt-4 text-sm text-zinc-400">
                Chip pricing varies with travel distance — we come to you
                anywhere in Central Arkansas.
              </p>
              <div className="mt-6 rounded-lg border border-blue-600/30 bg-blue-600/10 p-4">
                <p className="text-sm text-zinc-200">
                  <span className="font-bold text-white">
                    Have comprehensive coverage?
                  </span>{" "}
                  Most repairs are <span className="font-bold">$0 out of pocket</span>{" "}
                  — insurance covers repair with no deductible, and we handle
                  the paperwork.
                </p>
              </div>
            </div>

            {/* Fleet */}
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-8">
              <div className="flex items-center gap-3">
                <Truck className="h-8 w-8 text-blue-600" />
                <h3 className="font-heading text-xl font-bold uppercase tracking-wider text-white">
                  Fleet &amp; Commercial
                </h3>
              </div>
              <p className="mt-6 text-zinc-300">
                Qualifying fleets get volume pricing that beats retail from the
                very first repair — starting at{" "}
                <span className="font-heading text-2xl font-bold text-white">
                  ${PRICING.fleetLadder[0]}
                </span>{" "}
                and dropping to as low as{" "}
                <span className="font-heading text-2xl font-bold text-white">
                  ${PRICING.fleetLadder[PRICING.fleetLadder.length - 1]}
                </span>{" "}
                per repair.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Volume discounts that grow with each repair per unit",
                  `Up to ${PRICING.fleetMaxRepairsPerUnit} repairs per windshield before we recommend replacement`,
                  "We come to your yard — zero vehicle downtime",
                  "Priority scheduling and one point of contact",
                ].map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-zinc-300"
                  >
                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                    {feature}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-zinc-400">
                Exact pricing depends on fleet size and location — tell us about
                your fleet and we&apos;ll put real numbers on it.
              </p>
              <div className="mt-6">
                <Button href="/contact?service=Fleet+%26+Commercial">
                  Get a Personalized Fleet Quote
                </Button>
              </div>
            </div>
          </div>

          {/* Repair-credit guarantee */}
          <div className="mt-6 rounded-lg border border-blue-600/40 bg-blue-600/5 p-8 text-center">
            <h3 className="font-heading text-xl font-bold uppercase tracking-wider text-white">
              You Never Lose What You Paid
            </h3>
            <p className="mx-auto mt-3 max-w-3xl text-zinc-300">
              Every repair is backed by our <strong>3-year warranty</strong>.
              And if your windshield ever ends up needing a full replacement
              anyway, we deduct <strong>every dollar you paid for the repair</strong>{" "}
              from the price of a new windshield through our replacement
              partner — a family-owned glass shop we know and trust. Trying
              repair first never costs you extra.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="mb-4 text-zinc-400">
            Not sure what your damage counts as? Text us a photo — we&apos;ll
            tell you the price before we ever book anything.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button href={BUSINESS.smsHref}>Text a Photo</Button>
            <Button href="/contact" variant="outline">
              Get a Free Quote
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
