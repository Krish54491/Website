// image that swaps between a light and dark version based on prefers-color-scheme
// sources can be plain urls or lazy loaders(() => import("./img.png")) so big lists don't download everything up front
import { useEffect, useState } from "react";

export type ImageSource = string | (() => Promise<{ default: string }>);

async function resolveSource(source?: ImageSource) {
  if (!source) return undefined;
  if (typeof source === "string") return source;
  const module = await source();
  return module.default;
}

export default function ThemedImage({
  light,
  dark,
  fallback,
  alt,
  className = "",
}: {
  light?: ImageSource;
  dark?: ImageSource;
  fallback?: string; // used when neither light nor dark is given
  alt: string;
  className?: string;
}) {
  const [urls, setUrls] = useState<{ light?: string; dark?: string } | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;
    Promise.all([resolveSource(light), resolveSource(dark)]).then(
      ([lightUrl, darkUrl]) => {
        if (!cancelled) setUrls({ light: lightUrl, dark: darkUrl });
      },
    );
    return () => {
      cancelled = true;
    };
  }, [light, dark]);

  if (!urls) {
    return (
      <div
        aria-hidden="true"
        className={`animate-pulse bg-muted motion-reduce:animate-none ${className}`}
      />
    );
  }

  const src = urls.light ?? urls.dark ?? fallback;
  return (
    <picture>
      {urls.dark && urls.light && (
        <source media="(prefers-color-scheme: dark)" srcSet={urls.dark} />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`object-cover ${className}`}
      />
    </picture>
  );
}
