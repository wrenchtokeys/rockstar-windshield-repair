import type { MetadataRoute } from "next";
import { BUSINESS } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/queue", "/api/"],
    },
    sitemap: `https://${BUSINESS.domain}/sitemap.xml`,
  };
}
