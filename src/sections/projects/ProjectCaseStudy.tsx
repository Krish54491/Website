// one page for every project case study, data comes from PROJECT_PAGES in projectsConfig
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProjectsTransition from "../../components/transitions/ProjectsTransition";
import SectionHeading from "../../components/ui/SectionHeading";
import ThemedImage from "../../components/ui/ThemedImage";
import InfoPanel, { LinkList, MetaList } from "../../components/ui/InfoPanel";
import { BadgeList } from "../../components/ui/Badge";
import ArchitectureDiagram from "../../components/ui/ArchitectureDiagram";
import {
  PROJECT_CARDS,
  PROJECT_PAGES,
  type ProjectPage,
} from "../config/projectsConfig";

type LoadState =
  | { status: "loading" }
  | { status: "missing" }
  | { status: "ready"; page: ProjectPage };

function BackLink() {
  return (
    <Link
      to="/projects"
      className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors duration-200 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <span aria-hidden="true">←</span> Projects
    </Link>
  );
}

function LoadingSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading case study"
      className="animate-pulse space-y-6 motion-reduce:animate-none"
    >
      <div className="h-12 w-2/3 rounded-lg bg-muted" />
      <div className="aspect-video w-full rounded-2xl bg-muted" />
      <div className="h-40 w-full rounded-2xl bg-muted" />
    </div>
  );
}

export default function ProjectCaseStudy() {
  const { slug = "" } = useParams();
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const card = PROJECT_CARDS.find((project) => project.path === slug);

  useEffect(() => {
    const loadPage = Object.prototype.hasOwnProperty.call(PROJECT_PAGES, slug)
      ? PROJECT_PAGES[slug]
      : undefined;
    if (!loadPage) {
      setState({ status: "missing" });
      return;
    }
    let cancelled = false;
    setState({ status: "loading" });
    loadPage()
      .then((module) => {
        if (!cancelled) setState({ status: "ready", page: module.default });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "missing" });
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return (
    <ProjectsTransition>
      <main className="section-page mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <BackLink />
        {state.status === "loading" && <LoadingSkeleton />}
        {state.status === "missing" && (
          <SectionHeading
            as="h1"
            title="Project not found"
            subtitle="That case study doesn't exist (yet)."
          />
        )}
        {state.status === "ready" && (
          <article>
            <SectionHeading
              as="h1"
              eyebrow="Case study"
              title={state.page.name}
              subtitle={card?.summary}
            />

            {card && (
              <div className="mb-10 overflow-hidden rounded-2xl border border-border bg-card p-3 sm:mb-14 sm:p-6">
                <ThemedImage
                  light={card.image}
                  alt={state.page.name}
                  className="aspect-video w-full rounded-xl"
                />
              </div>
            )}

            <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-12">
              <div className="space-y-10 lg:col-span-2">
                <section>
                  <SectionHeading as="h2" title="Overview" className="mb-4!" />
                  <div className="space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                    {state.page.summary
                      .split(/\n\s*\n/)
                      .map((paragraph) => paragraph.trim())
                      .filter(Boolean)
                      .map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                  </div>
                </section>

                {state.page.highlights.length > 0 && (
                  <section>
                    <SectionHeading
                      as="h2"
                      title="Highlights"
                      className="mb-4!"
                    />
                    <ul className="space-y-3">
                      {state.page.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="flex gap-3 text-base text-muted-foreground sm:text-lg"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary"
                          />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>

              <aside className="flex flex-col gap-6">
                <InfoPanel>
                  <MetaList
                    items={[
                      { label: "Role", value: state.page.role },
                      { label: "Period", value: state.page.period },
                    ]}
                  />
                </InfoPanel>
                <InfoPanel title="Stack">
                  <BadgeList items={state.page.techStack} variant="outline" />
                </InfoPanel>
                {state.page.links && state.page.links.length > 0 && (
                  <InfoPanel title="Links">
                    <LinkList links={state.page.links} />
                  </InfoPanel>
                )}
              </aside>
            </div>

            {state.page.architecture.length > 0 && (
              <section className="mt-12 sm:mt-16">
                <SectionHeading as="h2" title="Architecture" className="mb-4!" />
                <ArchitectureDiagram stages={state.page.architecture} />
              </section>
            )}
          </article>
        )}
      </main>
    </ProjectsTransition>
  );
}
