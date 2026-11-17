// tarot cards for the home page skills section
// the arcana drawn is random and only for flavor, which skills a card shows depends on its slot (see SKILL_CARDS in homeConfig)
//
// images live in src/assets/home/tarot:
//   back.webp            shared back side of every card
//   arcana/<image>.webp  front of each arcana, <image> is the `image` field below
// anything missing falls back to a plain drawn card so the section still works without the art

export type Arcana = {
  image: string; // file name in assets/home/tarot/arcana without the extension
  name: string;
  numeral: string; // only shown on the fallback card and read by screen readers, the art has it printed on
  description: string;
  major: boolean; // major arcana true, minor false
};

export const ARCANA: Arcana[] = [
  {
    image: "fool",
    name: "The Fool",
    numeral: "0",
    description:
      "New beginnings and infinite potential. The Fool steps forward without knowing the road, trusting that curiosity will carry the journey.",
    major: true,
  },
  {
    image: "magician",
    name: "The Magician",
    numeral: "I",
    description:
      "Skill, willpower and resourcefulness. The Magician has every tool laid out on the table and the focus to turn an idea into something real.",
    major: true,
  },
  {
    image: "priestess",
    name: "The High Priestess",
    numeral: "II",
    description:
      "Intuition and hidden knowledge. The High Priestess listens before acting and trusts what is understood beneath the surface.",
    major: true,
  },
  {
    image: "empress",
    name: "The Empress",
    numeral: "III",
    description:
      "Creation, abundance and care. The Empress nurtures whatever she touches until it grows into something greater.",
    major: true,
  },
  {
    image: "emperor",
    name: "The Emperor",
    numeral: "IV",
    description:
      "Structure, leadership and stability. The Emperor builds order out of chaos and takes responsibility for what he builds.",
    major: true,
  },
  {
    image: "hierophant",
    name: "The Hierophant",
    numeral: "V",
    description:
      "Tradition, mentorship and learning. The Hierophant passes on what works and respects the foundations others laid down.",
    major: true,
  },
  {
    image: "lovers",
    name: "The Lovers",
    numeral: "VI",
    description:
      "Connection and choice. The Lovers is about committing fully to a path and the harmony that comes from that commitment.",
    major: true,
  },
  {
    image: "chariot",
    name: "The Chariot",
    numeral: "VII",
    description:
      "Determination and victory. The Chariot pulls opposing forces in one direction through sheer discipline and drive.",
    major: true,
  },
  {
    image: "justice",
    name: "Justice",
    numeral: "VIII",
    description:
      "Fairness, truth and cause and effect. Justice weighs every decision carefully and owns the outcome.",
    major: true,
  },
  {
    image: "hermit",
    name: "The Hermit",
    numeral: "IX",
    description:
      "Introspection and the search for wisdom. The Hermit steps away from the noise to study deeply, then carries the lantern back for others.",
    major: true,
  },
  {
    image: "fortune",
    name: "Wheel of Fortune",
    numeral: "X",
    description:
      "Cycles, luck and turning points. The Wheel never stops, so the best move is to adapt quickly when it turns.",
    major: true,
  },
  {
    image: "strength",
    name: "Strength",
    numeral: "XI",
    description:
      "Courage, patience and quiet control. Strength tames the hard problem with persistence rather than force.",
    major: true,
  },
  {
    image: "hanged",
    name: "The Hanged Man",
    numeral: "XII",
    description:
      "Pause, surrender and a new perspective. The Hanged Man solves the problem by looking at it upside down.",
    major: true,
  },
  {
    image: "death",
    name: "Death",
    numeral: "XIII",
    description:
      "Endings that make room for transformation. Death clears away what no longer works so something better can replace it.",
    major: true,
  },
  {
    image: "temperance",
    name: "Temperance",
    numeral: "XIV",
    description:
      "Balance, moderation and blending. Temperance mixes opposing things in the right amounts until they work together.",
    major: true,
  },
  {
    image: "devil",
    name: "The Devil",
    numeral: "XV",
    description:
      "Temptation and attachment. The Devil is a reminder of the chains we choose, and that they can be taken off.",
    major: true,
  },
  {
    image: "tower",
    name: "The Tower",
    numeral: "XVI",
    description:
      "Sudden upheaval and revelation. The Tower falls when it was built on something shaky, leaving solid ground to rebuild on.",
    major: true,
  },
  {
    image: "star",
    name: "The Star",
    numeral: "XVII",
    description:
      "Hope, renewal and inspiration. The Star is the calm after the storm and the faith that the work will pay off.",
    major: true,
  },
  {
    image: "moon",
    name: "The Moon",
    numeral: "XVIII",
    description:
      "Illusion, uncertainty and the subconscious. The Moon asks you to keep walking even when the path is only half lit.",
    major: true,
  },
  {
    image: "sun",
    name: "The Sun",
    numeral: "XIX",
    description:
      "Joy, success and clarity. The Sun is everything going right and the energy to share it.",
    major: true,
  },
  {
    image: "judgement",
    name: "Judgement",
    numeral: "XX",
    description:
      "Reflection, reckoning and awakening. Judgement looks back honestly at the journey and answers the call to what comes next.",
    major: true,
  },
  {
    image: "world",
    name: "The World",
    numeral: "XXI",
    description:
      "Completion and wholeness. The World is the end of one journey, with everything learned along the way ready for the next.",
    major: true,
  },
];

// glob instead of plain imports so a missing image doesn't break the build
const backs = import.meta.glob<string>("../../assets/home/tarot/back.webp", {
  eager: true,
  import: "default",
});
export const CARD_BACK: string | undefined = Object.values(backs)[0];

// fronts are only fetched once a card is actually drawn
const fronts = import.meta.glob<string>(
  "../../assets/home/tarot/arcana/*.webp",
  { import: "default" },
);

// resolves to undefined when there's no image for that arcana (yet)
export async function loadArcanaImage(
  arcana: Arcana,
): Promise<string | undefined> {
  const load = fronts[`../../assets/home/tarot/arcana/${arcana.image}.webp`];
  if (!load) return undefined;
  try {
    return await load();
  } catch {
    return undefined;
  }
}

// draw `count` different arcana (partial Fisher-Yates so there's never a duplicate)
export function drawArcana(count: number): Arcana[] {
  const pool = [...ARCANA];
  const amount = Math.min(count, pool.length);
  for (let i = 0; i < amount; i++) {
    const pick = i + Math.floor(Math.random() * (pool.length - i));
    [pool[i], pool[pick]] = [pool[pick], pool[i]];
  }
  return pool.slice(0, amount);
}
