import type { Metadata } from "next";
import Image from "next/image";
import { createMetadata } from "@/lib/metadata";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";

export const metadata: Metadata = createMetadata(
  "Gallery",
  "See before and after photos of our windshield repair work in Little Rock, AR.",
  "/gallery"
);

const galleryItems = [
  {
    title: "Half-Moon Chip Repair",
    description:
      "A deep half-moon chip on the driver side — left untreated, this would have spread into a full crack within days. Sealed with resin injection, structural integrity fully restored.",
    tag: "Chip Repair",
    before: "/images/gallery/before-1.jpeg",
    after: "/images/gallery/after-1.jpeg",
  },
  {
    title: "Combination Break Repair",
    description:
      "A sharp impact already throwing cracks in two directions — right in the driver's field of view, hard to ignore. Filled and cured on-site, no spreading, no replacement needed.",
    tag: "Chip Repair",
    before: "/images/gallery/before-2.jpeg",
    after: "/images/gallery/after-2.jpeg",
  },
  {
    title: "Star Break Repair",
    description:
      "A central impact with cracks radiating in every direction — the kind of break that spreads fast if left alone. Repaired on-site at the customer's workplace in under 30 minutes.",
    tag: "Chip Repair",
    before: "/images/gallery/before-3.jpeg",
    after: "/images/gallery/after-3.jpeg",
  },
  {
    title: "Double Chip & Crack Repair",
    description:
      "Two impact points with a crack running between them — left alone, this windshield was headed for a full replacement. Both chips filled and the crack sealed in a single visit.",
    tag: "Crack Repair",
    before: "/images/gallery/before-4.jpeg",
    after: "/images/gallery/after-4.jpeg",
  },
  {
    title: "Severe Star Break Repair",
    description:
      "A severe star break on a fleet truck windshield. Mobile service — we came to the fleet yard and repaired it between routes. Zero downtime for the driver.",
    tag: "Fleet",
    before: "/images/gallery/before-6.jpeg",
    after: "/images/gallery/after-6.jpeg",
  },
];

export default function GalleryPage() {
  return (
    <div className="bg-zinc-950 py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading subtitle="Real results from real repairs.">
          Our Work
        </SectionHeading>

        <div className="space-y-10">
          {galleryItems.map((item, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900"
            >
              {/* Side-by-side photos */}
              <div className="grid grid-cols-2">
                <div className="relative">
                  <span className="absolute left-3 top-3 z-10 rounded-full bg-red-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-lg">
                    Before
                  </span>
                  <Image
                    src={item.before}
                    alt={`${item.title} — before repair`}
                    width={800}
                    height={600}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-3 z-10 rounded-full bg-green-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-lg">
                    After
                  </span>
                  <Image
                    src={item.after}
                    alt={`${item.title} — after repair`}
                    width={800}
                    height={600}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              {/* Card info */}
              <div className="px-6 py-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-lg font-bold uppercase tracking-wider text-white">
                    {item.title}
                  </h3>
                  <span className="rounded-full bg-blue-600/10 px-3 py-1 text-xs font-semibold text-blue-400">
                    {item.tag}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="mb-6 text-zinc-400">
            Every repair backed by our 3-year warranty on workmanship.
          </p>
          <Button href="/contact">Get Your Free Quote</Button>
        </div>
      </div>
    </div>
  );
}
