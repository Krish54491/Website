/**
 * Pull cord that hangs off something and calls `onPull` when it's tugged down.
 * Adapted from kokonutui's Pull Cord (the lamp, on/off switch and label card are taken out):
 * @author: @dorianbaffier
 * @version: 1.0.0
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 *
 * The cord is a verlet rope: a chain of points that keep their velocity + gravity each step and get
 * pulled back to a fixed distance from their neighbours. Grab anywhere on it and drag, it stretches a
 * bit past its length with growing resistance, and the downward part of that stretch is the "pull".
 * The svg attributes are set directly, so nothing re-renders while it swings.
 *
 * The component is a box PULL_CORD_WIDTH wide with the cord hanging from the middle of its top edge,
 * position it with `className` (e.g. absolute top-full left-1/2 -translate-x-1/2).
 * `children` are drawn on top of the box, the bead hangs at PULL_CORD_LENGTH px from the top
 */
import {
  type PointerEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const LINKS = 18;
const LINK = 10;
export const PULL_CORD_LENGTH = LINKS * LINK;
// How far past its length the cord has to be pulled to count, and how far it can stretch at all.
// The stretch flattens out, so it slows down instead of stopping at a wall.
const CLICK_PULL = 22;
const MAX_STRETCH = 34;
// held stretched almost all the way it keeps calling onPull (if repeatEvery is set)
const HOLD_PULL = MAX_STRETCH * 0.8;
export const PULL_CORD_WIDTH = 96;
const HEIGHT = PULL_CORD_LENGTH + MAX_STRETCH + 32; // room for the stretched cord + bead
const ANCHOR = { x: PULL_CORD_WIDTH / 2, y: 0 };
// Simulation, in px and seconds. A fixed step keeps the chain stable on any refresh rate.
const STEP = 1 / 120;
const GRAVITY = 1400;
const DAMPING = 0.992;
// Fastest a link may move in one step. Letting go of a stretched cord would otherwise fling it up.
const MAX_SPEED = 4;
// A cord has a little stiffness: two links apart, points never get closer than this,
// so it bends in curves instead of folding into kinks.
const BEND_MIN = LINK * 1.9;
const BEND_STIFFNESS = 0.8;
const ITERATIONS = 14;
// Below this movement per step for a while, the chain is at rest and the loop stops.
const REST_EPSILON = 0.015;
const REST_STEPS = 24;

type Chain = { xs: Float64Array; ys: Float64Array; held: number };

function damp(distance: number, max: number) {
  return max * (1 - Math.exp(-distance / max));
}

function haptic() {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(8);
  }
}

// Move points a and b towards `length` apart. A bend constraint only ever
// pushes apart, and only part of the way each pass: stiff, not rigid.
function relax(
  chain: Chain,
  a: number,
  b: number,
  length: number,
  bend: boolean,
) {
  const { xs, ys, held } = chain;
  const aFixed = a === 0 || a === held;
  const bFixed = b === held;
  if (aFixed && bFixed) return;
  const dx = xs[b] - xs[a];
  const dy = ys[b] - ys[a];
  const dist = Math.hypot(dx, dy) || 0.0001;
  if (bend && dist >= length) return;
  const diff = ((dist - length) / dist) * (bend ? BEND_STIFFNESS : 1);
  let wa = 0.5;
  if (aFixed) wa = 0;
  else if (bFixed) wa = 1;
  xs[a] += dx * diff * wa;
  ys[a] += dy * diff * wa;
  xs[b] -= dx * diff * (1 - wa);
  ys[b] -= dy * diff * (1 - wa);
}

// A smooth curve through the chain's points.
function cordPath(xs: Float64Array, ys: Float64Array) {
  let d = `M${xs[0].toFixed(2)} ${ys[0].toFixed(2)}`;
  for (let i = 1; i < xs.length - 1; i++) {
    const mx = (xs[i] + xs[i + 1]) / 2;
    const my = (ys[i] + ys[i + 1]) / 2;
    d += ` Q${xs[i].toFixed(2)} ${ys[i].toFixed(2)} ${mx.toFixed(2)} ${my.toFixed(2)}`;
  }
  const n = xs.length - 1;
  d += ` L${xs[n].toFixed(2)} ${ys[n].toFixed(2)}`;
  return d;
}

