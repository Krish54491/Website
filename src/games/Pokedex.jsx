import { useState, useEffect, useCallback, memo } from "react";

const PokemonImage = memo(
  function PokemonImage({
    pokemonId,
    pokemonName,
    pokemonComplete,
    item,
    getPokemonPic,
  }) {
    const [imgUrl, setImgUrl] = useState(null);

    useEffect(() => {
      let isMounted = true;
      getPokemonPic(pokemonId, item).then((url) => {
        if (isMounted) setImgUrl(url);
      });
      return () => {
        isMounted = false;
      };
    }, [pokemonId, pokemonName, pokemonComplete, item, getPokemonPic]);

    if (!imgUrl) return <div></div>;
    return (
      <a
        href={`https://bulbapedia.bulbagarden.net/wiki/${pokemonName}_(Pokémon)`}
        target="_blank"
      >
        <img
          src={imgUrl}
          className={`${pokemonComplete === 0 ? "brightness-0" : ""}`}
          alt={pokemonName}
        />
      </a>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.pokemonName === nextProps.pokemonName &&
      prevProps.pokemonId === nextProps.pokemonId &&
      prevProps.item === nextProps.item
    );
  },
);
export const Pokedex = () => {
  const [pokeCheck, setPokeCheck] = useState(true);
  const [pokemonFound, setPokemonFound] = useState(0);
  const [pokemonNames, setPokemonNames] = useState(Array(1026).fill(""));
  const [pokedexCompletion, setPokedexCompletion] = useState(
    Array(1026).fill(0),
  );
  const [sorting, setSorting] = useState("all"); // all, found, shiny, not found - might add alphabetical ordering one day
  const [amount, setAmount] = useState(51); // Number of Pokémon to display at a time
  if (localStorage.getItem("pokedexCompletion") != null && pokeCheck) {
    setPokedexCompletion(JSON.parse(localStorage.getItem("pokedexCompletion")));
    setPokemonFound(
      pokedexCompletion.reduce(
        (quantity, val) => (val === 1 || val === 2 ? quantity + 1 : quantity),
        0,
      ),
    );
    setPokemonNames(new Array(pokedexCompletion.length).fill(""));
    setPokeCheck(false);
  }

  const getPokemonPic = useCallback(
    async (id, item) => {
      const pokemonRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const pokemonData = await pokemonRes.json();
      setPokemonNames((prevNames) => {
        const newNames = [...prevNames];
        newNames[id] = pokemonData.name;
        return newNames;
      });
      setPokemonFound(
        pokedexCompletion.reduce(
          (quantity, val) => (val === 1 || val === 2 ? quantity + 1 : quantity),
          0,
        ),
      );
      if (item === 2) {
        const shinypic = pokemonData.sprites.front_shiny;
        return shinypic;
      }
      const defaultpic = pokemonData.sprites.front_default;
      return defaultpic;
    },
    [pokedexCompletion],
  );

  return (
    <>
      <div className="flex flex-row justify-center items-start m-4 ">
        <h1 className="flex justify-center items-start my-4 text-xl">
          {" "}
          {pokemonFound === 0
            ? "No Pokémon found"
            : `${pokemonFound - 1} out of ${pokedexCompletion.length - 1} Pokémon found - Sorting Method:`}{" "}
        </h1>
        <select
          value={sorting}
          onChange={(e) => setSorting(e.target.value)}
          className="m-2 p-2 bg-neutral-200 text-slate-900 dark:bg-slate-900 dark:text-neutral-200 border rounded"
        >
          <option value="all">All</option>
          <option value="found">Found</option>
          <option value="shiny">Shiny</option>
          <option value="not found">Not Found</option>
        </select>
      </div>
      <div className="flex flex-row flex-wrap">
        {sorting === "all"
          ? pokedexCompletion.map((item, idx) =>
              idx > amount ? null : idx === 0 ? null : item === 0 ? (
                <PokemonImage
                  key={idx}
                  pokemonId={idx}
                  pokemonName={pokemonNames[idx]}
                  pokemonComplete={pokedexCompletion[idx]}
                  item={item}
                  getPokemonPic={getPokemonPic}
                />
              ) : item === 2 ? (
                <PokemonImage
                  key={idx}
                  pokemonId={idx}
                  pokemonName={pokemonNames[idx]}
                  pokemonComplete={pokedexCompletion[idx]}
                  item={item}
                  getPokemonPic={getPokemonPic}
                />
              ) : item === 1 ? (
                <PokemonImage
                  key={idx}
                  pokemonId={idx}
                  pokemonName={pokemonNames[idx]}
                  pokemonComplete={pokedexCompletion[idx]}
                  item={item}
                  getPokemonPic={getPokemonPic}
                />
              ) : null,
            )
          : sorting === "found"
            ? pokedexCompletion.map((item, idx) =>
                idx === 0 ? null : item === 2 ? (
                  <PokemonImage
                    key={idx}
                    pokemonId={idx}
                    pokemonName={pokemonNames[idx]}
                    pokemonComplete={pokedexCompletion[idx]}
                    item={item}
                    getPokemonPic={getPokemonPic}
                  />
                ) : item === 1 ? (
                  <PokemonImage
                    key={idx}
                    pokemonId={idx}
                    pokemonName={pokemonNames[idx]}
                    pokemonComplete={pokedexCompletion[idx]}
                    item={item}
                    getPokemonPic={getPokemonPic}
                  />
                ) : null,
              )
            : sorting === "shiny"
              ? pokedexCompletion.map((item, idx) =>
                  idx === 0 ? null : item === 2 ? (
                    <PokemonImage
                      key={idx}
                      pokemonId={idx}
                      pokemonName={pokemonNames[idx]}
                      pokemonComplete={pokedexCompletion[idx]}
                      item={item}
                      getPokemonPic={getPokemonPic}
                    />
                  ) : null,
                )
              : sorting === "not found"
                ? pokedexCompletion.map((item, idx) =>
                    idx === 0 ? null : item === 0 ? (
                      <PokemonImage
                        key={idx}
                        pokemonId={idx}
                        pokemonName={pokemonNames[idx]}
                        pokemonComplete={pokedexCompletion[idx]}
                        item={item}
                        getPokemonPic={getPokemonPic}
                      />
                    ) : null,
                  )
                : null}
      </div>
      <div
        className={`${amount < pokedexCompletion.length ? "flex" : "hidden"} justify-center w-full`}
      >
        <button
          onClick={() =>
            setAmount(
              amount < pokedexCompletion.length
                ? Math.min(amount + 100, pokedexCompletion.length)
                : amount,
            )
          }
          className="bg-cyan-500 dark:bg-indigo-800 p-2 rounded-md my-1"
        >
          Load More
        </button>
      </div>
    </>
  );
};
