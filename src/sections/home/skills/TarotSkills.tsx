// Skills section of the home page as a tarot reading:
// once the section scrolls into view a deck shuffles and deals 3 face-down cards, clicking one flips it
// to a random arcana and opens a modal with that slot's skills (see documents/Skills Frontend Changes.md)
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from "motion/react";
import SectionHeading from "../../../components/ui/SectionHeading";
import HandHint from "../../../components/ui/HandHint";
import { SKILL_CARDS } from "../../config/homeConfig";
import { ARCANA } from "../../config/homeConfig";
import type { Arcana } from "../../config/types";
import TarotCard from "./TarotCard";
import TarotDeck from "./TarotDeck";
import ArcanaModal from "./ArcanaModal";
import SkillsList from "./SkillsList";
import { DEAL_END, SHUFFLE_END, type TarotGeometry } from "./tarotMotion";

const COUNT = SKILL_CARDS.length;
const DEAL_SECONDS = 2.4; // the whole shuffle + deal, the phases inside it are in tarotMotion.ts
const ALL_SKILLS_ID = "all-skills";

// draw `count` different arcana (partial Fisher-Yates so there's never a duplicate)
function drawArcana(count: number): Arcana[] {
  const pool = [...ARCANA];
  const amount = Math.min(count, pool.length);
  for (let i = 0; i < amount; i++) {
    const pick = i + Math.floor(Math.random() * (pool.length - i));
    [pool[i], pool[pick]] = [pool[pick], pool[i]];
  }
  return pool.slice(0, amount);
}