function restingChain() {
  const xs = new Float64Array(LINKS + 1);
  const ys = new Float64Array(LINKS + 1);
  for (let i = 0; i <= LINKS; i++) {
    xs[i] = ANCHOR.x;
    ys[i] = ANCHOR.y + i * LINK;
  }
  return { xs, ys };
}

const REST = restingChain();
const REST_PATH = cordPath(REST.xs, REST.ys);

// The hand can pull the cord a little past its length, with growing
// resistance, but never pull it off the anchor.
function reach(index: number, x: number, y: number) {
  const dx = x - ANCHOR.x;
  const dy = y - ANCHOR.y;
  const dist = Math.hypot(dx, dy) || 0.0001;
  const length = index * LINK;
  if (dist <= length) return { x, y, pull: 0 };
  const allowed = length + damp(dist - length, MAX_STRETCH);
  return {
    x: ANCHOR.x + (dx / dist) * allowed,
    y: ANCHOR.y + (dy / dist) * allowed,
    pull: dy > 0 ? (allowed - length) * (dy / dist) : 0,
  };
}

export default function PullCord({
  onPull,
  label,
  minPull,
  repeatEvery,
  className = "",
  children,
}: {
  onPull: () => void; // once per pull, as soon as it's pulled far enough (not on release)
  label: string; // accessible name of the keyboard button
  minPull?: number; // px, a pull that never got far enough still calls onPull on release if it went this far
  repeatEvery?: number; // ms, keeps calling onPull while it's held stretched almost all the way
  className?: string;
  children?: ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  const [grabbing, setGrabbing] = useState(false);

  const svgRef = useRef<SVGSVGElement>(null);
  const cordRef = useRef<SVGPathElement>(null);
  const hitRef = useRef<SVGPathElement>(null);
  const beadRef = useRef<SVGGElement>(null);

  const sim = useRef({
    xs: Float64Array.from(REST.xs),
    ys: Float64Array.from(REST.ys),
    pxs: Float64Array.from(REST.xs),
    pys: Float64Array.from(REST.ys),
    raf: 0,
    last: 0,
    carry: 0,
    still: 0,
    // The link being held, and where the hand is holding it.
    held: -1,
    targetX: 0,
    targetY: 0,
    // where on the held link it was grabbed, so the cord doesn't jump to the pointer
    offsetX: 0,
    offsetY: 0,
    armed: true,
    pulled: false, // onPull already fired during this pull
    furthest: 0, // most it's been pulled during this pull
    timer: 0,
    reduceMotion: false,
  });

  // Read from pointer handlers, which outlive the render they came from.
  const onPullRef = useRef(onPull);
  useEffect(() => {
    onPullRef.current = onPull;
  });

  const draw = useCallback(() => {
    const { xs, ys } = sim.current;
    const d = cordPath(xs, ys);
    cordRef.current?.setAttribute("d", d);
    hitRef.current?.setAttribute("d", d);
    const n = LINKS;
    const angle =
      (Math.atan2(xs[n] - xs[n - 1], ys[n] - ys[n - 1]) * 180) / Math.PI;
    beadRef.current?.setAttribute(
      "transform",
      `translate(${xs[n].toFixed(2)} ${ys[n].toFixed(2)}) rotate(${(-angle).toFixed(2)})`,
    );
  }, []);

  // Verlet: each free link keeps the velocity it had last step, plus
  // gravity. The held link goes to the hand.
  const integrate = useCallback(() => {
    const s = sim.current;
    const { xs, ys, pxs, pys } = s;
    let moved = 0;
    for (let i = 1; i <= LINKS; i++) {
      if (i === s.held) continue;
      let vx = (xs[i] - pxs[i]) * DAMPING;
      let vy = (ys[i] - pys[i]) * DAMPING;
      const speed = Math.hypot(vx, vy);
      if (speed > MAX_SPEED) {
        vx *= MAX_SPEED / speed;
        vy *= MAX_SPEED / speed;
      }
      pxs[i] = xs[i];
      pys[i] = ys[i];
      xs[i] += vx;
      ys[i] += vy + GRAVITY * STEP * STEP;
      moved = Math.max(moved, Math.abs(vx) + Math.abs(vy));
    }
    if (s.held > 0) {
      const i = s.held;
      moved = Math.max(
        moved,
        Math.abs(s.targetX - xs[i]) + Math.abs(s.targetY - ys[i]),
      );
      pxs[i] = xs[i];
      pys[i] = ys[i];
      xs[i] = s.targetX;
      ys[i] = s.targetY;
    }
    return moved;
  }, []);

  // Pull each link back to its length, and keep points two links apart from
  // folding too close. The anchor and the held link don't move; everything
  // else shares the correction.
  const constrain = useCallback(() => {
    const s = sim.current;
    for (let k = 0; k < ITERATIONS; k++) {
      for (let i = 0; i < LINKS; i++) relax(s, i, i + 1, LINK, false);
      for (let i = 0; i + 2 <= LINKS; i++) relax(s, i, i + 2, BEND_MIN, true);
    }
  }, []);

  const step = useCallback(() => {
    const moved = integrate();
    constrain();
    return moved;
  }, [integrate, constrain]);

  const tick = useCallback(
    (now: number) => {
      const s = sim.current;
      s.raf = 0;
      const elapsed = s.last ? Math.min((now - s.last) / 1000, 0.05) : STEP;
      s.last = now;
      s.carry += elapsed;
      let moved = 0;
      while (s.carry >= STEP) {
        moved = Math.max(moved, step());
        s.carry -= STEP;
      }
      draw();
      s.still = moved < REST_EPSILON ? s.still + 1 : 0;
      if (s.held > 0 || s.still < REST_STEPS) {
        s.raf = requestAnimationFrame(tick);
      } else {
        s.last = 0;
      }
    },
    [draw, step],
  );

  const wake = useCallback(() => {
    const s = sim.current;
    s.still = 0;
    if (!s.raf) s.raf = requestAnimationFrame(tick);
  }, [tick]);

  useEffect(() => {
    const s = sim.current;
    s.reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    return () => {
      cancelAnimationFrame(s.raf);
      clearInterval(s.timer);
    };
  }, []);

  const localPoint = (event: PointerEvent) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    // The drawing is laid out in its own units; map the pointer into them.
    return {
      x: ((event.clientX - rect.left) / rect.width) * PULL_CORD_WIDTH,
      y: ((event.clientY - rect.top) / rect.height) * HEIGHT,
    };
  };

  const stopRepeat = () => {
    clearInterval(sim.current.timer);
    sim.current.timer = 0;
  };

  const handlePointerDown = (event: PointerEvent<SVGElement>) => {
    const s = sim.current;
    if (s.held > 0) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.preventDefault();
    const point = localPoint(event);
    // Hold the link nearest to where the cord was grabbed.
    let nearest = LINKS;
    let best = Number.POSITIVE_INFINITY;
    for (let i = 1; i <= LINKS; i++) {
      const d = Math.hypot(s.xs[i] - point.x, s.ys[i] - point.y);
      if (d < best) {
        best = d;
        nearest = i;
      }
    }
    // captured on the cord/bead itself, the svg doesn't take pointer events so it won't block what's behind it
    event.currentTarget.setPointerCapture(event.pointerId);
    s.held = nearest;
    s.targetX = s.xs[nearest];
    s.targetY = s.ys[nearest];
    s.offsetX = point.x - s.xs[nearest];
    s.offsetY = point.y - s.ys[nearest];
    s.armed = true;
    s.pulled = false;
    s.furthest = 0;
    setGrabbing(true);
    wake();
  };

  const handlePointerMove = (event: PointerEvent<SVGSVGElement>) => {
    const s = sim.current;
    if (s.held < 0) return;
    const point = localPoint(event);
    const target = reach(s.held, point.x - s.offsetX, point.y - s.offsetY);
    s.targetX = target.x;
    s.targetY = target.y;
    s.furthest = Math.max(s.furthest, target.pull);
    // Fires once per pull, as soon as the cord is pulled far enough,
    // not on release. It re-arms when the cord eases back.
    if (s.armed && target.pull > CLICK_PULL) {
      s.armed = false;
      s.pulled = true;
      haptic();
      onPullRef.current();
    } else if (!s.armed && target.pull < CLICK_PULL * 0.4) {
      s.armed = true;
    }
    if (repeatEvery && target.pull > HOLD_PULL && !s.timer) {
      s.timer = window.setInterval(() => onPullRef.current(), repeatEvery);
    } else if (target.pull <= HOLD_PULL && s.timer) {
      stopRepeat();
    }
    wake();
  };

  const handlePointerUp = () => {
    const s = sim.current;
    if (s.held < 0) return;
    if (minPull !== undefined && !s.pulled && s.furthest >= minPull)
      onPullRef.current();
    s.held = -1;
    stopRepeat();
    setGrabbing(false);
    if (s.reduceMotion) {
      // No swinging back: the cord drops straight to rest.
      s.xs.set(REST.xs);
      s.ys.set(REST.ys);
      s.pxs.set(REST.xs);
      s.pys.set(REST.ys);
      draw();
      return;
    }
    wake();
  };

  const handleKeyPull = () => {
    onPullRef.current();
    const s = sim.current;
    if (!s.reduceMotion) {
      // A small tug on the bead, so the cord answers the key too.
      s.pys[LINKS] = s.ys[LINKS] - 5;
      wake();
    }
  };

  const grab = {
    onPointerDown: handlePointerDown,
    // stops anything listening on the page (like matter's mouse) from also reacting to the press
    onMouseDown: (event: { stopPropagation: () => void }) =>
      event.stopPropagation(),
  };

  return (
    <div
      className={`select-none ${className}`}
      style={{ width: PULL_CORD_WIDTH, height: HEIGHT }}
    >
      <svg
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 touch-none overflow-visible ${grabbing ? "cursor-grabbing" : ""}`}
        width={PULL_CORD_WIDTH}
        height={HEIGHT}
        viewBox={`0 0 ${PULL_CORD_WIDTH} ${HEIGHT}`}
        ref={svgRef}
        onLostPointerCapture={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <path
          ref={cordRef}
          d={REST_PATH}
          fill="none"
          strokeLinecap="round"
          strokeWidth={2.5}
          className="stroke-primary"
        />
        {/* A wider invisible copy of the cord, so it's easy to grab. */}
        <path
          ref={hitRef}
          d={REST_PATH}
          fill="none"
          stroke="transparent"
          strokeWidth={24}
          className={`[pointer-events:stroke] ${grabbing ? "" : "cursor-grab"}`}
          {...grab}
        />
        <g
          ref={beadRef}
          transform={`translate(${ANCHOR.x} ${ANCHOR.y + PULL_CORD_LENGTH})`}
          className={`group [pointer-events:all] ${grabbing ? "" : "cursor-grab"}`}
          {...grab}
        >
          <circle fill="transparent" r={22} cy={12} />
          {focused && (
            <rect
              className="fill-none stroke-ring"
              x={-11}
              y={-3}
              width={22}
              height={34}
              rx={11}
              strokeWidth={2}
            />
          )}
          <rect
            className="fill-primary transition-[fill] duration-200 group-hover:fill-secondary"
            x={-7}
            y={1}
            width={14}
            height={26}
            rx={7}
          />
        </g>
      </svg>

      <button
        type="button"
        aria-label={label}
        className="sr-only"
        onClick={handleKeyPull}
        onFocus={(event) =>
          setFocused(event.currentTarget.matches(":focus-visible"))
        }
        onBlur={() => setFocused(false)}
      />
      {children}
    </div>
  );
}
