import { Clock, Car, Shield, Award } from "lucide-react";
import Card from "@/components/ui/Card";

const props = [
  {
    icon: Clock,
    title: "Same-Day Service",
    description: "Most repairs completed the same day you call. We value your time.",
  },
  {
    icon: Car,
    title: "Mobile Service",
    description: "We come to your home, office, or wherever you are in the Little Rock area.",
  },
  {
    icon: Shield,
    title: "Fully Insured",
    description: "We're fully insured for your peace of mind on every job.",
  },
  {
    icon: Award,
    title: "3-Year Warranty",
    description: "Every repair backed by our 3-year warranty on workmanship.",
  },
];

export default function ValueProps() {
  return (
    <section className="bg-zinc-950 py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {props.map((prop) => (
            <Card key={prop.title} className="text-center">
              <prop.icon className="mx-auto h-10 w-10 text-blue-600" />
              <h3 className="mt-4 font-heading text-lg font-bold uppercase tracking-wider text-white">
                {prop.title}
              </h3>
              <p className="mt-2 text-sm text-zinc-400">{prop.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
