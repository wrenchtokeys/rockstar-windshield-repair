interface SectionHeadingProps {
  children: React.ReactNode;
  subtitle?: string;
  centered?: boolean;
}

export default function SectionHeading({
  children,
  subtitle,
  centered = true,
}: SectionHeadingProps) {
  return (
    <div className={`mb-12 ${centered ? "text-center" : ""}`}>
      <h2 className="font-heading text-3xl font-bold uppercase tracking-wider text-white md:text-4xl">
        {children}
      </h2>
      <div
        className={`mt-4 h-1 w-16 bg-blue-600 ${centered ? "mx-auto" : ""}`}
      />
      {subtitle && (
        <p className="mt-4 text-lg text-zinc-400">{subtitle}</p>
      )}
    </div>
  );
}
