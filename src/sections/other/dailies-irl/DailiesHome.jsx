import SectionHeading from "../../../components/ui/SectionHeading";
import { Link } from "react-router-dom";
import DailiesLogo from "../../../assets/other/dailies-irl/Dailies IRL Logo.png";
export default function DailiesHome() {
  /*
    Quick description of Dailies IRL google Extension with links to it's
    - privacy policy
    - TOS
    - Store Page
    Colors will be hardcoded as it's not a main part of my website
    */
  return (
    <>
      <div>
        <SectionHeading
          title="Dailies IRL"
          subtitle="Add some randomized daily quests to your life!"
          className="mt-10"
          align="center"
        />
        <p className="w-11/12 md:w-3/4 lg:w-1/2 space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg whitespace-pre-line mx-auto text-center">
          Daily IRL is a Google Extension that lets you set tasks to be added
          randomly daily, weekly or even monthly. You can custom create
          categories that trigger based on the time period you set, and they can
          assign one task per trigger to over 9000! I made this as a custom
          appscript for just myself a couple years ago, and thought it was time
          to release it to the world. With Dailies IRL you can truly live the
          experience all gacha gamer want:
          <strong className="font-bold text-primary"> REAL LIFE DAILIES</strong>
          , of course instead of pulls you just improve yourself(lame).
        </p>
        <img
          src={DailiesLogo}
          className="flex justify-center mx-auto w-1/2 md:w-1/4"
        />
      </div>
      <div className="mx-auto mt-6 flex w-11/12 max-w-xl flex-wrap justify-center gap-4 sm:gap-6">
        <div className="w-full sm:w-[calc(50%-0.75rem)]">
          <Link
            to="/dailies-irl/privacy-policy"
            className="flex items-center justify-center "
          >
            <button className="bg-primary text-primary-foreground p-2 my-1 rounded-md hover:text-accent-foreground hover:bg-secondary w-full border-border border-2">
              Privacy Policy
            </button>
          </Link>
        </div>
        <div className="w-full sm:w-[calc(50%-0.75rem)]">
          <Link
            to="/dailies-irl/tos"
            className="flex items-center justify-center"
          >
            <button className="bg-primary text-primary-foreground p-2 my-1 rounded-md hover:text-accent-foreground hover:bg-secondary w-full border-border border-2">
              Terms Of Service
            </button>
          </Link>
        </div>
        <div className="w-full sm:w-[calc(50%-0.75rem)]">
          <a
            href="https://chromewebstore.google.com/detail/pneipnklblkocebmblmmnecchaangmbd?utm_source=item-share-cb"
            className="flex items-center justify-center"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="bg-primary text-primary-foreground p-2 my-1 rounded-md hover:text-accent-foreground hover:bg-secondary w-full border-border border-2">
              Google Extension Page
            </button>
          </a>
        </div>
      </div>
    </>
  );
}
