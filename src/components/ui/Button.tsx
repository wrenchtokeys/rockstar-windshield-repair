import Link from "next/link";

type Variant = "primary" | "secondary" | "outline";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: Variant;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-blue-600 text-white font-bold hover:bg-blue-500 btn-angular",
  secondary:
    "bg-red text-white font-bold hover:bg-red-light btn-angular",
  outline:
    "border-2 border-blue-600 text-blue-600 font-bold hover:bg-blue-600 hover:text-white btn-angular",
};

export default function Button({
  children,
  href,
  variant = "primary",
  className = "",
  type = "button",
  onClick,
  disabled,
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center px-8 py-3 text-sm uppercase tracking-widest transition-all duration-200";
  const styles = `${base} ${variantStyles[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={styles}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={styles}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
