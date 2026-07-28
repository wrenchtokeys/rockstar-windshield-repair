import type { Metadata } from "next";
import Link from "next/link";
import { createMetadata } from "@/lib/metadata";
import { POSTS } from "@/lib/blog-data";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import { ArrowRight, CalendarDays } from "lucide-react";

export const metadata: Metadata = createMetadata(
  "Windshield Repair Tips & Guides",
  "Practical windshield repair advice from a local Central Arkansas shop — insurance coverage, repair vs. replacement, mobile service, and more.",
  "/blog"
);

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function BlogIndexPage() {
  const posts = [...POSTS].sort((a, b) => b.published.localeCompare(a.published));

  return (
    <div className="bg-zinc-950 py-20">
      <Breadcrumbs items={[{ label: "Blog", href: "/blog" }]} />
      <div className="mx-auto max-w-4xl px-4">
        <SectionHeading
          as="h1"
          subtitle="Straight-talk windshield advice from a local Central Arkansas shop."
        >
          Windshield Repair Tips &amp; Guides
        </SectionHeading>

        <div className="space-y-6">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition-colors hover:border-blue-600/50"
            >
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <CalendarDays className="h-3.5 w-3.5" />
                <time dateTime={post.published}>{formatDate(post.published)}</time>
                <span aria-hidden>&middot;</span>
                <span>{post.readingTime}</span>
              </div>
              <h2 className="mt-3 font-heading text-xl font-bold uppercase tracking-wider text-white md:text-2xl">
                <Link
                  href={`/blog/${post.slug}`}
                  className="transition-colors hover:text-blue-500"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                {post.excerpt}
              </p>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-500 transition-colors hover:text-blue-400"
              >
                Read more <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="mb-4 text-zinc-400">
            Got a chip or crack right now? Skip the reading — we&apos;ll come to
            you.
          </p>
          <Button href="/contact">Request Service</Button>
        </div>
      </div>
    </div>
  );
}
