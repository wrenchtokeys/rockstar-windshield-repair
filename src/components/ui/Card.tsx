interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({
  children,
  className = "",
  hover = true,
}: CardProps) {
  return (
    <div
      className={`rounded-lg border border-zinc-800 bg-zinc-900 p-6 ${
        hover ? "blue-glow" : ""
      } transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  );
}
