import { Wrench, ShieldCheck, BadgeCheck } from "lucide-react";
import Button from "@/components/ui/Button";

const points = [
  {
    icon: Wrench,
    title: "Repair Is All We Do",
    description:
      "No replacement upsells, no glass inventory to move. Our only job is saving the windshield you already have — including original glass on classic cars that can't simply be reordered.",
  },
  {
    icon: ShieldCheck,
    title: "Honest Assessments",
    description:
      "If damage truly can't be repaired, we'll tell you straight and refer you to a family-owned glass shop we know and trust for the replacement.",
  },
  {
    icon: BadgeCheck,
    title: "You Never Lose What You Paid",
    description:
      "Every repair carries a 3-year warranty — and if your windshield ever needs replacing anyway, what you paid for the repair comes off the new glass through our partner shop.",
  },
];

export default function RepairOnly() {
  return (
    <section className="bg-zinc-950 py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-3xl font-bold uppercase tracking-wider text-white md:text-4xl">
            We Don&apos;t Sell <span className="text-blue-600">Windshields</span>
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            Glass shops earn several times more replacing your windshield than
            repairing it — guess which one they&apos;ll recommend. We&apos;re
            repair-only specialists: if your glass can be saved, we save it.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {points.map((point) => (
            <div
              key={point.title}
              className="rounded-lg border border-zinc-800 bg-zinc-900 p-6 text-center"
            >
              <point.icon className="mx-auto h-10 w-10 text-blue-600" />
              <h3 className="mt-4 font-heading text-lg font-bold uppercase tracking-wider text-white">
                {point.title}
              </h3>
              <p className="mt-2 text-sm text-zinc-400">{point.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button href="/gallery" variant="outline">
            See Real Before &amp; After Repairs
          </Button>
        </div>
      </div>
    </section>
  );
}
