import { CircleDot, Scaling, Car, Shield, Building2, Sparkles } from "lucide-react";

export interface ServiceItem {
  title: string;
  slug: string;
  description: string;
  icon: typeof CircleDot;
  features: string[];
}

export const SERVICES: ServiceItem[] = [
  {
    title: "Chip & Stone Break Repair",
    slug: "chip-repair",
    description:
      "Chips, star breaks, bullseye damage, and small dings — we fix them all quickly before they spread. Our resin injection process restores structural integrity and clarity.",
    icon: CircleDot,
    features: [
      "$65–$85 depending on travel distance",
      "Often $0 with comprehensive insurance",
      "30-minute average repair time",
      "Star breaks, bullseye & chip repair",
    ],
  },
  {
    title: "Crack Repair",
    slug: "crack-repair",
    description:
      "Cracks from 4 to 18 inches can often be repaired without full replacement. We use advanced resin technology to seal and strengthen the damaged area.",
    icon: Scaling,
    features: [
      "$125 flat for cracks 4–18 inches",
      "Advanced resin technology",
      "Prevents further spreading",
      "Saves you money vs. replacement",
    ],
  },
  {
    title: "Fleet & Commercial",
    slug: "fleet-commercial",
    description:
      "Keep your fleet on the road with priority scheduling, volume pricing, and dedicated account management for businesses of all sizes.",
    icon: Building2,
    features: [
      "Volume pricing from $50 down to $25 per repair",
      "Priority scheduling",
      "Dedicated account management",
      "Minimal vehicle downtime",
    ],
  },
  {
    title: "Mobile Service",
    slug: "mobile-service",
    description:
      "We come to you — home, office, or wherever you are in the Little Rock area. Our fully equipped mobile units handle repairs on-site for maximum convenience.",
    icon: Car,
    features: [
      "We come to your location",
      "Home, office, or on-the-go",
      "Fully equipped mobile units",
      "Same-day availability",
    ],
  },
  {
    title: "Insurance Claims",
    slug: "insurance-claims",
    description:
      "We work directly with your insurance company to make the process hassle-free. Most windshield repairs are covered with zero out-of-pocket cost.",
    icon: Shield,
    features: [
      "Direct insurance billing",
      "Zero out-of-pocket for most repairs",
      "We handle all paperwork",
      "All major insurers accepted",
    ],
  },
  {
    title: "Windshield Assessment",
    slug: "windshield-assessment",
    description:
      "Not sure if your windshield damage can be repaired? We provide free assessments to evaluate the damage and recommend the best course of action.",
    icon: Sparkles,
    features: [
      "Free damage evaluation",
      "Honest repair recommendations",
      "No-obligation quotes",
      "Same-day assessment available",
    ],
  },
];
