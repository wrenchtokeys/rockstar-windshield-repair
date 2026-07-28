interface SectionHeadingProps {
  children: React.ReactNode;
  subtitle?: string;
  centered?: boolean;
  // Controls the heading level rendered. Every page should have exactly one
  // H1, so the top-most heading on a page passes as="h1"; section headings
  // further down keep the default "h2".
  as?: "h1" | "h2";
}

export default function SectionHeading({
  children,
  subtitle,
  centered = true,
  as: Tag = "h2",
}: SectionHeadingProps) {
  return (
    <div className={`mb-12 ${centered ? "text-center" : ""}`}>
      <Tag className="font-heading text-3xl font-bold uppercase tracking-wider text-white md:text-4xl">
        {children}
      </Tag>
      <div
        className={`mt-4 h-1 w-16 bg-blue-600 ${centered ? "mx-auto" : ""}`}
      />
      {subtitle && (
        <p className="mt-4 text-lg text-zinc-400">{subtitle}</p>
      )}
    </div>
  );
}
