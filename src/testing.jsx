import { Link } from "react-router-dom";

// function HomeObject(image, label, link, position) {}

/* jolteon -> About me page
for md and below 


for laptops: lg:left-[42.5%] lg:top-[25.4%] lg:scale-[0.80]
*/
/* jolteon -> About me page
for md and below 


for laptops: lg:left-[42.5%] lg:top-[25.4%] lg:scale-[0.80]
*/
export default function FrontPage() {
  return (
    <>
      <div className="relative aspect-[1649/927] w-full">
        <img
          src="src/assets/frontpage/Background.png"
          alt="Background"
          className="absolute inset-0 h-full w-full"
        />

        <Link to="/about-me">
          <img
            src="src/assets/frontpage/Background-Jolteon.png"
            alt="Jolteon"
            className="
            absolute
        left-[43.3%]
        top-[53%]
        w-[7.6%]
        h-auto
      "
          />
        </Link>

        <Link to="/account">
          <img
            src="src/assets/frontpage/Background-Mechanoid.png"
            alt="Mechanoid"
            className="
        
            absolute
        left-[16%]
        top-[23.5%]
        w-auto
        h-auto
      "
          />
        </Link>

        <Link to="/games">
          <img
            src="src/assets/frontpage/Background-Gamecube.png"
            alt="Gamecube"
            className="
        absolute
        left-[60.4%]
        top-[35.9%]
        w-auto
        h-auto
      "
          />
        </Link>
      </div>
    </>
  );
}
