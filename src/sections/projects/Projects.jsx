import ProjectsTransition from "../../components/transitions/ProjectsTransition";
import SectionHeading from "../../components/ui/SectionHeading";
import ProjectCard from "../../components/ui/ProjectCard";
import { PROJECT_CARDS } from "../config/projectsConfig";

export default function Projects() {
  return (
    <ProjectsTransition>
      <main className="section-page mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <SectionHeading
          as="h1"
          eyebrow="Case studies"
          title="Projects"
          subtitle="Things I've built with teams or for other people."
        />
        {PROJECT_CARDS.length === 0 ? (
          <p className="text-muted-foreground">No Projects</p>
        ) : (
          <ul className="flex flex-col gap-5 sm:gap-6">
            {PROJECT_CARDS.map((project, idx) => (
              <li key={project.path}>
                <ProjectCard
                  index={idx}
                  name={project.name}
                  summary={project.summary}
                  techStack={project.techStack}
                  image={project.image}
                  to={`/projects/${project.path}`}
                />
              </li>
            ))}
          </ul>
        )}
      </main>
    </ProjectsTransition>
  );
}
