// project preview: image, number, name, summary, tech stack and a case study link
// "horizontal" is the full width row used on the projects page, "vertical" is a smaller card for previews(e.g. home page)
import { Link } from "react-router-dom";
import ThemedImage, { type ImageSource } from "./ThemedImage";
import { BadgeList } from "./Badge";

type ProjectCardProps = {
  index?: number; // shown as 01, 02...
  name: string;
  summary: string;
  techStack: string[];
  image: ImageSource;
  to: string;
  linkLabel?: string;
  layout?: "horizontal" | "vertical";
};

function CardNumber({ index }: { index?: number }) {
  if (index === undefined) return null;
  return (
    <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground">
      {String(index + 1).padStart(2, "0")}
    </p>
  );
}

function CaseStudyLink({ label }: { label: string }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary transition-transform duration-200 hover:text-foreground hover:-translate-y-1">
      {label}
      <span className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none">
        ↗
      </span>
    </span>
  );
}

const cardClasses =
  "group rounded-2xl border border-border bg-card text-card-foreground transition-[border-color,background-color,translate] duration-300 hover:-translate-y-0.5 hover:border-primary focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none motion-reduce:hover:translate-y-0";

export default function ProjectCard({
  index,
  name,
  summary,
  techStack,
  image,
  to,
  linkLabel = "View case study",
  layout = "horizontal",
}: ProjectCardProps) {
  if (layout === "vertical") {
    return (
      <Link
        to={to}
        className={`flex h-full flex-col overflow-hidden ${cardClasses}`}
      >
        <div className="overflow-hidden border-b border-border">
          <ThemedImage
            light={image}
            alt={name}
            className="aspect-video w-full transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
          />
        </div>
        <div className="flex flex-1 flex-col gap-2 p-5">
          <CardNumber index={index} />
          <h3 className="text-xl font-bold">{name}</h3>
          <p className="text-sm text-muted-foreground">{summary}</p>
          <BadgeList items={techStack} variant="outline" className="mt-2" />
          <div className="mt-auto pt-3">
            <CaseStudyLink label={linkLabel} />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={to}
      className={`flex flex-col gap-4 p-3 sm:flex-row sm:gap-6 sm:p-5 ${cardClasses}`}
    >
      <div className="shrink-0 overflow-hidden rounded-xl border border-border sm:w-56 lg:w-64">
        <ThemedImage
          light={image}
          alt={name}
          className="aspect-video w-full transition-transform duration-500 group-hover:scale-105 sm:aspect-4/3 motion-reduce:transition-none"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2 px-1 pb-1 sm:px-0 sm:pb-0">
        <CardNumber index={index} />
        <h2 className="text-xl font-bold tracking-tight transition-colors duration-200 group-hover:text-primary sm:text-2xl">
          {name}
        </h2>
        <p className="text-sm text-muted-foreground sm:text-base">{summary}</p>
        <div className="mt-auto flex flex-col gap-3 pt-3 sm:flex-row sm:items-end sm:justify-between">
          <BadgeList items={techStack} variant="outline" />
          <CaseStudyLink label={linkLabel} />
        </div>
      </div>
    </Link>
  );
}
