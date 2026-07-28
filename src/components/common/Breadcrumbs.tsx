import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { BUSINESS } from "@/lib/constants";

export interface Crumb {
  label: string;
  href: string;
}

// Renders a visible breadcrumb trail plus matching BreadcrumbList JSON-LD.
// Pass the trail WITHOUT the "Home" root — it's prepended automatically. The
// last crumb is treated as the current page (not linked).
export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const trail: Crumb[] = [{ label: "Home", href: "/" }, ...items];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.label,
      item: `https://${BUSINESS.domain}${crumb.href === "/" ? "" : crumb.href}`,
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className="mx-auto mb-8 max-w-7xl px-4">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-zinc-400">
        {trail.map((crumb, i) => {
          const isLast = i === trail.length - 1;
          return (
            <li key={crumb.href} className="flex items-center gap-1">
              {i > 0 && (
                <ChevronRight className="h-3.5 w-3.5 text-zinc-600" aria-hidden />
              )}
              {isLast ? (
                <span className="text-zinc-300" aria-current="page">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="transition-colors hover:text-blue-500"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </nav>
  );
}
