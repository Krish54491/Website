// image that swaps between a light and dark version based on prefers-color-scheme
// sources can be plain urls or lazy loaders(() => import("./img.png")) so big lists don't download everything up front
import { useEffect, useState, type SyntheticEvent } from "react";

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
  containNonWidescreen = false,
}: {
  light?: ImageSource;
  dark?: ImageSource;
  fallback?: string; // used when neither light nor dark is given
  alt: string;
  className?: string;
  containNonWidescreen?: boolean; // shrink images that aren't 16:9 so none of it gets cropped
}) {
  const [urls, setUrls] = useState<{ light?: string; dark?: string } | null>(
    null,
  );
  const [isWidescreen, setIsWidescreen] = useState(true);

  // checked after load since the real size isn't known until then
  const checkAspect = (e: SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (!naturalHeight) return;
    setIsWidescreen(Math.abs(naturalWidth / naturalHeight - 16 / 9) < 0.02);
  };
  const fit =
    containNonWidescreen && !isWidescreen ? "object-contain" : "object-cover";

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
        onLoad={checkAspect}
        className={`${fit} ${className}`}
      />
    </picture>
  );
}
