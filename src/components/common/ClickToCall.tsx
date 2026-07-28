import { Phone, MessageSquare } from "lucide-react";
import { BUSINESS } from "@/lib/constants";

export default function ClickToCall() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 grid grid-cols-2 md:hidden">
      <a
        href={BUSINESS.phoneHref}
        className="flex items-center justify-center gap-2 bg-blue-600 py-3 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-blue-500"
      >
        <Phone className="h-4 w-4" />
        Call Now
      </a>
      <a
        href={BUSINESS.smsHref}
        className="flex items-center justify-center gap-2 border-l border-blue-500 bg-blue-700 py-3 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-blue-600"
      >
        <MessageSquare className="h-4 w-4" />
        Text a Photo
      </a>
    </div>
  );
}
