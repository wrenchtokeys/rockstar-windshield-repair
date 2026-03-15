import type { Metadata } from "next";
import Image from "next/image";
import { createMetadata } from "@/lib/metadata";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export const metadata: Metadata = createMetadata(
  "Gallery",
  "See before and after photos of our windshield repair work in Little Rock, AR.",
  "/gallery"
);

const galleryItems = [
  {
    title: "Half-Moon Chip Repair",
    tag: "Chip Repair",
    before: "/images/gallery/before-1.jpeg",
    after: "/images/gallery/after-1.jpeg",
  },
  {
    title: "Star Break Repair",
    tag: "Chip Repair",
    before: "/images/gallery/before-2.jpeg",
    after: "/images/gallery/after-2.jpeg",
  },
  {
    title: "Bullseye Impact Fix",
    tag: "Chip Repair",
    before: "/images/gallery/before-3.jpeg",
    after: "/images/gallery/after-3.jpeg",
  },
  {
    title: "Crack & Chip Repair",
    tag: "Crack Repair",
    before: "/images/gallery/before-4.jpeg",
    after: "/images/gallery/after-4.jpeg",
  },
  {
    title: "Stone Break Repair",
    tag: "Chip Repair",
    before: "/images/gallery/before-5.jpeg",
    after: "/images/gallery/after-5.jpeg",
  },
  {
    title: "Star Break Repair",
    tag: "Chip Repair",
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

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {galleryItems.map((item, i) => (
            <Card key={i}>
              <div className="space-y-3">
                <div className="relative">
                  <span className="absolute left-2 top-2 z-10 rounded bg-red-600 px-2 py-0.5 text-xs font-bold uppercase text-white">
                    Before
                  </span>
                  <Image
                    src={item.before}
                    alt={`${item.title} — before repair`}
                    width={800}
                    height={600}
                    className="w-full rounded object-cover"
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-2 top-2 z-10 rounded bg-green-600 px-2 py-0.5 text-xs font-bold uppercase text-white">
                    After
                  </span>
                  <Image
                    src={item.after}
                    alt={`${item.title} — after repair`}
                    width={800}
                    height={600}
                    className="w-full rounded object-cover"
                  />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-white">
                  {item.title}
                </h3>
                <span className="rounded bg-blue-600/10 px-2 py-1 text-xs font-semibold text-blue-600">
                  {item.tag}
                </span>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="mb-6 text-zinc-400">
            Every repair backed by our lifetime warranty on workmanship.
          </p>
          <Button href="/contact">Get Your Free Quote</Button>
        </div>
      </div>
    </div>
  );
}
