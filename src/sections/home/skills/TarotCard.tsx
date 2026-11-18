// one dealt tarot card: face down with a glow until clicked, then it flips to show its arcana
import type { RefObject } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";
import cardBack from "../../../assets/home/tarot/back.webp";
import type { Arcana } from "../../config/types";
import {
  clamp01,
  dealProgress,
  dealWindow,
  type TarotGeometry,
} from "./tarotMotion";

// back side, shared by every card and the deck
export function CardBack() {
  return (
    <img
      src={cardBack}
      alt=""
      draggable={false}
      className="size-full object-cover"
    />
  );
}

// front side, `src` is undefined for the moment the image is still loading
export function CardFront({ src }: { src?: string }) {
  if (!src) return <span className="block size-full bg-muted" />;
  return (
    <img
      src={src}
      alt=""
      draggable={false}
      className="size-full object-cover"
    />
  );
}

const faceClasses =
  "absolute inset-0 block overflow-hidden rounded-lg backface-hidden";

export default function TarotCard({
  index,
  count,
  p,
  tick,
  geometry,
  arcana,
  front,
  title,
  revealed,
  dealt,
  hidden,
  reduced,
  onSelect,
  onFlipped,
  slotRef,
}: {
  index: number;
  count: number;
  p: MotionValue<number>;
  tick: MotionValue<number>; // bumped whenever the geometry gets re-measured
  geometry: RefObject<TarotGeometry>;
  arcana: Arcana;
  front?: string;
  title: string; // which skills this slot holds, e.g. "Software"
  revealed: boolean;
  dealt: boolean;
  hidden: boolean; // true while this card is showing in the modal instead
  reduced: boolean;
  onSelect: () => void;
  onFlipped: () => void;
  slotRef: (el: HTMLButtonElement | null) => void;
}) {
  // the button sits in its final slot in the layout, these offsets pull it back to the deck
  const x = useTransform<number, number>(
    [p, tick],
    ([value]) =>
      geometry.current.dx[index] * (1 - dealProgress(value, index, count)),
  );
  const y = useTransform<number, number>(
    [p, tick],
    ([value]) =>
      geometry.current.dy[index] * (1 - dealProgress(value, index, count)),
  );
  // small spin on the way out so it looks thrown, 0 at both ends
  const rotate = useTransform(p, (value) => {
    const t = dealProgress(value, index, count);
    return Math.sin(t * Math.PI) * (index - (count - 1) / 2 || 0.5) * 14;
  });
  // invisible while it's still inside the deck
  const opacity = useTransform(p, (value) =>
    clamp01((value - dealWindow(index, count)[0]) / 0.03),
  );

  return (
    <motion.button
      ref={slotRef}
      type="button"
      disabled={!dealt}
      onClick={onSelect}
      aria-label={
        revealed
          ? `${arcana.name}, show ${title} skills`
          : `Face-down card, reveal ${title} skills`
      }
      data-physics="rect"
      data-radius="8"
      style={{ x, y, rotate, opacity }}
      className="group relative aspect-(--tarot-aspect) w-(--tarot-w) shrink-0 cursor-pointer rounded-lg perspective-[800px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring disabled:cursor-default"
    >
      <motion.span
        initial={false}
        animate={{ rotateY: revealed ? 180 : 0 }}
        // flipping back (re-deal) is instant since the card is hidden inside the deck then
        transition={{
          duration: revealed && !reduced ? 0.6 : 0,
          ease: "easeInOut",
        }}
        onAnimationComplete={() => revealed && onFlipped()}
        className={`block size-full rounded-lg transition-[translate] duration-200 transform-3d group-enabled:group-hover:-translate-y-1.5 group-enabled:group-focus-visible:-translate-y-1.5 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 ${hidden ? "invisible" : ""}`}
      >
        <span
          className={`${faceClasses} ${
            dealt && !revealed
              ? "animate-tarotGlow group-hover:animate-none group-hover:shadow-[0_0_28px_8px_var(--color-secondary)] group-focus-visible:animate-none group-focus-visible:shadow-[0_0_28px_8px_var(--color-secondary)] motion-reduce:animate-none motion-reduce:shadow-[0_0_14px_2px_var(--color-secondary)]"
              : ""
          }`}
        >
          <CardBack />
        </span>
        <span className={`${faceClasses} rotate-y-180 shadow-lg`}>
          <CardFront src={front} />
        </span>
      </motion.span>
    </motion.button>
  );
}
