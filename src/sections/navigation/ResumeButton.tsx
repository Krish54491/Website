// outlined button that lifts up and leaves a solid offset shadow on hover(from brittanychiang.com v4)
export default function ResumeButton({
  href,
  label = "Resume",
  size = "sm",
}: {
  href: string;
  label?: string;
  size?: "sm" | "lg";
}) {
  const sizes = {
    sm: "px-4 py-2 text-sm",
    lg: "px-12 py-4 text-base",
  };
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-block rounded-md border border-primary font-semibold text-foreground transition-[translate,box-shadow] duration-200 ease-out hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0_0_var(--color-primary)] focus-visible:-translate-x-1 focus-visible:-translate-y-1 focus-visible:shadow-[4px_4px_0_0_var(--color-primary)] focus-visible:outline-none motion-reduce:transition-none motion-reduce:hover:translate-0 ${sizes[size]}`}
    >
      {label}
    </a>
  );
}
