import { BUSINESS, SERVICE_CITIES } from "@/lib/constants";

export default function JsonLd() {
  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    "@id": `https://${BUSINESS.domain}/#business`,
    name: BUSINESS.name,
    description:
      "Professional mobile windshield chip and crack repair in Little Rock, AR and Central Arkansas. Same-day service, insurance approved, lifetime warranty. We come to you.",
    telephone: BUSINESS.phone,
    email: BUSINESS.email,
    url: `https://${BUSINESS.domain}`,
    logo: `https://${BUSINESS.domain}/images/logo.png`,
    image: `https://${BUSINESS.domain}/images/logo.png`,
    address: {
      "@type": "PostalAddress",
      addressLocality: BUSINESS.address.city,
      addressRegion: BUSINESS.address.state,
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 34.7465,
      longitude: -92.2896,
    },
    areaServed: SERVICE_CITIES.map((city) => ({
      "@type": "City",
      name: `${city.name}, AR`,
    })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Windshield Repair Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Chip & Stone Break Repair",
            description:
              "Professional repair of chips, star breaks, and bullseye damage using resin injection.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Crack Repair",
            description:
              "Repair of windshield cracks up to 12 inches using advanced resin technology.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Mobile Windshield Service",
            description:
              "We come to your home, office, or fleet yard anywhere in Central Arkansas.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Fleet & Commercial Service",
            description:
              "Volume pricing and priority scheduling for fleet vehicles and commercial accounts.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Insurance Claims Assistance",
            description:
              "We handle the insurance paperwork. Most repairs covered with zero out-of-pocket cost.",
          },
        },
      ],
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
    paymentAccepted: "Cash, Credit Card, Insurance",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      reviewCount: "47",
      bestRating: "5",
      worstRating: "1",
    },
    sameAs: [],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Does insurance cover windshield repair?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! Most insurance policies cover windshield repair with zero deductible. We handle all the insurance paperwork for you. In most cases, you pay nothing out of pocket.",
        },
      },
      {
        "@type": "Question",
        name: "How long does a windshield repair take?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most windshield chip and crack repairs take 15-30 minutes. We come to your location, so there's no wait time at a shop.",
        },
      },
      {
        "@type": "Question",
        name: "Can you fix a long crack in my windshield?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We can repair cracks up to 12 inches long. If the crack is longer or in the driver's direct line of sight, we'll recommend a full replacement and can refer you to a trusted partner.",
        },
      },
      {
        "@type": "Question",
        name: "Do you come to my location?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! We're a fully mobile service. We come to your home, office, or wherever you are in the Little Rock, AR metro area and Central Arkansas.",
        },
      },
      {
        "@type": "Question",
        name: "What areas do you serve?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We serve Little Rock, North Little Rock, Conway, Benton, Bryant, Jacksonville, Cabot, Sherwood, Maumelle, Hot Springs, and surrounding Central Arkansas communities.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
