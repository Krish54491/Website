// heading with an optional small eyebrow above it and a muted subtitle below
export default function SectionHeading({
  title,
  eyebrow,
  subtitle,
  as: Tag = "h2",
  align = "left",
  className = "",
}: {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  as?: "h1" | "h2" | "h3";
  align?: "left" | "center";
  className?: string;
}) {
  const sizes = {
    h1: "text-4xl sm:text-5xl lg:text-6xl",
    h2: "text-2xl sm:text-3xl",
    h3: "text-xl sm:text-2xl",
  };
  return (
    <header
      className={`mb-6 sm:mb-8 ${align === "center" ? "text-center" : "text-left"} ${className}`}
    >
      {eyebrow && (
        <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-primary uppercase">
          {eyebrow}
        </p>
      )}
      <Tag className={`font-bold tracking-tight ${sizes[Tag]}`}>{title}</Tag>
      {subtitle && (
        <p
          className={`mt-3 text-base text-muted-foreground sm:text-lg ${align === "center" ? "mx-auto" : ""} max-w-2xl`}
        >
          {subtitle}
        </p>
      )}
    </header>
  );
}
