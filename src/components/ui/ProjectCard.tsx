// project preview: image, number, name, summary, tech stack and a case study link
import GlowCard from "./GlowCard";
import ThemedImage, { type ImageSource } from "./ThemedImage";
import { BadgeList } from "./Badge";

export default function ProjectCard({
  index,
  name,
  summary,
  techStack,
  image,
  to,
  linkLabel = "View case study",
}: {
  index?: number; // shown as 01, 02...
  name: string;
  summary: string;
  techStack: string[];
  image: ImageSource;
  to: string;
  linkLabel?: string;
}) {
  return (
    <GlowCard to={to} className="h-full">
      <ThemedImage
        light={image}
        alt={name}
        className="aspect-video w-full border-b-2 border-primary"
      />
      <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
        {index !== undefined && (
          <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground">
            {String(index + 1).padStart(2, "0")}
          </p>
        )}
        <h2 className="text-xl font-bold text-primary sm:text-2xl">{name}</h2>
        <p className="text-sm text-muted-foreground sm:text-base">{summary}</p>
        <BadgeList items={techStack} className="mt-1" />
        <span className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-semibold text-primary">
          {linkLabel}
          <span
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
          >
            →
          </span>
        </span>
      </div>
    </GlowCard>
  );
}
