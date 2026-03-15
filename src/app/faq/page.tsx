import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";

export const metadata: Metadata = createMetadata(
  "FAQ",
  "Common questions about windshield repair in Little Rock, AR. Insurance coverage, repair time, crack limits, mobile service, and more.",
  "/faq"
);

const faqs = [
  {
    question: "Does insurance cover windshield repair?",
    answer:
      "Yes — most auto insurance policies cover windshield repair with zero deductible. Arkansas law requires insurance companies to cover windshield repair without affecting your premium. We handle all the insurance paperwork for you, so in most cases you pay absolutely nothing out of pocket.",
  },
  {
    question: "How long does a windshield repair take?",
    answer:
      "Most chip and crack repairs take 15 to 30 minutes. The resin needs about 10 minutes to cure after injection. Since we come to you, there's no driving to a shop, no waiting room, and no wasted time. You can go right back to what you were doing.",
  },
  {
    question: "Can you fix a long crack in my windshield?",
    answer:
      "We can repair cracks up to 12 inches long using advanced resin injection. If the crack is longer, in your direct line of sight, or at the edge of the windshield where structural integrity is a concern, we'll honestly tell you and recommend a full replacement. We'd rather do the right thing than take your money for a repair that won't hold.",
  },
  {
    question: "Do you come to my location?",
    answer:
      "Yes — we're 100% mobile. We come to your home, office, parking lot, fleet yard, or wherever your vehicle is in the Little Rock metro area and Central Arkansas. Our mobile unit has everything we need to do the repair on-site. No towing, no extra trips.",
  },
  {
    question: "What areas do you serve?",
    answer:
      "We serve Little Rock, North Little Rock, Conway, Benton, Bryant, Jacksonville, Cabot, Sherwood, Maumelle, Hot Springs, and all surrounding Central Arkansas communities. If you're within about an hour of Little Rock, give us a call — we probably cover your area.",
  },
  {
    question: "How much does windshield repair cost?",
    answer:
      "Most single-chip repairs cost between $50 and $100. Longer cracks cost more depending on length. But here's the thing: if you have comprehensive insurance, your repair is almost always covered at zero cost to you. We'll check your coverage before we start so there are no surprises.",
  },
  {
    question: "Should I repair or replace my windshield?",
    answer:
      "Repair is always better if the damage qualifies — it's faster, cheaper, and keeps your original factory seal intact. Chips and cracks under 12 inches can usually be repaired. If the damage is too large, too deep, or in a critical area, we'll tell you straight and recommend replacement. We never push unnecessary services.",
  },
  {
    question: "Will the repair be visible?",
    answer:
      "With modern resin technology, most repairs are nearly invisible once cured. You might see a faint mark if you look closely, but it won't obstruct your view. The goal is to restore structural integrity and stop the damage from spreading. Cosmetically, most customers are surprised how clean the repair looks.",
  },
  {
    question: "Can I drive right after the repair?",
    answer:
      "Yes — you can drive immediately after the repair is complete. The resin cures during the repair process, so your windshield is ready to go when we're done. We do recommend avoiding car washes for 24 hours and keeping the repair area dry if possible.",
  },
  {
    question: "Do you work on fleet vehicles and commercial trucks?",
    answer:
      "Absolutely. We work with several fleet companies in Central Arkansas. We offer volume pricing, priority scheduling, and can service multiple vehicles in one visit at your yard or facility. Fleet managers love us because there's zero vehicle downtime — we come to you and repairs take under 30 minutes per vehicle.",
  },
  {
    question: "What if my chip spreads into a crack before I can get it repaired?",
    answer:
      "Call us as soon as possible. Temperature changes, rough roads, and even closing your car door can cause a chip to spread. The sooner we repair it, the better the result. A $60 chip repair today can save you a $300+ windshield replacement next week. Don't wait.",
  },
  {
    question: "Is Rockstar Windshield Repair insured?",
    answer:
      "Yes — we are fully insured and bonded. Every repair is backed by our lifetime warranty on workmanship. If a repaired chip or crack ever fails, we'll re-repair or replace it at no charge.",
  },
];

export default function FAQPage() {
  return (
    <div className="bg-zinc-950 py-20">
      <div className="mx-auto max-w-3xl px-4">
        <SectionHeading subtitle="Everything you need to know about windshield repair.">
          Frequently Asked Questions
        </SectionHeading>

        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl border border-zinc-800 bg-zinc-900 p-6"
            >
              <h3 className="font-heading text-lg font-bold text-white">
                {faq.question}
              </h3>
              <p className="mt-3 leading-relaxed text-zinc-300">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="mb-4 text-zinc-400">
            Have a question we didn&apos;t cover?
          </p>
          <Button href="/contact">Ask Us Directly</Button>
        </div>
      </div>
    </div>
  );
}
