import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import { Target, Heart, Zap, Users, ShieldCheck, MapPin, Award, Wrench } from "lucide-react";

export const metadata: Metadata = createMetadata(
  "About Us",
  "Learn about Rockstar Windshield Repair — Little Rock's trusted mobile windshield repair service. Our story, mission, and commitment to quality.",
  "/about"
);

const trustSignals = [
  {
    icon: MapPin,
    title: "Local & Owner-Operated",
    description:
      "Rockstar is owned and run by Drake, a Central Arkansas local. When you call, you're talking to the person who fixes your windshield — not a call center.",
  },
  {
    icon: Wrench,
    title: "Repair-Only Specialists",
    description:
      "Windshield repair is all we do — chips, star breaks, and cracks up to 18 inches. Because we don't sell replacements, our repair recommendation is always the honest one.",
  },
  {
    icon: ShieldCheck,
    title: "Fully Insured",
    description:
      "We carry general liability insurance on every job. Never let anyone touch your windshield who can't show proof of coverage — with us, you're protected.",
  },
  {
    icon: Award,
    title: "3-Year Warranty",
    description:
      "Every repair is backed by a 3-year workmanship warranty. If a repaired chip or crack fails in that window, we fix it again at no charge.",
  },
];

const whyChooseUs = [
  {
    icon: Zap,
    title: "Fast Response",
    description:
      "We know a damaged windshield can't wait. That's why we offer same-day service and get to you as quickly as possible.",
  },
  {
    icon: Target,
    title: "Repair Specialists",
    description:
      "We specialize in windshield repair — chips, cracks, and star breaks. It's all we do, and we do it right.",
  },
  {
    icon: Heart,
    title: "Customer First",
    description:
      "Your satisfaction is our top priority. We treat every vehicle like it's our own and every customer like family.",
  },
  {
    icon: Users,
    title: "Public & Fleet",
    description:
      "We serve everyday drivers and commercial fleets alike with the same professional, reliable service.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-zinc-950 py-20">
      <Breadcrumbs items={[{ label: "About", href: "/about" }]} />
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          as="h1"
          subtitle="Your local windshield repair specialists."
        >
          About Rockstar Windshield Repair
        </SectionHeading>

        <div className="mx-auto max-w-3xl space-y-6 text-zinc-300">
          <p>
            Rockstar Windshield Repair was founded with a simple mission: to
            provide fast, honest, and professional windshield repair services
            to the people of Little Rock, Arkansas. We&apos;re a local,
            owner-operated shop — founded and run by Drake, who personally
            handles the repairs and stands behind every one.
          </p>
          <p>
            We specialize in windshield repair — chips, cracks, star breaks,
            and bullseye damage — using professional resin-injection techniques
            that restore the strength and clarity of your original factory
            glass. Whether you&apos;re an everyday driver or managing a
            commercial fleet, we deliver the same expert-level service. Our
            mobile units come to you, whether you&apos;re at home, at work, or
            anywhere else across Central Arkansas.
          </p>
          <p>
            We&apos;re fully insured with general liability coverage, and we
            work directly with insurance companies so that most repairs cost
            you nothing out of pocket. Every job is backed by our 3-year
            warranty on workmanship — because we stand behind our work, period.
          </p>
        </div>

        {/* E-E-A-T: experience, specialization, insurance, and warranty
            spelled out so both customers and search engines can see the
            trust signals behind the business. */}
        <div className="mt-16">
          <SectionHeading subtitle="The credentials and commitments behind every repair.">
            Why You Can Trust Us
          </SectionHeading>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {trustSignals.map((item) => (
              <Card key={item.title} className="text-center">
                <item.icon className="mx-auto h-10 w-10 text-blue-600" />
                <h3 className="mt-4 font-heading text-lg font-bold uppercase tracking-wider text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-400">
                  {item.description}
                </p>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-20">
          <SectionHeading subtitle="Here's what sets us apart from the rest.">
            Why Choose Us
          </SectionHeading>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyChooseUs.map((item) => (
              <Card key={item.title} className="text-center">
                <item.icon className="mx-auto h-10 w-10 text-blue-600" />
                <h3 className="mt-4 font-heading text-lg font-bold uppercase tracking-wider text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-400">
                  {item.description}
                </p>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <Button href="/contact">Contact Us Today</Button>
        </div>
      </div>
    </div>
  );
}
