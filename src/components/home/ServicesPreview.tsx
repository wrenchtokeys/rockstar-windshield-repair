import Card from "@/components/ui/Card";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { SERVICES } from "@/lib/services-data";

export default function ServicesPreview() {
  const topServices = SERVICES.slice(0, 3);

  return (
    <section className="bg-zinc-900 py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading subtitle="Expert windshield repair for everyday drivers and commercial fleets alike.">
          Our Services
        </SectionHeading>

        <div className="grid gap-6 md:grid-cols-3">
          {topServices.map((service) => (
            <Card key={service.slug}>
              <service.icon className="h-8 w-8 text-blue-600" />
              <h3 className="mt-4 font-heading text-lg font-bold uppercase tracking-wider text-white">
                {service.title}
              </h3>
              <p className="mt-2 text-sm text-zinc-400">
                {service.description}
              </p>
            </Card>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button href="/services" variant="outline">
            View All Services
          </Button>
        </div>
      </div>
    </section>
  );
}
