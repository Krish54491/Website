// top to bottom flow of stages, each stage is a row of nodes with an optional label above it
export type DiagramStage = {
  label?: string;
  nodes: { title: string; description?: string }[];
};

function ChevronDown() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="my-3 size-4 text-primary"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export default function ArchitectureDiagram({
  stages,
}: {
  stages: DiagramStage[];
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] bg-size-[16px_16px] px-4 py-8 sm:px-8 sm:py-10">
      <ol className="flex flex-col items-center">
        {stages.map((stage, stageIdx) => (
          <li
            key={stageIdx}
            className="flex w-full flex-col items-center"
          >
            {stageIdx > 0 && <ChevronDown />}
            {stage.label && (
              <p className="mb-3 text-xs tracking-[0.2em] text-muted-foreground uppercase">
                {stage.label}
              </p>
            )}
            <ul className="flex w-full flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
              {stage.nodes.map((node) => (
                <li
                  key={node.title}
                  className={`w-full rounded-lg border border-border bg-card px-4 py-3 text-center ${stage.nodes.length === 1 ? "max-w-sm" : "max-w-sm sm:w-48"}`}
                >
                  <p className="font-bold">{node.title}</p>
                  {node.description && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {node.description}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}
