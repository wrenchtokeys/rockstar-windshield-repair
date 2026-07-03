import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import {
  getGoogleReviews,
  getGoogleRatingSummary,
} from "@/lib/google-reviews";
import { BUSINESS } from "@/lib/constants";
import { Star } from "lucide-react";

export const metadata: Metadata = createMetadata(
  "Reviews",
  "Read reviews from Rockstar Windshield Repair customers in Little Rock, AR. Mobile windshield chip and crack repair across Central Arkansas.",
  "/reviews"
);

function StarRow({ rating, size = "h-4 w-4" }: { rating: number; size?: string }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: Math.round(rating) }).map((_, i) => (
        <Star key={i} className={`${size} fill-blue-600 text-blue-600`} />
      ))}
    </div>
  );
}

export default async function ReviewsPage() {
  const [reviews, summary] = await Promise.all([
    getGoogleReviews(),
    getGoogleRatingSummary(),
  ]);
  const hasReviews = reviews.length > 0;
  const reviewLink = BUSINESS.googleReviewUrl;
  const profileLink = BUSINESS.googleProfileUrl;

  return (
    <div className="bg-zinc-950 py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading subtitle="Don't just take our word for it.">
          Customer Reviews
        </SectionHeading>

        {/* Live Google rating summary — covers star-only ratings that have
            no text to show as a card below. */}
        {summary && (
          <div className="mx-auto mb-12 max-w-md">
            <Card className="text-center">
              <p className="text-5xl font-bold text-white">
                {summary.rating.toFixed(1)}
              </p>
              <div className="mt-3 flex justify-center">
                <StarRow rating={summary.rating} size="h-6 w-6" />
              </div>
              <p className="mt-3 text-sm text-zinc-400">
                Based on {summary.count} Google{" "}
                {summary.count === 1 ? "review" : "reviews"}
              </p>
              {profileLink && (
                <a
                  href={profileLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm font-semibold text-blue-500 hover:text-blue-400"
                >
                  See us on Google &rarr;
                </a>
              )}
            </Card>
          </div>
        )}

        {hasReviews ? (
          <div className="columns-1 gap-6 overflow-hidden sm:columns-2 lg:columns-3">
            {reviews.map((review, i) => (
              <div key={i} className="mb-6 break-inside-avoid">
                <Card>
                  <StarRow rating={review.rating} />
                  <p className="mt-3 text-sm text-zinc-300">
                    &ldquo;{review.text}&rdquo;
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm font-semibold text-white">
                      {review.name}
                    </p>
                    <p className="text-xs text-zinc-400">{review.date}</p>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          !summary && (
            <div className="mx-auto max-w-2xl text-center">
              <Card>
                <p className="text-lg font-semibold text-white">
                  Be one of our first reviews
                </p>
                <p className="mt-3 text-sm text-zinc-300">
                  We&rsquo;re a local, owner-operated mobile windshield repair
                  shop building our reputation one fixed windshield at a time.
                  If we&rsquo;ve repaired your chip or crack, a quick review on
                  Google means the world &mdash; and helps your neighbors find
                  us.
                </p>
              </Card>
            </div>
          )
        )}

        {/* Reviews shown here come from Google and cap at the 5 most
            relevant — always point at the full list. */}
        {hasReviews && profileLink && (
          <p className="mt-8 text-center">
            <a
              href={profileLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-blue-500 hover:text-blue-400"
            >
              Read all of our reviews on Google &rarr;
            </a>
          </p>
        )}

        <div className="mx-auto mt-16 max-w-2xl">
          <Card className="text-center">
            <p className="text-lg font-semibold text-white">
              Had us out to fix your windshield?
            </p>
            <p className="mt-3 text-sm text-zinc-300">
              A quick Google review takes about a minute and it&rsquo;s the
              single biggest way to help a small local business like ours. It
              also helps your neighbors find a repair they can trust.
            </p>
            <div className="mt-6">
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
          </Card>
        </div>
      </div>
    </div>
  );
}
