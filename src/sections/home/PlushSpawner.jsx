// controls that hang off the pfp for spawning plushies:
// mouse gets a pull cord, touch gets a button the pfp's ring stretches into
import { useState } from "react";
import HandHint from "../../components/ui/HandHint";
import PullCord, { PULL_CORD_LENGTH } from "../../components/ui/PullCord";

const MIN_PULL = 2; // px, a short pull that never got far enough to spawn mid-pull still spawns one on release
const SPAWN_EVERY = 300; // ms between plushies while the cord is held all the way down

export default function PlushSpawner({ onSpawn }) {
  const [pulledOnce, setPulledOnce] = useState(false); // hides the hint after the first pull

  const handlePull = () => {
    onSpawn();
    setPulledOnce(true);
  };

  return (
    <>
      <PullCord
        onPull={handlePull}
        label="Spawn plush"
        minPull={MIN_PULL}
        repeatEvery={SPAWN_EVERY}
        className="absolute top-full left-1/2 hidden -translate-x-1/2 pointer-fine:block"
      >
        {/* sits just left of the bead with the arrow curling up to it (the right side runs off
            narrow screens), gone after the first pull */}
        <div
          className="pointer-events-none absolute right-[calc(50%+0.75rem)]"
          style={{ top: PULL_CORD_LENGTH + 8 }}
        >
          <HandHint
            arrow="up-right"
            className={`whitespace-nowrap transition-opacity duration-500 motion-reduce:transition-none ${pulledOnce ? "opacity-0" : ""}`}
          >
            pull me!
          </HandHint>
        </div>
      </PullCord>
      <RingButton onSpawn={onSpawn} />
    </>
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
          Spawn Plush
        </textPath>
      </text>
    </svg>
  );
}
