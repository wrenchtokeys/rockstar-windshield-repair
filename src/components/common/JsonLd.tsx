import { BUSINESS } from "@/lib/constants";

export default function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: BUSINESS.name,
    description:
      "Professional mobile windshield repair in Little Rock, AR. Same-day service, insurance claims assistance, fleet services, and lifetime warranty. Fully insured.",
    telephone: BUSINESS.phone,
    email: BUSINESS.email,
    url: `https://${BUSINESS.domain}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: BUSINESS.address.city,
      addressRegion: BUSINESS.address.state,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 34.7465,
      longitude: -92.2896,
    },
    areaServed: {
      "@type": "State",
      name: BUSINESS.address.stateFullName,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "07:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "08:00",
        closes: "16:00",
      },
    ],
    priceRange: "$$",
    image: `https://${BUSINESS.domain}/images/logo.png`,
    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
