// Skills section of the home page as a tarot reading:
// a deck shuffles and deals 3 face-down cards as you scroll, clicking one flips it to a random
// arcana and opens a modal with that slot's skills (see documents/Skills Frontend Changes.md)
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
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import SectionHeading from "../../../components/ui/SectionHeading";
import { SKILL_CARDS } from "../../config/homeConfig";
import { drawArcana, loadArcanaImage } from "../../config/arcanaConfig";
import TarotCard from "./TarotCard";
import TarotDeck from "./TarotDeck";
import ArcanaModal from "./ArcanaModal";
import SkillsList from "./SkillsList";
import { DEAL_END, SHUFFLE_END, type TarotGeometry } from "./tarotMotion";

const COUNT = SKILL_CARDS.length;
const PIN_SCROLL = "120vh"; // how much scrolling the shuffle + deal is spread over while pinned
const LATCH_AT = 0.98; // once the scroll gets this far the cards stay dealt for good
const ALL_SKILLS_ID = "all-skills";

export default function TarotSkills({
  onMove,
}: {
  onMove?: () => void; // called whenever the cards/deck move, FrontPage re-syncs the plushie obstacles with it
}) {
  const reduced = useReducedMotion() ?? false;

  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const deckBox = useRef<HTMLDivElement>(null);
  const slots = useRef<(HTMLButtonElement | null)[]>([]);
  const geometry = useRef<TarotGeometry>({
    deckY: 0,
    dx: SKILL_CARDS.map(() => 0),
    dy: SKILL_CARDS.map(() => 0),
  });

  // the one value every animation reads from (phases are in tarotMotion.ts).
  // follows the scroll until the deal latches, after that only a re-deal moves it
  const p = useMotionValue(0);
  const tick = useMotionValue(0);

  const [dealt, setDealt] = useState(false);
  const dealtRef = useRef(false); // same as `dealt` but readable inside the scroll listener
  const stageTopBeforeLatch = useRef<number | null>(null);
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

  // while pinned the stage sticks under the nav and the spacer below it gives the scroll its room
  const pinned = !dealt && !reduced;

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

  // ---------- scroll ----------
  const latch = useCallback(() => {
    if (dealtRef.current) return;
    dealtRef.current = true;
    stageTopBeforeLatch.current =
      stage.current?.getBoundingClientRect().top ?? null;
    p.set(1);
    setDealt(true);
  }, [p]);

  const { scrollYProgress } = useScroll({
    target: track,
    offset: ["start 0.2", "end end"],
  });
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (dealtRef.current || reduced) return;
    p.set(value);
    if (value >= LATCH_AT) latch();
  });

  // reduced motion: no pinning or scrubbing, the cards are just there
  useEffect(() => {
    if (reduced) latch();
  }, [reduced, latch]);

  // latching removes the spacer and the sticky, which would make the page jump.
  // scroll by however far the stage moved so it stays put on screen
  useLayoutEffect(() => {
    if (!dealt) return;
    const before = stageTopBeforeLatch.current;
    stageTopBeforeLatch.current = null;
    if (before !== null && stage.current && !reduced) {
      const after = stage.current.getBoundingClientRect().top;
      if (after !== before)
        window.scrollBy({ top: after - before, behavior: "instant" });
    }
    measure();
    onMoveRef.current?.();
  }, [dealt, reduced, measure]);

  // plushies treat the cards and deck as obstacles, keep those in step with the animation
  useMotionValueEvent(p, "change", () => onMoveRef.current?.());

  // ---------- cards ----------
  // fetch the fronts of the drawn cards ahead of time so the flip never shows an empty face
  useEffect(() => {
    let cancelled = false;
    void Promise.all(draw.map(loadArcanaImage)).then((urls) => {
      if (cancelled) return;
      urls.forEach((url) => {
        if (url) new Image().src = url;
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

  const toggleAll = () => {
    // the list sits below the pinned area, so skip the animation rather than make them scroll through it
    latch();
    setShowAll((prev) => !prev);
  };

  const hintOpacity = useTransform(p, [DEAL_END, 1], [0, 1]);
  const open = modal !== null && modalOpen ? modal.slot : null;

  return (
    <section id="skills" className="tarot-table py-10 sm:py-14">
      <div ref={track}>
        <div
          ref={stage}
          className={`flex flex-col items-center ${pinned ? "sticky top-16 lg:top-20" : "relative"}`}
        >
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
          <div className="mt-5 flex flex-col items-center gap-x-2 gap-y-1 text-center text-sm text-muted-foreground sm:flex-row">
            <motion.p style={{ opacity: hintOpacity }}>
              Click on a card to reveal its true form
            </motion.p>
            <button
              type="button"
              onClick={toggleAll}
              aria-expanded={showAll}
              aria-controls={ALL_SKILLS_ID}
              className="cursor-pointer rounded-sm underline underline-offset-4 transition-colors duration-200 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring dark:hover:text-primary"
            >
              {showAll ? "hide all skills" : "or view all skills"}
            </button>
          </div>
          {/* TODO: tarot reading goes here once all 3 cards are revealed */}
        </div>
        {pinned && <div aria-hidden="true" style={{ height: PIN_SCROLL }} />}
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
