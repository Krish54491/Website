import ToolsTransition from "../../components/transitions/ToolsTransition";
import SectionHeading from "../../components/ui/SectionHeading";
import ItemGrid from "../../components/ui/ItemGrid";
import placeholderImage from "../../assets/tools/thumbnails/Placeholder Image.png";
import { tools } from "../config/toolsConfig";

export default function Tools() {
  return (
    <ToolsTransition>
      <main className="section-page mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <SectionHeading as="h1" title="Tools" align="center" />
        <ItemGrid
          items={tools}
          emptyMessage="No Tools"
          fallbackImage={placeholderImage}
        />
      </main>
    </ToolsTransition>
  );
}
