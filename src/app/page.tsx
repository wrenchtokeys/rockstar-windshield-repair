import Hero from "@/components/home/Hero";
import ValueProps from "@/components/home/ValueProps";
import ServicesPreview from "@/components/home/ServicesPreview";
import CTABanner from "@/components/home/CTABanner";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";
import { REVIEWS } from "@/lib/reviews-data";
import { Star } from "lucide-react";

export default function Home() {
  const topReviews = REVIEWS.slice(0, 4);

  return (
    <>
      <Hero />
      <ValueProps />
      <ServicesPreview />

      {/* Testimonials */}
      <section className="bg-zinc-950 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading subtitle="See what our customers have to say.">
            What People Are Saying
          </SectionHeading>

          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory">
            {topReviews.map((review, i) => (
              <Card
                key={i}
                className="min-w-[300px] flex-shrink-0 snap-start md:min-w-[350px]"
              >
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
                  <p className="text-xs text-zinc-500">{review.date}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
