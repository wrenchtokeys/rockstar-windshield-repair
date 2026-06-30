import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { REVIEWS } from "@/lib/reviews-data";
import { BUSINESS } from "@/lib/constants";
import { Star } from "lucide-react";

export const metadata: Metadata = createMetadata(
  "Reviews",
  "Read reviews from Rockstar Windshield Repair customers in Little Rock, AR. Mobile windshield chip and crack repair across Central Arkansas.",
  "/reviews"
);

export default function ReviewsPage() {
  const hasReviews = REVIEWS.length > 0;
  const reviewLink = BUSINESS.googleReviewUrl;

  return (
    <div className="bg-zinc-950 py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading subtitle="Don't just take our word for it.">
          Customer Reviews
        </SectionHeading>

        {hasReviews ? (
          <div className="columns-1 gap-6 overflow-hidden sm:columns-2 lg:columns-3">
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
                      <p className="text-xs text-zinc-400">{review.service}</p>
                    </div>
                    <p className="text-xs text-zinc-400">{review.date}</p>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-2xl text-center">
            <Card>
              <p className="text-lg font-semibold text-white">
                Be one of our first reviews
              </p>
              <p className="mt-3 text-sm text-zinc-300">
                We&rsquo;re a local, owner-operated mobile windshield repair
                shop building our reputation one fixed windshield at a time. If
                we&rsquo;ve repaired your chip or crack, a quick review on
                Google means the world &mdash; and helps your neighbors find us.
              </p>
            </Card>
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="mb-4 text-zinc-400">
            {hasReviews
              ? "Love your experience? Leave us a review on Google!"
              : "Already had us out? We’d be grateful for your review."}
          </p>
          {reviewLink ? (
            <Button href={reviewLink} variant="primary">
              Leave a Google Review
            </Button>
          ) : (
            <Button href="/contact" variant="outline">
              Contact Us
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
