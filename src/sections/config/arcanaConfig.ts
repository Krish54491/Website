import type { Arcana } from "./types";

export const ARCANA: Arcana[] = [
  {
    image: () => import("../../assets/home/tarot/arcana/fool.webp"),
    name: "The Fool",
    numeral: "0",
    description:
      "New beginnings and infinite potential. The Fool steps forward without knowing the road, trusting that curiosity will carry the journey.",
    major: true,
  },
  {
    image: () => import("../../assets/home/tarot/arcana/magician.webp"),
    name: "The Magician",
    numeral: "I",
    description:
      "Skill, willpower and resourcefulness. The Magician has every tool laid out on the table and the focus to turn an idea into something real.",
    major: true,
  },
  {
    image: () => import("../../assets/home/tarot/arcana/priestess.webp"),
    name: "The High Priestess",
    numeral: "II",
    description:
      "Intuition and hidden knowledge. The High Priestess listens before acting and trusts what is understood beneath the surface.",
    major: true,
  },
  {
    image: () => import("../../assets/home/tarot/arcana/empress.webp"),
    name: "The Empress",
    numeral: "III",
    description:
      "Creation, abundance and care. The Empress nurtures whatever she touches until it grows into something greater.",
    major: true,
  },
  {
    image: () => import("../../assets/home/tarot/arcana/emperor.webp"),
    name: "The Emperor",
    numeral: "IV",
    description:
      "Structure, leadership and stability. The Emperor builds order out of chaos and takes responsibility for what he builds.",
    major: true,
  },
  {
    image: () => import("../../assets/home/tarot/arcana/hierophant.webp"),
    name: "The Hierophant",
    numeral: "V",
    description:
      "Tradition, mentorship and learning. The Hierophant passes on what works and respects the foundations others laid down.",
    major: true,
  },
  {
    image: () => import("../../assets/home/tarot/arcana/lovers.webp"),
    name: "The Lovers",
    numeral: "VI",
    description:
      "Connection and choice. The Lovers is about committing fully to a path and the harmony that comes from that commitment.",
    major: true,
  },
  {
    image: () => import("../../assets/home/tarot/arcana/chariot.webp"),
    name: "The Chariot",
    numeral: "VII",
    description:
      "Determination and victory. The Chariot pulls opposing forces in one direction through sheer discipline and drive.",
    major: true,
  },
  {
    image: () => import("../../assets/home/tarot/arcana/justice.webp"),
    name: "Justice",
    numeral: "VIII",
    description:
      "Fairness, truth and cause and effect. Justice weighs every decision carefully and owns the outcome.",
    major: true,
  },
  {
    image: () => import("../../assets/home/tarot/arcana/hermit.webp"),
    name: "The Hermit",
    numeral: "IX",
    description:
      "Introspection and the search for wisdom. The Hermit steps away from the noise to study deeply, then carries the lantern back for others.",
    major: true,
  },
  {
    image: () => import("../../assets/home/tarot/arcana/fortune.webp"),
    name: "Wheel of Fortune",
    numeral: "X",
    description:
      "Cycles, luck and turning points. The Wheel never stops, so the best move is to adapt quickly when it turns.",
    major: true,
  },
  {
    image: () => import("../../assets/home/tarot/arcana/strength.webp"),
    name: "Strength",
    numeral: "XI",
    description:
      "Courage, patience and quiet control. Strength tames the hard problem with persistence rather than force.",
    major: true,
  },
  {
    image: () => import("../../assets/home/tarot/arcana/hanged.webp"),
    name: "The Hanged Man",
    numeral: "XII",
    description:
      "Pause, surrender and a new perspective. The Hanged Man solves the problem by looking at it upside down.",
    major: true,
  },
  {
    image: () => import("../../assets/home/tarot/arcana/death.webp"),
    name: "Death",
    numeral: "XIII",
    description:
      "Endings that make room for transformation. Death clears away what no longer works so something better can replace it.",
    major: true,
  },
  {
    image: () => import("../../assets/home/tarot/arcana/temperance.webp"),
    name: "Temperance",
    numeral: "XIV",
    description:
      "Balance, moderation and blending. Temperance mixes opposing things in the right amounts until they work together.",
    major: true,
  },
  {
    image: () => import("../../assets/home/tarot/arcana/devil.webp"),
    name: "The Devil",
    numeral: "XV",
    description:
      "Temptation and attachment. The Devil is a reminder of the chains we choose, and that they can be taken off.",
    major: true,
  },
  {
    image: () => import("../../assets/home/tarot/arcana/tower.webp"),
    name: "The Tower",
    numeral: "XVI",
    description:
      "Sudden upheaval and revelation. The Tower falls when it was built on something shaky, leaving solid ground to rebuild on.",
    major: true,
  },
  {
    image: () => import("../../assets/home/tarot/arcana/star.webp"),
    name: "The Star",
    numeral: "XVII",
    description:
      "Hope, renewal and inspiration. The Star is the calm after the storm and the faith that the work will pay off.",
    major: true,
  },
  {
    image: () => import("../../assets/home/tarot/arcana/moon.webp"),
    name: "The Moon",
    numeral: "XVIII",
    description:
      "Illusion, uncertainty and the subconscious. The Moon asks you to keep walking even when the path is only half lit.",
    major: true,
  },
  {
    image: () => import("../../assets/home/tarot/arcana/sun.webp"),
    name: "The Sun",
    numeral: "XIX",
    description:
      "Joy, success and clarity. The Sun is everything going right and the energy to share it.",
    major: true,
  },
  {
    image: () => import("../../assets/home/tarot/arcana/judgement.webp"),
    name: "Judgement",
    numeral: "XX",
    description:
      "Reflection, reckoning and awakening. Judgement looks back honestly at the journey and answers the call to what comes next.",
    major: true,
  },
  {
    image: () => import("../../assets/home/tarot/arcana/world.webp"),
    name: "The World",
    numeral: "XXI",
    description:
      "Completion and wholeness. The World is the end of one journey, with everything learned along the way ready for the next.",
    major: true,
  },
];
