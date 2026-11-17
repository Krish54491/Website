// shared numbers for the tarot animation. everything is driven by one progress value `p`:
//   0 -> SHUFFLE_END   the deck shuffles
//   SHUFFLE_END -> DEAL_END   cards leave the deck one by one while the deck shrinks and turns sideways
//   DEAL_END -> 1   settle, the hint fades in

export const SHUFFLE_END = 0.35;
export const DEAL_END = 0.85;
export const MINI_DECK_SCALE = 0.45; // size of the deck once the cards are dealt, the deck's box in TarotDeck uses the same number

// how far things have to travel, measured from the real layout so it works at any screen size.
// all in px, relative to where the element ends up once dealt
export type TarotGeometry = {
  deckY: number; // how far below its final spot the deck starts
  dx: number[]; // per card: deck centre - slot centre
  dy: number[];
};

export const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export const easeInOut = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

// the slice of `p` in which card `index` (out of `count`) flies from the deck to its slot,
// each card starts a bit after the previous one
export function dealWindow(index: number, count: number): [number, number] {
  const span = DEAL_END - SHUFFLE_END;
  const length = span / (1 + (count - 1) * 0.5);
  const start = SHUFFLE_END + index * length * 0.5;
  return [start, start + length];
}

// 0 while the card is still in the deck, 1 once it's in its slot
export function dealProgress(p: number, index: number, count: number) {
  const [start, end] = dealWindow(index, count);
  return easeInOut(clamp01((p - start) / (end - start)));
}

// same idea for the deck shrinking into its corner
export function deckProgress(p: number) {
  return easeInOut(clamp01((p - SHUFFLE_END) / (DEAL_END - SHUFFLE_END)));
}
