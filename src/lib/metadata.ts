import type { Metadata } from "next";
import { BUSINESS } from "./constants";

export function createMetadata(
  title: string,
  description: string,
  path: string = ""
): Metadata {
  const url = `https://${BUSINESS.domain}${path}`;
  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${BUSINESS.name}`,
      description,
      url,
      siteName: BUSINESS.name,
      locale: "en_US",
      type: "website",
    },
    alternates: {
      canonical: url,
    },
  };
}
