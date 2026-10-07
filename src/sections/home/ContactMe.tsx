// contact form that posts to /api/contact, plus a copyable email row
import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
  type SubmitEvent,
} from "react";
import HomeTransition from "../../components/transitions/HomeTransition";
import SectionHeading from "../../components/ui/SectionHeading";
import { CONTACT_INFO } from "../utils/constants.ts";
import { API_ROUTES } from "../utils/apiRoutes.ts";

type Status =
  | { state: "idle" }
  | { state: "sending" }
  | { state: "sent" }
  | { state: "error"; message: string };

const fieldClasses =
  "flex w-full rounded-md border-none bg-card px-3 py-2 text-sm text-card-foreground shadow-[0_0_0_1px_var(--color-border)] transition duration-300 placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 group-hover/field:shadow-none";

// the glowing line that shows up under buttons on hover
function HoverUnderline() {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-linear-to-r from-transparent via-primary to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-linear-to-r from-transparent via-accent to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
}

// 2px border that lights up in a circle around the mouse
function SpotlightBorder({ children }: { children: ReactNode }) {
  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  }
  return (
    <div
      onMouseMove={handleMouseMove}
      className="group/field rounded-lg p-0.5 transition duration-300 [--spot-r:0px] hover:[--spot-r:100px]"
      style={{
        background:
          "radial-gradient(var(--spot-r) circle at var(--spot-x, 0px) var(--spot-y, 0px), var(--color-primary), transparent 80%)",
      }}
    >
      {children}
    </div>
  );
}

function Field({
  id,
  label,
  className = "",
  children,
}: {
  id: string;
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`flex w-full flex-col space-y-2 ${className}`}>
      <label
        htmlFor={id}
        className="text-sm leading-none font-medium text-foreground/90"
      >
        {label}
      </label>
      <SpotlightBorder>{children}</SpotlightBorder>
    </div>
  );
}

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4 text-muted-foreground"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

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

function EmailRow() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(CONTACT_INFO);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked, the email is still on screen to copy by hand
    }
  }

  return (
    <div className="group/btn relative flex h-10 w-full items-center justify-between rounded-md bg-card px-4 font-medium shadow-[0_0_0_1px_var(--color-border)]">
      <div className="flex flex-1 items-center space-x-2">
        <MailIcon />
        <span className="text-sm text-muted-foreground">
          Email: <span className="text-card-foreground">{CONTACT_INFO}</span>
        </span>
      </div>
      <button
        type="button"
        onClick={copyEmail}
        title="Copy email"
        className="relative z-10 inline-flex size-8 cursor-pointer overflow-hidden rounded-md p-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,var(--color-primary)_0%,var(--color-accent)_50%,var(--color-primary)_100%)] motion-reduce:animate-none" />
        <span className="relative z-10 inline-flex size-full items-center justify-center rounded-md bg-card text-muted-foreground transition-all hover:bg-muted">
          {copied ? <CheckIcon /> : <CopyIcon />}
        </span>
      </button>
      <span className="sr-only">
        {copied ? "Email copied to clipboard" : ""}
      </span>
      <HoverUnderline />
    </div>
  );
}

export default function ContactMe() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const sending = status.state === "sending";

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus({ state: "sending" });
    try {
      const res = await fetch(API_ROUTES.CONTACT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, content }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setStatus({ state: "sent" });
        setName("");
        setEmail("");
        setContent("");
      } else {
        setStatus({
          state: "error",
          message: data.message || "Couldn't send your message, try again.",
        });
      }
    } catch {
      setStatus({
        state: "error",
        message: "Couldn't send your message, try again.",
      });
    }
  }

  return (
    <HomeTransition>
      <main className="section-page mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <SectionHeading as="h1" eyebrow="Say hi" title="Contact me" />
        <form className="my-8" onSubmit={handleSubmit}>
          <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
            <Field id="name" label="Name">
              <input
                id="name"
                type="text"
                required
                autoComplete="name"
                placeholder="Your secret identity"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={sending}
                className={`h-10 ${fieldClasses}`}
              />
            </Field>
            <Field id="email" label="Email Address" className="mb-4">
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                placeholder="I promise I won't spam you"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={sending}
                className={`h-10 ${fieldClasses}`}
              />
            </Field>
          </div>
          <Field id="content" label="Content" className="mb-8">
            <textarea
              id="content"
              rows={4}
              required
              placeholder="Your message goes here. Ask me anything 👀"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={sending}
              className={`resize-none ${fieldClasses}`}
            />
          </Field>

          <button
            type="submit"
            disabled={sending}
            className="group/btn relative block h-10 w-full cursor-pointer rounded-md bg-card font-medium text-card-foreground shadow-[inset_0_1px_0_0_var(--color-border),inset_0_-1px_0_0_var(--color-border)] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {sending ? "Sending..." : "Send Email →"}
            <HoverUnderline />
          </button>
          <p className="mt-3 min-h-5 text-sm">
            {status.state === "sent" && (
              <span className="text-primary">
                Message sent, I'll get back to you soon!
              </span>
            )}
            {status.state === "error" && (
              <span className="text-destructive">{status.message}</span>
            )}
          </p>

          <div className="my-8 h-px w-full bg-linear-to-r from-transparent via-border to-transparent" />

          <EmailRow />
        </form>
      </main>
    </HomeTransition>
  );
}
