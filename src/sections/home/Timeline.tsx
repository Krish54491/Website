// Work history, education, and some projects as one timeline, oldest first.
// each bubble slides in from its side of the line the first time it scrolls into view
// (see documents/Frontend Changes.md -> "Work history and Education(projects)")
import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import SectionHeading from "../../components/ui/SectionHeading";
import { BadgeList } from "../../components/ui/Badge";
import type { TimelinePin } from "../config/homeConfig";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const SLIDE = 80; // how far (px) a bubble starts from its final spot

// "2025-08" -> "Aug 2025"
function formatMonth(date: string) {
  const [year, month] = date.split("-");
  return `${MONTHS[Number(month) - 1]} ${year}`;
}

// lucide style icons, 24x24 stroked
const Icon = ({ children }: { children: ReactNode }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="size-5"
  >
    {children}
  </svg>
);

// one look per pin type, add a type here and in TimelinePin to get a new kind of pin
const PIN_STYLES: Record<
  TimelinePin["type"],
  { label: string; className: string; icon: ReactNode }
> = {
  education: {
    label: "Education",
    className: "bg-accent text-accent-foreground",
    icon: (
      <Icon>
        <path d="M22 10 12 5 2 10l10 5 10-5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </Icon>
    ),
  },
  job: {
    label: "Work",
    className: "bg-primary text-primary-foreground",
    icon: (
      <Icon>
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </Icon>
    ),
  },
  project: {
    label: "Project",
    className: "bg-secondary text-secondary-foreground",
    icon: (
      <Icon>
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </Icon>
    ),
  },
};

// md and up the bubbles alternate sides, below that they're all on the left
function useIsDesktop() {
  const query = "(min-width: 768px)";
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches,
  );
  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return matches;
}

// small arrow next to the name, internal links stay in the app, external ones open a new tab
function PinLink({ link, name }: { link: string; name: string }) {
  const className =
    "group inline-flex size-6 shrink-0 items-center justify-center rounded-full text-muted-foreground transition duration-200 hover:bg-primary hover:text-primary-foreground";
  const arrow = (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-0"
    >
      <path d="M7 17 17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
  const label = `Open ${name}`;
  return link.startsWith("/") ? (
    <Link to={link} className={className} aria-label={label}>
      {arrow}
    </Link>
  ) : (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      className={className}
      aria-label={label}
    >
      {arrow}
    </a>
  );
}

export default function Timeline({
  pins,
  onMove,
}: {
  pins: TimelinePin[];
  onMove?: () => void; // called while bubbles move, FrontPage re-syncs the plushie obstacles with it
}) {
  const reduced = useReducedMotion() ?? false;
  const isDesktop = useIsDesktop();
  // "YYYY-MM" strings sort correctly as plain text, so no Date parsing needed
  const sorted = [...pins].sort((a, b) =>
    a.timeStart.localeCompare(b.timeStart),
  );

  // load the images ahead of time so they don't pop in mid slide
  useEffect(() => {
    pins.forEach((pin) => {
      if (pin.image) new Image().src = pin.image;
    });
  }, [pins]);

  return (
    // overflow-x-clip so bubbles starting off to the right don't make the page scroll sideways
    <section id="timeline" className="overflow-x-clip py-10 sm:py-14">
      <SectionHeading title="Experience & Education" />
      {/* legend for the pins */}
      <ul className="mb-8 flex flex-wrap gap-4 text-sm text-muted-foreground">
        {Object.values(PIN_STYLES).map((style) => (
          <li key={style.label} className="flex items-center gap-2">
            <span
              className={`flex size-6 items-center justify-center rounded-full [&_svg]:size-3.5 ${style.className}`}
            >
              {style.icon}
            </span>
            {style.label}
          </li>
        ))}
      </ul>

      <ol>
        {sorted.map((pin, i) => {
          const style = PIN_STYLES[pin.type];
          // odd rows flip to the right of the line on desktop
          const flipped = isDesktop && i % 2 === 1;
          const start = formatMonth(pin.timeStart);
          const end = pin.timeEnd ? formatMonth(pin.timeEnd) : "Present";
          const last = i === sorted.length - 1;

          return (
            <li
              key={`${pin.name}-${pin.timeStart}`}
              className="grid grid-cols-[1fr_auto_5.5rem] md:grid-cols-[1fr_auto_1fr]"
            >
              {/* bubble: always column 1 on mobile, alternates on desktop */}
              <div
                className={`row-start-1 ${flipped ? "col-start-3 pl-4" : "col-start-1 pr-4"} ${last ? "" : "pb-10"}`}
              >
                <motion.div
                  data-physics
                  initial={
                    reduced
                      ? false
                      : { opacity: 0, x: flipped ? SLIDE : -SLIDE }
                  }
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "0px 0px -15% 0px" }}
                  transition={{ type: "spring", stiffness: 70, damping: 16 }}
                  onUpdate={() => onMove?.()}
                  onAnimationComplete={() => onMove?.()}
                  className="relative rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-md sm:p-5"
                >
                  {/* little pointer toward the line, a rotated square with only the outer 2 borders */}
                  <span
                    aria-hidden="true"
                    className={`absolute top-5 size-3 rotate-45 border-border bg-card ${flipped ? "-left-1.75 border-b border-l" : "-right-1.75 border-t border-r"}`}
                  />
                  <div className="flex items-start gap-2">
                    <h3 className="text-base font-bold sm:text-lg">
                      {pin.name}
                    </h3>
                    {pin.link && <PinLink link={pin.link} name={pin.name} />}
                  </div>
                  {(pin.organization || pin.location) && (
                    <p className="text-sm font-medium text-muted-foreground">
                      {[pin.organization, pin.location]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  )}
                  {pin.image && (
                    <img
                      src={pin.image}
                      alt={pin.name}
                      className="mt-3 w-full rounded-xl object-cover"
                    />
                  )}
                  {pin.highlights && pin.highlights.length > 0 && (
                    <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
                      {pin.highlights.map((highlight) => (
                        <li key={highlight}>{highlight}</li>
                      ))}
                    </ul>
                  )}
                  <BadgeList
                    items={pin.skills}
                    variant="outline"
                    className="mt-4"
                  />
                </motion.div>
              </div>

              {/* the line runs through every row's middle column, so it's one continuous line */}
              <div className="relative col-start-2 row-start-1 flex justify-center px-1">
                <span
                  aria-hidden="true"
                  className={`absolute left-1/2 w-0.5 -translate-x-1/2 bg-border ${i === 0 ? "top-5" : "top-0"} ${last ? "h-5" : "bottom-0"}`}
                />
                <span
                  title={style.label}
                  className={`relative mt-1 flex size-9 items-center justify-center rounded-full shadow-md ring-4 ring-background sm:size-10 ${style.className}`}
                >
                  {style.icon}
                </span>
              </div>

              {/* dates: stacked on mobile against the right edge, one line next to the pin on desktop */}
              <p
                className={`row-start-1 mt-3 text-xs font-semibold text-muted-foreground sm:text-sm ${flipped ? "col-start-1 pr-4 text-right" : "col-start-3 pl-1 text-center md:pl-4 md:text-left"}`}
              >
                <span className="block md:inline">{start} </span>
                {pin.timeEnd !== pin.timeStart && (
                  <span className="block md:inline">– {end}</span>
                )}
              </p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