export default function TarotSkills({
  onMove,
}: {
  onMove?: () => void; // called whenever the cards/deck move, FrontPage re-syncs the plushie obstacles with it
}) {
  const reduced = useReducedMotion() ?? false;

  const stage = useRef<HTMLDivElement>(null);
  const deckBox = useRef<HTMLDivElement>(null);
  const slots = useRef<(HTMLButtonElement | null)[]>([]);
  const geometry = useRef<TarotGeometry>({
    deckY: 0,
    dx: SKILL_CARDS.map(() => 0),
    dy: SKILL_CARDS.map(() => 0),
  });

  // the one value every animation reads from (phases are in tarotMotion.ts), animated 0 -> 1 to deal
  const p = useMotionValue(0);
  const tick = useMotionValue(0);

  const [dealt, setDealt] = useState(false);
  const busy = useRef(false); // re-deal animation running
  const pendingOpen = useRef<number | null>(null); // card waiting for its flip to finish before the modal opens

  const [draw, setDraw] = useState(() => drawArcana(COUNT));
  const [fronts, setFronts] = useState<(string | undefined)[]>([]);
  const [revealed, setRevealed] = useState(() => SKILL_CARDS.map(() => false));
  const [modal, setModal] = useState<{ slot: number; rect: DOMRect } | null>(
    null,
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const onMoveRef = useRef(onMove);
  useEffect(() => {
    onMoveRef.current = onMove;
  });

  // ---------- geometry ----------
  // cards and deck sit at their final (dealt) spots in the layout, this measures how far back
  // to the deck's starting spot each one has to be offset. offsetLeft/Top ignore transforms,
  // so it's safe to measure mid animation
  const measure = useCallback(() => {
    const box = deckBox.current;
    const cards = slots.current;
    if (!box || !cards[0]) return;
    const cardHeight = cards[0].offsetHeight;
    const deckX = box.offsetLeft + box.offsetWidth / 2;
    // the full size deck starts with its top edge on the top of its box
    const deckStartY = box.offsetTop + cardHeight / 2;
    geometry.current = {
      deckY: deckStartY - (box.offsetTop + box.offsetHeight / 2),
      dx: cards.map((el) =>
        el ? deckX - (el.offsetLeft + el.offsetWidth / 2) : 0,
      ),
      dy: cards.map((el) =>
        el ? deckStartY - (el.offsetTop + el.offsetHeight / 2) : 0,
      ),
    };
    tick.set(tick.get() + 1);
  }, [tick]);

  useLayoutEffect(() => {
    measure();
    if (!stage.current) return;
    const observer = new ResizeObserver(measure);
    observer.observe(stage.current);
    return () => observer.disconnect();
  }, [measure]);

  // ---------- deal ----------
  // plays once, when the top of the stage gets about a third of the way up the screen.
  // with reduced motion the cards are just there
  const inView = useInView(stage, { once: true, margin: "0px 0px -35% 0px" });
  useEffect(() => {
    if (reduced) {
      p.set(1);
      setDealt(true);
      return;
    }
    if (!inView) return;
    const controls = animate(p, 1, { duration: DEAL_SECONDS, ease: "linear" }); // each phase eases itself
    void controls.then(() => setDealt(true));
    return () => controls.stop();
  }, [inView, reduced, p]);

  useEffect(() => {
    if (dealt) onMoveRef.current?.();
  }, [dealt]);

  // plushies treat the cards and deck as obstacles, keep those in step with the animation
  useMotionValueEvent(p, "change", () => onMoveRef.current?.());

  // ---------- cards ----------
  // fetch the fronts of the drawn cards ahead of time so the flip never shows an empty face
  useEffect(() => {
    let cancelled = false;
    void Promise.all(draw.map((arcana) => arcana.image())).then((modules) => {
      if (cancelled) return;
      const urls = modules.map((module) => module.default);
      urls.forEach((url) => {
        new Image().src = url;
      });
      setFronts(urls);
    });
    return () => {
      cancelled = true;
    };
  }, [draw]);

  const openModal = (slot: number) => {
    const el = slots.current[slot];
    if (!el) return;
    setModal({ slot, rect: el.getBoundingClientRect() });
    setModalOpen(true);
  };

  const selectCard = (slot: number) => {
    if (!dealt || busy.current) return;
    if (revealed[slot]) {
      openModal(slot);
      return;
    }
    setRevealed((prev) => prev.map((value, i) => (i === slot ? true : value)));
    // the modal opens once the flip is done (handleFlipped), there's no flip with reduced motion
    if (reduced) openModal(slot);
    else pendingOpen.current = slot;
  };

  const handleFlipped = (slot: number) => {
    if (pendingOpen.current !== slot) return;
    pendingOpen.current = null;
    openModal(slot);
  };

  // gather the cards back into the deck, swap in a new hand while they're hidden, deal again
  const redeal = async () => {
    if (!dealt || busy.current || modalOpen) return;
    busy.current = true;
    pendingOpen.current = null;
    if (!reduced)
      await animate(p, SHUFFLE_END, { duration: 0.7, ease: "easeInOut" });
    setFronts([]);
    setDraw(drawArcana(COUNT));
    setRevealed(SKILL_CARDS.map(() => false));
    if (!reduced) await animate(p, 1, { duration: 1.1, ease: "easeInOut" });
    busy.current = false;
    onMoveRef.current?.();
  };

  const toggleAll = () => setShowAll((prev) => !prev);

  const hintOpacity = useTransform(p, [DEAL_END, 1], [0, 1]);
  const open = modal !== null && modalOpen ? modal.slot : null;

  return (
    <section id="skills" className="tarot-table py-10 sm:py-14">
      <div ref={stage} className="relative flex flex-col items-center">
        <SectionHeading title="Skills" className="w-full pt-2" />
        <TarotDeck
          p={p}
          tick={tick}
          geometry={geometry}
          dealt={dealt}
          onRedeal={() => void redeal()}
          boxRef={deckBox}
        />
        <div className="mt-4 flex justify-center gap-2 sm:mt-6 sm:gap-6">
          {SKILL_CARDS.map((card, slot) => (
            <TarotCard
              key={card.title}
              index={slot}
              count={COUNT}
              p={p}
              tick={tick}
              geometry={geometry}
              arcana={draw[slot]}
              front={fronts[slot]}
              title={card.title}
              revealed={revealed[slot]}
              dealt={dealt}
              hidden={open === slot}
              reduced={reduced}
              onSelect={() => selectCard(slot)}
              onFlipped={() => handleFlipped(slot)}
              slotRef={(el) => {
                slots.current[slot] = el;
              }}
            />
          ))}
        </div>
        <div className="relative mt-6 flex w-full flex-col items-center gap-y-2 text-center text-sm text-muted-foreground">
          {/* fades in once the cards are dealt, and goes away after the first card is flipped.
                below lg it sits under the row with the arrow starting at the middle card's left edge,
                on lg+ there's empty space right of the row so it moves out there and points at the last card */}
          <motion.div
            style={{ opacity: hintOpacity }}
            className="self-end sm:self-center max-lg:-mt-2 lg:whitespace-nowrap pl-[calc(50%-var(--tarot-w)/2+0.5rem)] lg:absolute lg:bottom-[calc(100%+1.5rem+var(--tarot-h)*0.15)] lg:left-[calc(50%+var(--tarot-w)*1.5+1.75rem)] lg:pl-0"
          >
            <HandHint
              className={`transition-opacity duration-500 motion-reduce:transition-none ${revealed.some(Boolean) ? "opacity-0" : ""}`}
            >
              click on a card to
              <br />
              reveal its true form
            </HandHint>
          </motion.div>
          <button
            type="button"
            onClick={toggleAll}
            aria-expanded={showAll}
            aria-controls={ALL_SKILLS_ID}
            className="cursor-pointer rounded-sm underline underline-offset-4 transition-colors duration-200 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring dark:hover:text-primary"
          >
            {showAll ? "hide all skills" : "view all skills"}
          </button>
        </div>
        {/* TODO: tarot reading goes here once all 3 cards are revealed */}
      </div>

      {showAll && (
        <div className="mt-8 sm:mt-10">
          <SkillsList id={ALL_SKILLS_ID} />
        </div>
      )}

      <ArcanaModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        arcana={modal ? draw[modal.slot] : null}
        front={modal ? fronts[modal.slot] : undefined}
        card={modal ? SKILL_CARDS[modal.slot] : null}
        fromRect={modal ? modal.rect : null}
        reduced={reduced}
      />
    </section>
  );
}
