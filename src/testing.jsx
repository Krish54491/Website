import { Link } from "react-router-dom";
import { useState } from "react";

import jolteon from "./assets/frontpage/Background-Jolteon.png";
import mechanoid from "./assets/frontpage/Background-Mechanoid.png";
import gamecube from "./assets/frontpage/Background-Gamecube.png";
// this file is for testing purposes only, it is not part of the main application

// FrontPage is designed to be the main page for desktop users
// It is not responsive and will not work well on mobile devices, mobile will use current Nav setup
// tablets will use the current Nav setup as well, but will have a different layout than mobile, having the current desktop view Nav
// -- still have to add transitions for the parts on click to zoom and show the label for the section, and then on click again to go to the page
// -- get 2 more images for tools and hackathons(might just put other projects)
// -- still have to add ways to get back to this main page from the other pages, which will be unique per page(e.g. for games, it will be a gamecube power button, for tools, an undo button(pending), for account, a robot wire or pulley , etc.)
export default function FrontPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkLoggedIn, setCheckLoggedIn] = useState(false);
  if (localStorage.getItem("loggedIn") === "true" && checkLoggedIn === false) {
    setLoggedIn(true);
    setCheckLoggedIn(true);
  } else if (
    localStorage.getItem("loggedIn") !== "true" &&
    checkLoggedIn === false
  ) {
    setLoggedIn(false);
    setCheckLoggedIn(true);
  }

  const HomeObject = ({ image, label, link, position, special }) => {
    return (
      <Link to={link}>
        <img
          src={image}
          alt={label}
          className={`absolute hover:animate-yellowGlow ${position} ${special ? special : ""}`}
        />
      </Link>
    );
  };

  return (
    <>
      <div className="relative aspect-[1649/927] w-full">
        <img
          src="src/assets/frontpage/Background.png"
          alt="Background"
          className="absolute inset-0 h-full w-full"
        />

        <HomeObject
          image={jolteon}
          label="About Me"
          link="/about-me"
          position="    
        left-[43.3%]
        top-[53%]
        w-[7.6%]
        h-auto
      "
        />
        <HomeObject
          image={mechanoid}
          label="Account/Login"
          link="/account"
          position="left-[18.3%]
        top-[32.1%]
        w-[17.6%]
        h-auto"
          special={`${!loggedIn ? "animate-redGlow" : ""}`}
        />
        <HomeObject
          image={gamecube}
          label="Games"
          link="/games"
          position="left-[61.1%]
        top-[37.7%]
        w-[6.5%]
        h-auto"
        />
      </div>
    </>
  );
}
