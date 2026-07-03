import Link from "next/link";
import Hero from "@/components/home/Hero";
import ValueProps from "@/components/home/ValueProps";
import ServicesPreview from "@/components/home/ServicesPreview";
import CTABanner from "@/components/home/CTABanner";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";
import {
  getGoogleReviews,
  getGoogleRatingSummary,
} from "@/lib/google-reviews";
import { Star } from "lucide-react";

export default async function Home() {
  const [reviews, summary] = await Promise.all([
    getGoogleReviews(),
    getGoogleRatingSummary(),
  ]);
  const topReviews = reviews.slice(0, 4);

  return (
    <>
      <Hero />
      <ValueProps />
      <ServicesPreview />

      {/* Testimonials — only render real reviews */}
      {(topReviews.length > 0 || summary) && (
        <section className="bg-zinc-950 py-20">
          <div className="mx-auto max-w-7xl px-4">
            <SectionHeading subtitle="See what our customers have to say.">
              What People Are Saying
            </SectionHeading>

            {summary && (
              <div className="mb-10 flex items-center justify-center gap-3">
                <span className="text-2xl font-bold text-white">
                  {summary.rating.toFixed(1)}
                </span>
                <span className="flex gap-1">
                  {Array.from({ length: Math.round(summary.rating) }).map(
                    (_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-blue-600 text-blue-600"
                      />
                    )
                  )}
                </span>
                <Link
                  href="/reviews"
                  className="text-sm font-semibold text-blue-500 hover:text-blue-400"
                >
                  {summary.count} Google{" "}
                  {summary.count === 1 ? "review" : "reviews"} &rarr;
                </Link>
              </div>
            )}

            {topReviews.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {topReviews.map((review, i) => (
                  <Card key={i}>
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
                      <p className="text-sm font-semibold text-white">
                        {review.name}
                      </p>
                      <p className="text-xs text-zinc-400">{review.date}</p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <CTABanner />
    </>
  );
}
