import HomeTransition from "../../components/transitions/HomeTransition";
import SectionHeading from "../../components/ui/SectionHeading";
import ButtonLink from "../../components/ui/ButtonLink";
import InfoPanel from "../../components/ui/InfoPanel";
import { BadgeList } from "../../components/ui/Badge";
import { ABOUT, HERO, SKILLS, CONTACT_INFO } from "../config/homeConfig";
import { krish_resume } from "../utils/constants";

function Hero() {
  return (
    <section className="grid grid-cols-1 items-center gap-8 py-10 sm:py-16 md:grid-cols-[1fr_auto] md:gap-12 lg:py-24">
      <div className="order-2 text-center md:order-1 md:text-left">
        <p className="mb-3 text-sm font-semibold tracking-[0.2em] text-muted-foreground uppercase">
          {HERO.descriptor}
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          {HERO.name}
        </h1>
        <p className="mt-2 text-2xl font-bold text-accent sm:text-3xl dark:text-primary">
          aka {HERO.nickname}
        </p>
        <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg md:mx-0">
          {HERO.tagline}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
          <ButtonLink href={`mailto:${CONTACT_INFO}`}>Contact me</ButtonLink>
          <ButtonLink href={`/${krish_resume}`} variant="outline" external>
            Resume
          </ButtonLink>
        </div>
      </div>
      <img
        src={HERO.avatar}
        alt={HERO.name}
        className="order-1 mx-auto size-40 rounded-full border-4 border-primary object-cover shadow-xl shadow-primary/30 sm:size-56 md:order-2 lg:size-72"
      />
    </section>
  );
}

function About() {
  return (
    <section id="about" className="py-10 sm:py-14">
      <SectionHeading title="About Me" />
      <div className="max-w-prose space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
        {ABOUT.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section id="skills" className="py-10 sm:py-14">
      <SectionHeading title="Skills" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {SKILLS.map((group) => (
          <InfoPanel key={group.category} title={group.category}>
            <BadgeList items={group.items} />
          </InfoPanel>
        ))}
      </div>
    </section>
  );
}

// Blog section("Want to know more here's my blog!") is shelved until there's a backend for it, see blogConfig.ts

export default function FrontPage() {
  return (
    <HomeTransition>
      <main className="section-page mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <Hero />
        <About />
        <Skills />
      </main>
    </HomeTransition>
  );
}

// Old Pokemon front page, kept for reference
// import Ampharos from "../../assets/Ampharos.png";
// import { useState, useEffect } from "react";

// function PokemonImage({ pokemonId, getPokemonPic }) {
//   const [imgUrl, setImgUrl] = useState(null);
//   useEffect(() => {
//     let isMounted = true;
//     getPokemonPic(pokemonId).then((url) => {
//       if (isMounted) setImgUrl(url);
//     });
//     return () => {
//       isMounted = false;
//     };
//   }, [pokemonId, getPokemonPic]);

//   if (!imgUrl) return <div>Loading...</div>;

//   return <img src={imgUrl} alt="Pokemon" />;
// }

// export default function FrontPage() {
//   const [pokedexCompletion, setPokedexCompletion] = useState(
//     Array(1026).fill(0),
//   );
//   const [pic, setPic] = useState("./Krish544 Icon.png");
//   const [pokemonName, setPokemonName] = useState("Krish544 Icon");
//   const [pokemonFound, setPokemonFound] = useState(1);
//   const [pokeCheck, setPokeCheck] = useState(true);
//   if (localStorage.getItem("pokedexCompletion") != null && pokeCheck) {
//     setPokedexCompletion(JSON.parse(localStorage.getItem("pokedexCompletion")));
//     setPokemonFound(
//       pokedexCompletion.reduce(
//         (amount, val) => (val === 1 || val === 2 ? amount + 1 : amount),
//         0,
//       ),
//     );
//     setPokeCheck(false);
//   }
//   if (pokedexCompletion[0] === 0) {
//     pokedexCompletion[0] = 1;
//   }
//   const getPokemonPic = async (id) => {
//     const pokemonRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
//     const pokemonData = await pokemonRes.json();
//     const shinypic = pokemonData.sprites.front_shiny;
//     return shinypic;
//   };
//   const changePic = async () => {
//     const speciesRes = await fetch(
//       "https://pokeapi.co/api/v2/pokemon-species?limit=0",
//     );
//     const speciesData = await speciesRes.json();
//     const total = speciesData.count;
//     const randomId = Math.floor(Math.random() * (total + 1));
//     // this is a hot fix because the pokedex orginally could not hold 1026 pokemon and I want to keep the pokedex completion of previous users
//     if (pokedexCompletion.length < 1026) {
//       pokedexCompletion.push(0);
//       pokedexCompletion[0] = 1;
//     }

//     if (pokeCheck) {
//       setPokedexCompletion(Array(total + 1).fill(0));
//       pokedexCompletion[0] = 1;
//       setPokeCheck(false);
//     }
//     if (randomId === 0) {
//       if (Math.floor(Math.random() * 2) === 0) {
//         setPic("./Krish544 Icon.png");
//       } else {
//         setPic(Ampharos);
//       }
//       return;
//     }
//     if (pokedexCompletion[randomId] === 0) {
//       pokedexCompletion[randomId] = 1;
//     }
//     const pokemonRes = await fetch(
//       `https://pokeapi.co/api/v2/pokemon/${randomId}`,
//     );
//     const pokemon = await pokemonRes.json();
//     const shinyChance = Math.floor(Math.random() * 4096 + 1);
//     if (shinyChance < 10 && pokemonFound === 1026) {
//       const shinySpriteUrl = pokemon.sprites.front_shiny;
//       setPic(shinySpriteUrl);
//       console.log("Shiny!");
//       pokedexCompletion[randomId] = 2;
//     } else if (shinyChance === 1) {
//       const shinySpriteUrl = pokemon.sprites.front_shiny;
//       setPic(shinySpriteUrl);
//       console.log("Shiny!");
//       pokedexCompletion[randomId] = 2;
//     } else {
//       const spriteUrl = pokemon.sprites.front_default;
//       setPic(spriteUrl);
//     }
//     localStorage.setItem(
//       "pokedexCompletion",
//       JSON.stringify(pokedexCompletion),
//     );
//     setPokemonName(pokemon.name);
//     setPokemonFound(
//       pokedexCompletion.reduce(
//         (amount, val) => (val === 1 || val === 2 ? amount + 1 : amount),
//         0,
//       ),
//     );
//   };
//   return (
//     <>
//       <div className="flex flex-col relative items-center justify-center mb-12 lg:mt-14">
//         <img
//           src={`${pic}`}
//           onClick={changePic}
//           alt={pokemonName}
//           className="lg:w-1/5 w-4/5 hover:animate-smallspin"
//         ></img>
//         <h3 className="text-2xl">
//           {pokemonFound === 0
//             ? "Pokedex Data Loaded"
//             : `Amount of Pokemon Found: ${pokemonFound}`}
//         </h3>
//         <h2 className="text-3xl">Krish Bharal&apos;s Portfolio</h2>
//       </div>
//       <div className="hidden lg:flex flex-row flex-wrap items-center justify-center space-x-0">
//         {pokedexCompletion ? (
//           pokedexCompletion.map((item, idx) =>
//             item === 2 ? (
//               <PokemonImage
//                 key={idx}
//                 pokemonId={idx}
//                 getPokemonPic={getPokemonPic}
//               />
//             ) : null,
//           )
//         ) : (
//           <div>No data</div>
//         )}
//       </div>
//     </>
//   );
// }
