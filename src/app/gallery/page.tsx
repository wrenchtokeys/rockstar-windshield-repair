import type { Metadata } from "next";
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
  { title: "Rock Chip — Before & After", tag: "Chip Repair" },
  { title: "Long Crack Repair", tag: "Crack Repair" },
  { title: "Bullseye Chip Fix", tag: "Chip Repair" },
  { title: "Fleet Vehicle Repair", tag: "Fleet" },
  { title: "Star Break Repair", tag: "Chip Repair" },
  { title: "Multi-Chip Windshield", tag: "Chip Repair" },
];

export default function GalleryPage() {
  return (
    <div className="bg-zinc-950 py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading subtitle="Real results from real repairs.">
          Our Work
        </SectionHeading>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {galleryItems.map((item, i) => (
            <Card key={i}>
              {/* Placeholder image area */}
              <div className="flex aspect-video items-center justify-center rounded bg-zinc-800">
                <span className="font-heading text-sm uppercase tracking-widest text-zinc-500">
                  Photo Coming Soon
                </span>
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
          <Button href="/contact">Get Your Free Quote</Button>
        </div>
      </div>
    </div>
  );
}
