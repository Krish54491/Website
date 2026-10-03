import Ampharos from "../../assets/Ampharos.png";
import { useState, useEffect } from "react";

function PokemonImage({ pokemonId, getPokemonPic }) {
  const [imgUrl, setImgUrl] = useState(null);
  useEffect(() => {
    let isMounted = true;
    getPokemonPic(pokemonId).then((url) => {
      if (isMounted) setImgUrl(url);
    });
    return () => {
      isMounted = false;
    };
  }, [pokemonId, getPokemonPic]);

  if (!imgUrl) return <div>Loading...</div>;

  return <img src={imgUrl} alt="Pokemon" />;
}

export default function FrontPage() {
  const [pokedexCompletion, setPokedexCompletion] = useState(
    Array(1026).fill(0),
  );
  const [pic, setPic] = useState("./Krish544 Icon.png");
  const [pokemonName, setPokemonName] = useState("Krish544 Icon");
  const [pokemonFound, setPokemonFound] = useState(1);
  const [pokeCheck, setPokeCheck] = useState(true);
  if (localStorage.getItem("pokedexCompletion") != null && pokeCheck) {
    setPokedexCompletion(JSON.parse(localStorage.getItem("pokedexCompletion")));
    setPokemonFound(
      pokedexCompletion.reduce(
        (amount, val) => (val === 1 || val === 2 ? amount + 1 : amount),
        0,
      ),
    );
    setPokeCheck(false);
  }
  if (pokedexCompletion[0] === 0) {
    pokedexCompletion[0] = 1;
  }
  const getPokemonPic = async (id) => {
    const pokemonRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const pokemonData = await pokemonRes.json();
    const shinypic = pokemonData.sprites.front_shiny;
    return shinypic;
  };
  const changePic = async () => {
    const speciesRes = await fetch(
      "https://pokeapi.co/api/v2/pokemon-species?limit=0",
    );
    const speciesData = await speciesRes.json();
    const total = speciesData.count;
    const randomId = Math.floor(Math.random() * (total + 1));
    // this is a hot fix because the pokedex orginally could not hold 1026 pokemon and I want to keep the pokedex completion of previous users
    if (pokedexCompletion.length < 1026) {
      pokedexCompletion.push(0);
      pokedexCompletion[0] = 1;
    }

    if (pokeCheck) {
      setPokedexCompletion(Array(total + 1).fill(0));
      pokedexCompletion[0] = 1;
      setPokeCheck(false);
    }
    if (randomId === 0) {
      if (Math.floor(Math.random() * 2) === 0) {
        setPic("./Krish544 Icon.png");
      } else {
        setPic(Ampharos);
      }
      return;
    }
    if (pokedexCompletion[randomId] === 0) {
      pokedexCompletion[randomId] = 1;
    }
    const pokemonRes = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${randomId}`,
    );
    const pokemon = await pokemonRes.json();
    const shinyChance = Math.floor(Math.random() * 4096 + 1);
    if (shinyChance < 10 && pokemonFound === 1026) {
      const shinySpriteUrl = pokemon.sprites.front_shiny;
      setPic(shinySpriteUrl);
      console.log("Shiny!");
      pokedexCompletion[randomId] = 2;
    } else if (shinyChance === 1) {
      const shinySpriteUrl = pokemon.sprites.front_shiny;
      setPic(shinySpriteUrl);
      console.log("Shiny!");
      pokedexCompletion[randomId] = 2;
    } else {
      const spriteUrl = pokemon.sprites.front_default;
      setPic(spriteUrl);
    }
    localStorage.setItem(
      "pokedexCompletion",
      JSON.stringify(pokedexCompletion),
    );
    setPokemonName(pokemon.name);
    setPokemonFound(
      pokedexCompletion.reduce(
        (amount, val) => (val === 1 || val === 2 ? amount + 1 : amount),
        0,
      ),
    );
  };
  return (
    <>
      <div className="flex flex-col relative items-center justify-center mb-12 lg:mt-14">
        <img
          src={`${pic}`}
          onClick={changePic}
          alt={pokemonName}
          className="lg:w-1/5 w-4/5 hover:animate-smallspin"
        ></img>
        <h3 className="text-2xl">
          {pokemonFound === 0
            ? "Pokedex Data Loaded"
            : `Amount of Pokemon Found: ${pokemonFound}`}
        </h3>
        <h2 className="text-3xl">Krish Bharal&apos;s Portfolio</h2>
      </div>
      <div className="hidden lg:flex flex-row flex-wrap items-center justify-center space-x-0">
        {pokedexCompletion ? (
          pokedexCompletion.map((item, idx) =>
            item === 2 ? (
              <PokemonImage
                key={idx}
                pokemonId={idx}
                getPokemonPic={getPokemonPic}
              />
            ) : null,
          )
        ) : (
          <div>No data</div>
        )}
      </div>
    </>
  );
}
