// modal for a revealed tarot card: the card flies in from the table to the centre,
// then slides aside to show that slot's skills and what the arcana means
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import ReactModal from "react-modal";
import { animate, motion, useMotionValue } from "motion/react";
import { BadgeList } from "../../../components/ui/Badge";
import type { Arcana } from "../../config/arcanaConfig";
import type { SkillGroup } from "../../config/homeConfig";
import { CardFront } from "./TarotCard";

type SkillCard = { title: string; groups: SkillGroup[] };

const CLOSE_MS = 200; // matches the .tarot-overlay opacity transition in index.css

function ModalBody({
  arcana,
  front,
  card,
  fromRect,
  reduced,
  onClose,
}: {
  arcana: Arcana;
  front?: string;
  card: SkillCard;
  fromRect: DOMRect | null;
  reduced: boolean;
  onClose: () => void;
}) {
  // "center": just the card, flying in. "side": card moved over, text showing
  const [phase, setPhase] = useState<"center" | "side">(
    reduced || !fromRect ? "side" : "center",
  );
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);

  // FLIP: the card renders where it should end up, gets moved back on top of the table card
  // before the first paint, then animates home
  useLayoutEffect(() => {
    const el = cardRef.current;
    if (phase !== "center" || !fromRect || !el) return;
    // reset first, StrictMode runs this twice and the second measure would include the offset
    x.set(0);
    y.set(0);
    scale.set(1);
    const to = el.getBoundingClientRect();
    x.set(fromRect.left + fromRect.width / 2 - (to.left + to.width / 2));
    y.set(fromRect.top + fromRect.height / 2 - (to.top + to.height / 2));
    scale.set(fromRect.width / to.width);

    const options = { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const };
    const controls = [
      animate(x, 0, options),
      animate(y, 0, options),
      animate(scale, 1, options),
    ];
    // hold in the centre for a moment before moving aside
    const timer = setTimeout(() => setPhase("side"), 550 + 250);
    return () => {
      clearTimeout(timer);
      controls.forEach((control) => control.stop());
    };
    // only on mount, fromRect never changes while the modal is open
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const side = phase === "side";
  // a card with one group named after itself (e.g. Hardware) doesn't need the sub heading
  const showCategories =
    card.groups.length > 1 || card.groups[0]?.category !== card.title;

  return (
    <div
      // overflow has to stay visible while the card flies in or it would get clipped
      className={`relative max-h-[90dvh] rounded-2xl border p-4 transition-colors duration-300 sm:p-6 motion-reduce:transition-none ${
        side
          ? "overflow-y-auto border-border bg-card text-card-foreground shadow-2xl"
          : "overflow-visible border-transparent bg-transparent"
      }`}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className={`absolute top-2 right-2 z-10 flex size-10 items-center justify-center rounded-full text-xl text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring ${side ? "" : "opacity-0"}`}
      >
        ✕
      </button>
      <div className="flex flex-col items-center justify-center gap-5 md:flex-row md:items-start md:gap-8">
        {/* outer div does the slide to the side, inner one the fly in, so the two transforms don't fight */}
        <motion.div layout={!reduced} className="shrink-0">
          <motion.div
            ref={cardRef}
            style={{ x, y, scale }}
            className="aspect-(--tarot-aspect) w-[min(60vw,16rem,calc(38dvh*var(--tarot-aspect)))] overflow-hidden rounded-xl shadow-xl md:w-[min(18rem,calc(70dvh*var(--tarot-aspect)))]"
          >
            <CardFront arcana={arcana} src={front} />
          </motion.div>
        </motion.div>

        {side && (
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="w-full min-w-0 flex-1 md:pr-8"
          >
            <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
              {arcana.numeral} · {arcana.name}
            </p>
            <h3 className="font-(family-name:--section-heading) text-2xl font-bold tracking-tight sm:text-3xl">
              {card.title} Skills
            </h3>
            <div className="mt-5 space-y-4">
              {card.groups.map((group) => (
                <section key={group.category}>
                  {showCategories && (
                    <h4 className="mb-2 text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                      {group.category}
                    </h4>
                  )}
                  <BadgeList items={group.items} />
                </section>
              ))}
            </div>
            <p className="mt-6 border-t border-border pt-4 text-sm text-muted-foreground italic sm:text-base">
              {arcana.description}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function ArcanaModal({
  isOpen,
  onClose,
  arcana,
  front,
  card,
  fromRect,
  reduced,
}: {
  isOpen: boolean;
  onClose: () => void;
  arcana: Arcana | null;
  front?: string;
  card: SkillCard | null;
  fromRect: DOMRect | null; // where the card is on the table (screen coords), the fly in starts there
  reduced: boolean;
}) {
  // html is the scroll container (same as MobileNav), lock it while the modal is open.
  // the padding fills in for the scrollbar so the page behind doesn't shift sideways
  useEffect(() => {
    if (!isOpen) return;
    const root = document.documentElement;
    const previous = {
      overflow: root.style.overflow,
      paddingRight: root.style.paddingRight,
    };
    const scrollbar = window.innerWidth - root.clientWidth;
    root.style.overflow = "hidden";
    if (scrollbar > 0) root.style.paddingRight = `${scrollbar}px`;
    return () => {
      root.style.overflow = previous.overflow;
      root.style.paddingRight = previous.paddingRight;
    };
  }, [isOpen]);

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      closeTimeoutMS={reduced ? 0 : CLOSE_MS}
      appElement={document.getElementById("root") ?? undefined}
      contentLabel={
        arcana && card ? `${arcana.name}: ${card.title} skills` : "Skills"
      }
      overlayClassName="tarot-overlay fixed inset-0 z-70 flex items-center justify-center p-3 sm:p-6"
      className="w-[min(92vw,56rem)] outline-none"
    >
      {arcana && card && (
        <ModalBody
          arcana={arcana}
          front={front}
          card={card}
          fromRect={fromRect}
          reduced={reduced}
          onClose={onClose}
        />
      )}
    </ReactModal>
  );
}
