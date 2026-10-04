import GamesTransition from "../../components/transitions/GamesTransition";
import SectionHeading from "../../components/ui/SectionHeading";
import ItemGrid from "../../components/ui/ItemGrid";
import placeholderImage from "../../assets/tools/thumbnails/Placeholder Image.png";
import { games } from "../config/gamesConfig";

export default function Games() {
  return (
    <GamesTransition>
      <main className="section-page mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <SectionHeading as="h1" title="Games" align="center" />
        <ItemGrid
          items={games}
          emptyMessage="No Games"
          fallbackImage={placeholderImage}
        />
      </main>
    </GamesTransition>
  );
}
