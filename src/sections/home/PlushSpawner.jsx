// controls that hang off the pfp for spawning plushies:
// mouse gets a pull chain, touch gets a button the pfp's ring stretches into
import { useRef, useState } from "react";

const MAX_PULL = 80; // px the handle can be pulled down
const SPAWN_EVERY = 300; // ms between plushies while pulled down

export default function PlushSpawner({ onSpawn }) {
  return (
    <>
      <PullChain onSpawn={onSpawn} />
      <RingButton onSpawn={onSpawn} />
    </>
  );
}

function PullChain({ onSpawn }) {
  const [pull, setPull] = useState(0);
  const startY = useRef(null);
  const spawnTimer = useRef(null);

  const handlePointerDown = (event) => {
    // keeps getting move/up events even if the cursor slides off the handle
    event.currentTarget.setPointerCapture(event.pointerId);
    startY.current = event.clientY;
  };
  const handlePointerMove = (event) => {
    if (startY.current === null) return;
    const amount = Math.min(
      Math.max(event.clientY - startY.current, 0),
      MAX_PULL,
    );
    setPull(amount);
    // pulled all the way down, keep spawning until released
    if (amount === MAX_PULL && !spawnTimer.current)
      spawnTimer.current = setInterval(onSpawn, SPAWN_EVERY);
  };
  const handleRelease = () => {
    startY.current = null;
    setPull(0);
    clearInterval(spawnTimer.current);
    spawnTimer.current = null;
  };

  return (
    <div className="absolute top-full left-1/2 hidden -translate-x-1/2 flex-col items-center pointer-fine:flex">
      {/* chain, pull is the only runtime value so it's passed in as a css variable */}
      <div
        className="h-[calc(1.5rem+var(--pull))] w-1 bg-[repeating-linear-gradient(to_bottom,var(--color-primary)_0_6px,transparent_6px_10px)] transition-[height] duration-200"
        style={{ "--pull": `${pull}px` }}
      />
      {/* handle, a hollow semicircle, the chain hangs from the middle of its flat top line */}
      <div
        className="h-5 w-10 cursor-grab touch-none rounded-b-full border-4 border-primary select-none active:cursor-grabbing"
        // stops matter's mouse (on body) from grabbing plushies while pulling
        onMouseDown={(event) => event.stopPropagation()}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handleRelease}
        onPointerCancel={handleRelease}
      />
    </div>
  );
}

// a thick arc hanging under the bottom of the pfp, its top edge overlaps the pfp's ring
// so the ring looks like it widens into the button. viewBox matches the pfp so 50,50 is
// its centre and 50 is its radius. the photo inside the ring ends around 48, so arc radius
// 52.5 with stroke 12 (46.5 to 58.5) puts 1.5/12 = 1/8 of the button over the photo.
// the text is about 42 long, the round ends add 6 each side, so a 54 long arc
// (about 58 degrees around the bottom) leaves about 12 of padding past the text
function RingButton({ onSpawn }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className="pointer-events-none absolute inset-0 hidden overflow-visible pointer-coarse:block group"
    >
      <path
        d="M 22.6 94.8 A 56 56 0 0 0 77.4 94.8"
        className={`pointer-events-auto border-border fill-none stroke-primary group-active:stroke-secondary stroke-12 [stroke-linecap:round]`}
        onClick={onSpawn}
      />
      {/* invisible longer arc for the text to sit on, text past the end of its path
          gets cut off, and the button's arc is shorter than the text */}
      <path
        id="spawn-arc"
        d="M 7.1 82.0 A 56 56 0 0 0 92.9 82.0"
        className="fill-none"
      />
      <text
        className={`fill-primary-foreground group-active:fill-secondary-foreground text-[7px] font-semibold [dominant-baseline:middle]`}
      >
        <textPath
          href="#spawn-arc"
          startOffset="50%"
          className="[text-anchor:middle]"
        >
          Spawn plush
        </textPath>
      </text>
    </svg>
  );
}
