import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createMetadata } from "@/lib/metadata";
import { POSTS, getPost, type Block } from "@/lib/blog-data";
import { BUSINESS } from "@/lib/constants";
import Button from "@/components/ui/Button";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import { CalendarDays } from "lucide-react";

export function generateStaticParams() {
  return POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return createMetadata(post.title, post.description, `/blog/${slug}`, {
    type: "article",
    publishedTime: post.published,
    modifiedTime: post.updated,
  });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function renderBlock(block: Block, i: number) {
  switch (block.type) {
    case "h2":
      return (
        <h2
          key={i}
          className="mt-10 font-heading text-2xl font-bold uppercase tracking-wider text-white"
        >
          {block.text}
        </h2>
      );
    case "p":
      return (
        <p key={i} className="mt-5 leading-relaxed text-zinc-300">
          {block.text}
        </p>
      );
    case "ul":
      return (
        <ul key={i} className="mt-5 space-y-2 pl-1">
          {block.items.map((item, j) => (
            <li key={j} className="flex gap-3 text-zinc-300">
              <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600" />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      );
    case "callout":
      return (
        <div
          key={i}
          className="mt-8 rounded-lg border border-blue-600/30 bg-blue-600/10 p-6"
        >
          <p className="text-zinc-200">{block.text}</p>
          <div className="mt-4">
            <Button href={block.cta.href} variant="primary">
              {block.cta.label}
            </Button>
          </div>
        </div>
      );
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = POSTS.filter((p) => p.slug !== post.slug).slice(0, 2);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.published,
    dateModified: post.updated,
    image: `https://${BUSINESS.domain}/images/logo.png`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://${BUSINESS.domain}/blog/${post.slug}`,
    },
    author: {
      "@type": "Organization",
      name: BUSINESS.name,
      url: `https://${BUSINESS.domain}`,
    },
    publisher: {
      "@type": "Organization",
      name: BUSINESS.name,
      logo: {
        "@type": "ImageObject",
        url: `https://${BUSINESS.domain}/images/logo.png`,
      },
    },
  };

  return (
    <div className="bg-zinc-950 py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Breadcrumbs
        items={[
          { label: "Blog", href: "/blog" },
          { label: post.title, href: `/blog/${post.slug}` },
        ]}
      />

      <article className="mx-auto max-w-3xl px-4">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <CalendarDays className="h-3.5 w-3.5" />
          <time dateTime={post.published}>{formatDate(post.published)}</time>
          <span aria-hidden>&middot;</span>
          <span>{post.readingTime}</span>
        </div>
        <h1 className="mt-3 font-heading text-3xl font-bold uppercase leading-tight tracking-wider text-white md:text-4xl">
          {post.title}
        </h1>
        <div className="mt-5 h-1 w-16 bg-blue-600" />

        <div className="mt-8">{post.body.map(renderBlock)}</div>

        {/* Standard closing CTA — every post ends with a way to request service */}
        <div className="mt-12 rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-center">
          <p className="font-heading text-xl font-bold uppercase tracking-wider text-white">
            Chip or crack? We come to you.
          </p>
          <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-400">
            Mobile windshield repair across Little Rock and Central Arkansas.
            Same-day service, 3-year warranty, and most repairs are $0 with
            insurance.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button href="/contact">Request Service</Button>
            <Button href="/services" variant="outline">
              See Services &amp; Pricing
            </Button>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <aside className="mx-auto mt-16 max-w-3xl px-4">
          <h2 className="font-heading text-lg font-bold uppercase tracking-wider text-white">
            Keep Reading
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/blog/${r.slug}`}
                className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 transition-colors hover:border-blue-600/50"
              >
                <h3 className="font-heading text-base font-bold uppercase tracking-wide text-white">
                  {r.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-400">{r.excerpt}</p>
              </Link>
            ))}
          </div>
        </aside>
      )}
    </div>
  );
}
