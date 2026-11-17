// the deck: starts as a full size upright stack, shuffles, then shrinks and turns sideways
// into a small button above the cards that deals a fresh hand
import type { RefObject } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";
import { CardBack } from "./TarotCard";
import {
  MINI_DECK_SCALE,
  SHUFFLE_END,
  deckProgress,
  type TarotGeometry,
} from "./tarotMotion";

const LAYERS = 4;

// one card of the stack, odd and even ones slide opposite ways while shuffling
function DeckLayer({ index, p }: { index: number; p: MotionValue<number> }) {
  const direction = index % 2 === 0 ? -1 : 1;
  const swing = (value: number) =>
    value < SHUFFLE_END
      ? Math.sin((value / SHUFFLE_END) * Math.PI * 3) * direction
      : 0;
  const x = useTransform(p, (value) => `${swing(value) * 32}%`);
  const rotate = useTransform(p, (value) => swing(value) * 5);
  return (
    <motion.span
      // each layer sits 2px up and left of the one below so it reads as a stack
      style={{ x, rotate, marginLeft: index * -2, marginTop: index * -2 }}
      className="absolute inset-0 block overflow-hidden rounded-lg shadow-md"
    >
      <CardBack />
    </motion.span>
  );
}

export default function TarotDeck({
  p,
  tick,
  geometry,
  dealt,
  onRedeal,
  boxRef,
}: {
  p: MotionValue<number>;
  tick: MotionValue<number>;
  geometry: RefObject<TarotGeometry>;
  dealt: boolean;
  onRedeal: () => void;
  boxRef: RefObject<HTMLDivElement | null>;
}) {
  const y = useTransform<number, number>(
    [p, tick],
    ([value]) => geometry.current.deckY * (1 - deckProgress(value)),
  );
  const scale = useTransform(
    p,
    (value) => 1 - (1 - MINI_DECK_SCALE) * deckProgress(value),
  );
  const rotate = useTransform(p, (value) => 90 * deckProgress(value));

  return (
    // the box is the space the small sideways deck takes up once dealt (so width and height are swapped).
    // the deck itself is a full size card centred on it and transformed into place
    <div
      ref={boxRef}
      className="relative"
      style={{
        width: `calc(var(--tarot-h) * ${MINI_DECK_SCALE})`,
        height: `calc(var(--tarot-w) * ${MINI_DECK_SCALE})`,
      }}
    >
      <motion.button
        type="button"
        disabled={!dealt}
        onClick={onRedeal}
        aria-label="Re-deal the cards"
        title={dealt ? "Re-deal" : undefined}
        data-physics="rect"
        data-radius="8"
        style={{
          y,
          scale,
          rotate,
          marginLeft: "calc(var(--tarot-w) / -2)",
          marginTop: "calc(var(--tarot-h) / -2)",
        }}
        className="group absolute top-1/2 left-1/2 aspect-(--tarot-aspect) w-(--tarot-w) cursor-pointer rounded-lg focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-ring disabled:cursor-default"
      >
        <span className="block size-full transition-[scale] duration-200 group-enabled:group-hover:scale-110 motion-reduce:transition-none">
          {Array.from({ length: LAYERS }, (_, index) => (
            <DeckLayer key={index} index={index} p={p} />
          ))}
        </span>
      </motion.button>
    </div>
  );
}
