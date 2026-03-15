import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Target, Heart, Zap, Users } from "lucide-react";

export const metadata: Metadata = createMetadata(
  "About Us",
  "Learn about Rockstar Windshield Repair — Little Rock's trusted mobile windshield repair service. Our story, mission, and commitment to quality.",
  "/about"
);

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
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading subtitle="Your local windshield repair specialists.">
          About Rockstar Windshield Repair
        </SectionHeading>

        <div className="mx-auto max-w-3xl space-y-6 text-zinc-300">
          <p>
            Rockstar Windshield Repair was founded with a simple mission: to
            provide fast, honest, and professional windshield repair services
            to the people of Little Rock, Arkansas.
          </p>
          <p>
            We specialize in windshield repair — chips, cracks, star breaks,
            and bullseye damage. Whether you&apos;re an everyday driver or
            managing a commercial fleet, we deliver the same expert-level
            service. Our mobile units come to you, whether you&apos;re at
            home, at work, or anywhere else in the Little Rock area.
          </p>
          <p>
            We&apos;re fully insured, and we
            work directly with insurance companies so that most repairs cost
            you nothing out of pocket. Every job is backed by our 3-year
            warranty on workmanship — because we stand behind our work, period.
          </p>
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
