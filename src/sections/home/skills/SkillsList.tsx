// plain list of every skill group, shown by the "view all skills" link under the tarot cards
import InfoPanel from "../../../components/ui/InfoPanel";
import { BadgeList } from "../../../components/ui/Badge";
import { SKILLS } from "../../config/homeConfig";

export default function SkillsList({ id }: { id?: string }) {
  return (
    // flex-wrap instead of grid so a partial last row gets centered
    <div id={id} className="flex flex-wrap justify-center gap-4 sm:gap-6">
      {SKILLS.map((group) => (
        <div
          key={group.category}
          className="w-9/10 sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]"
          data-physics="rect"
        >
          <InfoPanel title={group.category} className="h-full">
            <BadgeList items={group.items} />
          </InfoPanel>
        </div>
      ))}
    </div>
  );
}
