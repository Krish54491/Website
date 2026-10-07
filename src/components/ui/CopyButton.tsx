// small copy-to-clipboard button with a spinning gradient border, swaps to a check for 2s after copying
import { useEffect, useRef, useState } from "react";

function CopyIcon() {
  return (
    <svg
      viewBox="0 0 512 512"
      fill="none"
      stroke="currentColor"
      strokeWidth="32"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4"
    >
      <rect width="336" height="336" x="128" y="128" rx="57" ry="57" />
      <path d="m383.5 128 .5-24a56.16 56.16 0 0 0-56-56H112a64.19 64.19 0 0 0-64 64v216a56.16 56.16 0 0 0 56 56h24" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4 text-primary"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

type CopyButtonProps = {
  text: string;
  label?: string;
  className?: string;
};

export default function CopyButton({
  text,
  label = "Copy",
  className = "",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked, the text is still on screen to copy by hand
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={copy}
        title={label}
        aria-label={label}
        className={`relative z-10 inline-flex size-8 cursor-pointer overflow-hidden rounded-md p-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${className}`}
      >
        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,var(--color-primary)_0%,var(--color-accent)_50%,var(--color-primary)_100%)] motion-reduce:animate-none" />
        <span className="relative z-10 inline-flex size-full items-center justify-center rounded-md bg-card text-muted-foreground transition-all hover:bg-muted">
          {copied ? <CheckIcon /> : <CopyIcon />}
        </span>
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </>
  );
}
