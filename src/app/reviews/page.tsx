import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { REVIEWS } from "@/lib/reviews-data";
import { Star } from "lucide-react";

export const metadata: Metadata = createMetadata(
  "Reviews",
  "Read reviews from satisfied Rockstar Windshield Repair customers in Little Rock, AR. 5-star rated mobile windshield service.",
  "/reviews"
);

export default function ReviewsPage() {
  return (
    <div className="bg-zinc-950 py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading subtitle="Don't just take our word for it.">
          Customer Reviews
        </SectionHeading>

        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
          {REVIEWS.map((review, i) => (
            <div key={i} className="mb-6 break-inside-avoid">
              <Card>
                <div className="flex gap-1">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <Star
                      key={j}
                      className="h-4 w-4 fill-blue-600 text-blue-600"
                    />
                  ))}
                </div>
                <p className="mt-3 text-sm text-zinc-300">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {review.name}
                    </p>
                    <p className="text-xs text-zinc-500">{review.service}</p>
                  </div>
                  <p className="text-xs text-zinc-500">{review.date}</p>
                </div>
              </Card>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="mb-4 text-zinc-400">
            Love your experience? Leave us a review on Google!
          </p>
          <Button href="/contact" variant="outline">
            Contact Us
          </Button>
        </div>
      </div>
    </div>
  );
}
