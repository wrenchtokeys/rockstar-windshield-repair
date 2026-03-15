import { Phone, Mail, Clock, MapPin, Shield } from "lucide-react";
import { BUSINESS } from "@/lib/constants";

export default function ContactInfo() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading text-lg font-bold uppercase tracking-wider text-white">
          Get in Touch
        </h3>
        <div className="mt-1 h-1 w-12 bg-blue-600" />
      </div>

      <a
        href={BUSINESS.phoneHref}
        className="flex items-center gap-3 text-zinc-300 transition-colors hover:text-blue-600"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/10">
          <Phone className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <p className="text-xs text-zinc-500">Phone</p>
          <p className="font-semibold">{BUSINESS.phone}</p>
        </div>
      </a>

      <a
        href={`mailto:${BUSINESS.email}`}
        className="flex items-center gap-3 text-zinc-300 transition-colors hover:text-blue-600"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/10">
          <Mail className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <p className="text-xs text-zinc-500">Email</p>
          <p className="font-semibold">{BUSINESS.email}</p>
        </div>
      </a>

      <div className="flex items-center gap-3 text-zinc-300">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/10">
          <MapPin className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <p className="text-xs text-zinc-500">Service Area</p>
          <p className="font-semibold">
            {BUSINESS.address.city}, {BUSINESS.address.state} &amp; Surrounding Areas
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3 text-zinc-300">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600/10">
          <Clock className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <p className="text-xs text-zinc-500">Business Hours</p>
          <p className="font-semibold">{BUSINESS.hours.weekdays}</p>
          <p className="text-sm text-zinc-400">{BUSINESS.hours.saturday}</p>
          <p className="text-sm text-zinc-400">{BUSINESS.hours.sunday}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 text-zinc-300">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/10">
          <Shield className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <p className="text-xs text-zinc-500">Insurance</p>
          <p className="font-semibold">Fully Insured</p>
        </div>
      </div>
    </div>
  );
}
