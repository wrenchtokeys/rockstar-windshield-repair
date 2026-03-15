import type { Metadata } from "next";
import { BUSINESS } from "./constants";

export function createMetadata(
  title: string,
  description: string,
  path: string = ""
): Metadata {
  const url = `https://${BUSINESS.domain}${path}`;
  const fullTitle = `${title} | ${BUSINESS.name}`;
  const imageUrl = `https://${BUSINESS.domain}/images/logo.png`;

  return {
    title,
    description,
    keywords: [
      "windshield repair",
      "windshield chip repair",
      "windshield crack repair",
      "mobile windshield repair",
      "auto glass repair",
      "Little Rock AR",
      "Central Arkansas",
      "same day windshield repair",
      "insurance windshield repair",
      "fleet windshield service",
    ],
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: BUSINESS.name,
      locale: "en_US",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: BUSINESS.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: url,
    },
  };
}
