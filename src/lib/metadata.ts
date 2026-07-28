import type { Metadata } from "next";
import { BUSINESS } from "./constants";

interface MetadataOptions {
  // Use "article" for blog posts so the Open Graph type is correct.
  type?: "website" | "article";
  // Absolute or root-relative image path. Defaults to the logo.
  image?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

export function createMetadata(
  title: string,
  description: string,
  path: string = "",
  options: MetadataOptions = {}
): Metadata {
  const { type = "website", image, publishedTime, modifiedTime } = options;
  const url = `https://${BUSINESS.domain}${path}`;
  const fullTitle = `${title} | ${BUSINESS.name}`;
  const imageUrl = image
    ? image.startsWith("http")
      ? image
      : `https://${BUSINESS.domain}${image}`
    : `https://${BUSINESS.domain}/images/logo.png`;

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
      type,
      ...(type === "article" && (publishedTime || modifiedTime)
        ? {
            publishedTime,
            modifiedTime: modifiedTime || publishedTime,
          }
        : {}),
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
