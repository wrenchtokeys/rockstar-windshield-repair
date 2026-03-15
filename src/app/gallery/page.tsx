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
    title: "Star Break Repair",
    description:
      "Classic star break pattern from highway debris. Multiple fracture lines radiating from the impact point. Resin filled each leg of the break — now barely visible.",
    tag: "Chip Repair",
    before: "/images/gallery/before-2.jpeg",
    after: "/images/gallery/after-2.jpeg",
  },
  {
    title: "Bullseye Impact Fix",
    description:
      "A direct bullseye impact with a clean circular break. One of the most common types of windshield damage. Repaired on-site at the customer's workplace in under 30 minutes.",
    tag: "Chip Repair",
    before: "/images/gallery/before-3.jpeg",
    after: "/images/gallery/after-3.jpeg",
  },
  {
    title: "Crack & Chip Repair",
    description:
      "Combination damage — a chip with a short crack starting to form. Caught early before it could spread across the windshield. Full repair saved hundreds over a replacement.",
    tag: "Crack Repair",
    before: "/images/gallery/before-4.jpeg",
    after: "/images/gallery/after-4.jpeg",
  },
  {
    title: "Stone Break Repair",
    description:
      "Small stone break near the windshield edge — the most critical spot for crack spreading. Repaired quickly to prevent further damage to the structural integrity.",
    tag: "Chip Repair",
    before: "/images/gallery/before-5.jpeg",
    after: "/images/gallery/after-5.jpeg",
  },
  {
    title: "Star Break — Fleet Vehicle",
    description:
      "Fleet truck windshield with a star break pattern. Mobile service — we came to the fleet yard and repaired it between routes. Zero downtime for the driver.",
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
            Every repair backed by our lifetime warranty on workmanship.
          </p>
          <Button href="/contact">Get Your Free Quote</Button>
        </div>
      </div>
    </div>
  );
}
