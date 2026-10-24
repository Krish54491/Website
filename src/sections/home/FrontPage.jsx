import HomeTransition from "../../components/transitions/HomeTransition";
import SectionHeading from "../../components/ui/SectionHeading";
import {
  WhirlpoolConicButton,
  CenterPillFillButton,
} from "../../components/ui/Buttons";
import InfoPanel from "../../components/ui/InfoPanel";
import { BadgeList } from "../../components/ui/Badge";
import { ABOUT, HERO, SKILLS } from "../config/homeConfig";
import { krish_resume, POSSIBLE_PLUSHES } from "../utils/constants";
import { useRef, useEffect, useState } from "react";
import PlushSpawner from "./PlushSpawner";
import {
  Engine,
  Render,
  Runner,
  Bodies,
  Body,
  Composite,
  Events,
  Mouse,
  MouseConstraint,
  Query,
  Vertices,
} from "matter-js";
// Blog section("Want to know more here's my blog!") is shelved until there's a backend for it, see blogConfig.ts

const PLUSH_SIZE = 50; // size of the biggest side of the visible plushie in px
const WALL = 300; // wall thickness, thick so fast plushies don't tunnel through
const WALL_LENGTH = 10000; // long enough that resizing only has to move the walls
// obstacles are their own collision category so the mouse can't grab them
const OBSTACLE_CATEGORY = 0x0002;
const THRESHOLD = 0; // how high alpha needs to be alpha > threshold
const weights = [
  { rarity: 3, weight: 0.5 },
  {
    rarity: 4,
    weight: 0.35,
  },
  {
    rarity: 5,
    weight: 0.15,
  },
];

function findPixelAlpha(x, y, width) {
  return (y * width + x) * 4 + 3; // red channel +3 to get alpha
}

// traced shapes by image path, so each image only gets scanned once
const shapeCache = new Map();

// trace the visible pixels of an image into a convex hull scaled to PLUSH_SIZE, plus
// where the hull's centre sits in the image so the sprite can be lined up with the body.
// returns null if the image can't be read (e.g. another site that blocks it)
function getPlushShape(img, path, save = true, scaleProvided = null) {
  if (shapeCache.has(path) && save) return shapeCache.get(path);
  const width = img.naturalWidth;
  const height = img.naturalHeight;

  // never added to the page, it's just scratch space to read the pixels from
  const scratch = document.createElement("canvas");
  scratch.width = width;
  scratch.height = height;
  const ctx = scratch.getContext("2d");
  ctx.drawImage(img, 0, 0);
  let data;
  try {
    data = ctx.getImageData(0, 0, width, height).data;
  } catch {
    return null; // tainted canvas, the image's site didn't allow reading it
  }

  // only the leftmost and rightmost solid pixel of each row can be on the hull,
  // corners of both pixels are used so the hull covers them fully
  const points = [];
  for (let y = 0; y < height; y++) {
    let left = 0;
    while (left < width && data[findPixelAlpha(left, y, width)] <= THRESHOLD)
      left++;
    if (left === width) continue; // empty row
    let right = width - 1;
    while (data[findPixelAlpha(right, y, width)] <= THRESHOLD) right--;
    points.push(
      { x: left, y },
      { x: right + 1, y },
      { x: left, y: y + 1 },
      { x: right + 1, y: y + 1 },
    );
  }
  if (points.length === 0) return null; // fully transparent image

  const hull = Vertices.hull(points);
  // scale by the visible part, not the whole image, so transparent padding doesn't shrink it
  const xs = hull.map((p) => p.x);
  const ys = hull.map((p) => p.y);
  const visibleSize = Math.max(
    Math.max(...xs) - Math.min(...xs),
    Math.max(...ys) - Math.min(...ys),
  );
  const scale = scaleProvided ? scaleProvided : PLUSH_SIZE / visibleSize;
  // body.position ends up at the hull's centre of mass, so the sprite needs to be
  // drawn with that same image pixel on it (offsets are fractions of the full image)
  const centre = Vertices.centre(hull);

  const shape = {
    vertices: hull.map((p) => ({ x: p.x * scale, y: p.y * scale })),
    scale,
    xOffset: centre.x / width,
    yOffset: centre.y / height,
  };
  if (save) {
    shapeCache.set(path, shape);
  }
  return shape;
}

export default function FrontPage() {
  // plushies live in a matter.js world drawn on a canvas behind the page,
  // clicking the pfp adds one and they can be dragged around with the mouse
  const canvas = useRef();
  //Matter.js references
  const engine = useRef();
  const render = useRef();
  const runner = useRef();
  const mouse = useRef();
  const mouseConstraint = useRef();
  const walls = useRef({});
  const [holding, setHolding] = useState(false); // check if user is holding plush
  const obstacles = useRef([]); // { el, body, w, h }
  const main = useRef();
  const [clicked, setClicked] = useState(false);
  const [photo, setPhoto] = useState(HERO.avatar);
  const profileImg = useRef();
  useEffect(() => {
    initializeRenderer(); //Initialize Matter.js objects
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", resizeRenderer);
    // catches layout changes that aren't a window resize, like fonts or images loading in.
    // watches the whole body since obstacles outside FrontPage (the footer) move too
    const layoutObserver = new ResizeObserver(syncObstacles);
    layoutObserver.observe(document.body);

    return () => {
      //Done when the component closes. Do the opposite.
      clearRenderer(); //Remove all data from Matter.js
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", resizeRenderer);
      layoutObserver.disconnect();
    };
  }, []);

  // elements move on screen when scrolling, so the mouse and obstacles both need updating
  const handleScroll = () => {
    updateMouseOffset();
    syncObstacles();
  };

  //Initialize everything from Matter.js
  const initializeRenderer = () => {
    if (!canvas.current) return; //It's good to always check if your reference exists.

    const width = window.innerWidth;
    const height = window.innerHeight;

    // made here instead of in useRef so StrictMode's remount gets a fresh world
    engine.current = Engine.create();
    render.current = Render.create({
      element: canvas.current,
      engine: engine.current,
      options: {
        width,
        height,
        wireframes: false, // needed to be false for sprites to show
        background: "transparent", // let the site theme show through
        pixelRatio: window.devicePixelRatio,
      },
    });

    // floor, ceiling, and walls just outside the edges of the screen
    const wallOptions = { isStatic: true, friction: 1 };
    walls.current = {
      floor: Bodies.rectangle(
        width / 2,
        height + WALL / 2,
        WALL_LENGTH,
        WALL,
        wallOptions,
      ),
      ceiling: Bodies.rectangle(
        width / 2,
        -WALL / 2,
        WALL_LENGTH,
        WALL,
        wallOptions,
      ),
      left: Bodies.rectangle(
        -WALL / 2,
        height / 2,
        WALL,
        WALL_LENGTH,
        wallOptions,
      ),
      right: Bodies.rectangle(
        width + WALL / 2,
        height / 2,
        WALL,
        WALL_LENGTH,
        wallOptions,
      ),
    };
    Composite.add(engine.current.world, Object.values(walls.current));
    syncObstacles();
    // mouse is on the body since the canvas sits behind the page and can't get clicks
    mouse.current = Mouse.create(document.body);
    removeBlockingListeners(mouse.current);
    document.body.addEventListener("mousedown", blockPressOnPlushie);
    document.body.addEventListener("touchstart", blockPressOnPlushie, {
      passive: false,
    });
    updateMouseOffset();
    mouseConstraint.current = MouseConstraint.create(engine.current, {
      mouse: mouse.current,
      constraint: { stiffness: 0.2, render: { visible: false } },
      collisionFilter: { mask: 0x0001 }, // only plushies (default category) can be grabbed
    });
    Composite.add(engine.current.world, mouseConstraint.current);
    // only fires when a plushie is actually grabbed, unlike raw mouse/touch events
    Events.on(mouseConstraint.current, "startdrag", () => setHolding(true));
    Events.on(mouseConstraint.current, "enddrag", () => setHolding(false));

    Render.run(render.current);
    runner.current = Runner.create();
    Runner.run(runner.current, engine.current);
  };

  // every element with data-physics gets an invisible static body matching its spot
  // on screen, so plushies bounce off it. function instead of const so it's hoisted
  // for initializeRenderer and the ResizeObserver
  function syncObstacles() {
    if (!engine.current) return;
    const world = engine.current.world;
    // whole page, not just FrontPage, so things like the footer in App.jsx count too.
    // other pages never read data-physics so it's harmless there
    const elements = [...document.body.querySelectorAll("[data-physics]")];

    // drop bodies whose element is gone
    obstacles.current = obstacles.current.filter((o) => {
      if (elements.includes(o.el)) return true;
      Composite.remove(world, o.body);
      return false;
    });

    for (const el of elements) {
      const rect = el.getBoundingClientRect();
      const centre = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
      const existing = obstacles.current.find((o) => o.el === el);

      // same size means it only moved (scrolling), so just move the body
      if (existing && existing.w === rect.width && existing.h === rect.height) {
        Body.setPosition(existing.body, centre);
        continue;
      }

      // new element or its size changed, bodies can't be resized so make a new one
      if (existing) Composite.remove(world, existing.body);
      const opts = {
        isStatic: true,
        friction: 0.3,
        render: { visible: false },
        collisionFilter: { category: OBSTACLE_CATEGORY },
      };
      // corner radius from data-radius, defaulting to 16 to match rounded-2xl on the cards
      const radius = el.dataset.radius ? parseInt(el.dataset.radius, 10) : 16;
      const body =
        el.dataset.physics === "circle"
          ? Bodies.circle(centre.x, centre.y, rect.width / 2, opts)
          : Bodies.rectangle(centre.x, centre.y, rect.width, rect.height, {
              ...opts,
              // only round the corners when there's a radius, square things skip it
              ...(radius > 0 && { chamfer: { radius } }),
            });
      Composite.add(world, body);

      if (existing)
        Object.assign(existing, { body, w: rect.width, h: rect.height });
      else obstacles.current.push({ el, body, w: rect.width, h: rect.height });
    }
  }

  // Matter's mouse calls preventDefault on wheel and touch events, which would stop
  // the page from scrolling and taps from clicking. Swap those listeners for ones
  // that only block the browser while a plushie is actually being dragged.
  const removeBlockingListeners = (m) => {
    m.element.removeEventListener("wheel", m.mousewheel);
    m.element.removeEventListener("touchmove", m.mousemove);
    m.element.removeEventListener("touchstart", m.mousedown);
    m.element.removeEventListener("touchend", m.mouseup);

    const forwardTouch = (handler) => (event) =>
      handler({
        changedTouches: event.changedTouches,
        preventDefault: () => {
          if (mouseConstraint.current?.body) event.preventDefault();
        },
      });
    m.touchmove = forwardTouch(m.mousemove);
    m.touchstart = forwardTouch(m.mousedown);
    m.touchend = forwardTouch(m.mouseup);
    m.element.addEventListener("touchmove", m.touchmove, { passive: false });
    m.element.addEventListener("touchstart", m.touchstart, { passive: false });
    m.element.addEventListener("touchend", m.touchend, { passive: false });
  };

  // true if the screen point is on a plushie (walls are static so they're skipped),
  // the canvas is fixed at the top left so screen coords are world coords
  const isOverPlushie = (x, y) =>
    Query.point(
      Composite.allBodies(engine.current.world).filter((b) => !b.isStatic),
      { x, y },
    ).length > 0;

  // stop the browser selecting text / scrolling when the press lands on a plushie,
  // has to happen on the press itself since a selection can't be undone once started
  const blockPressOnPlushie = (event) => {
    if (!engine.current) return;
    const point = event.touches ? event.touches[0] : event;
    if (isOverPlushie(point.clientX, point.clientY)) event.preventDefault();
  };

  // Matter gives mouse positions relative to the whole page, but the canvas is fixed
  // to the screen, so shift by the scroll amount
  const updateMouseOffset = () => {
    if (!mouse.current) return;
    Mouse.setOffset(mouse.current, { x: -window.scrollX, y: -window.scrollY });
  };

  // keep the canvas and walls matching the window size
  const resizeRenderer = () => {
    if (!render.current) return;
    const width = window.innerWidth;
    const height = window.innerHeight;
    Render.setSize(render.current, width, height);
    Body.setPosition(walls.current.floor, {
      x: width / 2,
      y: height + WALL / 2,
    });
    Body.setPosition(walls.current.ceiling, { x: width / 2, y: -WALL / 2 });
    Body.setPosition(walls.current.right, {
      x: width + WALL / 2,
      y: height / 2,
    });
    Body.setPosition(walls.current.left, { x: -WALL / 2, y: height / 2 });
    syncObstacles();
  };

  // I always reuse OLD CODE MWHAHAHAHAHAHA
  const getPokemonImage = async () => {
    const speciesRes = await fetch(
      "https://pokeapi.co/api/v2/pokemon-species?limit=0",
    );
    const speciesData = await speciesRes.json();
    const total = speciesData.count;
    const randomId = Math.floor(Math.random() * total + 1);

    const pokemonRes = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${randomId}`,
    );
    const pokemon = await pokemonRes.json();
    const shinyChance = Math.floor(Math.random() * 4096 + 1);
    if (shinyChance === 1) {
      const shinySpriteUrl = pokemon.sprites.front_shiny;
      return {
        path: shinySpriteUrl,
        name: pokemon.name,
      };
    } else {
      const spriteUrl = pokemon.sprites.front_default;
      return { path: spriteUrl, name: pokemon.name };
    }
  };
  // drop a random plushie in near the top middle of the screen
  const addPlushie = async () => {
    // weighting is 50% 3 star, 35% 4 star, 15% 5 star
    // it's magic numbers for the record
    const rollOdds = Math.random();
    let rarityObtained = 3; // 3 by default
    let count = 0;
    for (let i = 0; i < weights.length; i++) {
      const w = weights[i];
      if (rollOdds <= w.weight + count && rollOdds >= count) {
        // && is not technically needed since should be impossible
        rarityObtained = w.rarity;
        break;
      }
      count += w.weight;
    }
    const plushesForRarity = POSSIBLE_PLUSHES.filter(
      (p) => p.rarity === rarityObtained,
    );

    const plush = plushesForRarity[0]
      ? plushesForRarity[Math.floor(Math.random() * plushesForRarity.length)]
      : await getPokemonImage();
    // load the image first so its pixels can be traced into the body's shape
    const img = new Image();
    img.crossOrigin = "anonymous"; // has to be before src so other sites' images can be read

    img.onload = () => {
      if (!engine.current) return;
      const shape = getPlushShape(img, plush.path);
      const x = window.innerWidth / 2 + (Math.random() - 0.5) * 200;
      const options = { label: plush.name, restitution: 0.4, friction: 0.3 };
      let body;
      if (shape) {
        // y = PLUSH_SIZE keeps the whole shape below the ceiling (which ends at y = 0)
        body = Bodies.fromVertices(x, PLUSH_SIZE, shape.vertices, {
          ...options,
          render: {
            sprite: {
              texture: plush.path,
              xScale: shape.scale,
              yScale: shape.scale,
            },
          },
        });
        // matter guesses the offset from the body's bounds while creating it, which is
        // wrong when the image has transparent padding, so it's set after
        body.render.sprite.xOffset = shape.xOffset;
        body.render.sprite.yOffset = shape.yOffset;
      } else {
        // couldn't read the pixels, fall back to a circle the size of the whole image
        const scale =
          PLUSH_SIZE / Math.max(img.naturalWidth, img.naturalHeight);
        body = Bodies.circle(x, PLUSH_SIZE, PLUSH_SIZE / 2, {
          ...options,
          render: {
            sprite: { texture: plush.path, xScale: scale, yScale: scale },
          },
        });
      }
      Composite.add(engine.current.world, body);
    };
    img.src = plush.path;
  };

  //Remove everything when closed. Self-explanatory.
  const clearRenderer = () => {
    if (mouse.current) {
      const m = mouse.current;
      m.element.removeEventListener("mousemove", m.mousemove);
      m.element.removeEventListener("mousedown", m.mousedown);
      m.element.removeEventListener("mouseup", m.mouseup);
      m.element.removeEventListener("touchmove", m.touchmove);
      m.element.removeEventListener("touchstart", m.touchstart);
      m.element.removeEventListener("touchend", m.touchend);
      mouse.current = null;
    }
    document.body.removeEventListener("mousedown", blockPressOnPlushie);
    document.body.removeEventListener("touchstart", blockPressOnPlushie);

    if (!render.current) return;
    Render.stop(render.current);
    Runner.stop(runner.current);
    render.current.canvas.remove();
    render.current.textures = {};
    render.current = null;

    if (!engine.current) return;
    obstacles.current = [];
    Composite.clear(engine.current.world);
    Engine.clear(engine.current);
    engine.current = null;
  };

  const ProfileHandling = () => {
    if (!clicked) {
      // on first click spawn a big plush of krish544 icon
      const img = new Image();
      img.onload = () => {
        if (!engine.current) return;
        const scale = profileImg.current.width / img.naturalWidth;
        const shape = getPlushShape(img, HERO.avatar, false, scale);
        // screen coords like the canvas, img.x would be page coords and the left edge
        const rect = profileImg.current.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const options = { label: HERO.name, restitution: 0.4, friction: 0.3 };
        let body;
        if (shape) {
          // made at y 0 then moved under the pfp below, once its real height is known
          body = Bodies.fromVertices(
            x,
            0,
            shape.vertices,
            {
              ...options,
              render: {
                sprite: {
                  texture: HERO.avatar,
                  xScale: shape.scale,
                  yScale: shape.scale,
                },
              },
            },
          );
          // matter guesses the offset from the body's bounds while creating it, which is
          // wrong when the image has transparent padding, so it's set after
          body.render.sprite.xOffset = shape.xOffset;
          body.render.sprite.yOffset = shape.yOffset;
        } else {
          // couldn't read the pixels, fall back to a circle the size of the whole image
          body = Bodies.circle(x, 0, rect.width / 2, {
            ...options,
            render: {
              sprite: { texture: HERO.avatar, xScale: scale, yScale: scale },
            },
          });
        }
        // drop it in where the rope/button is: top edge right at the bottom of the pfp, so it
        // doesn't start inside the pfp's obstacle. kept above the floor if the pfp is low on screen
        const height = body.bounds.max.y - body.bounds.min.y;
        const top = Math.min(rect.bottom, window.innerHeight - height);
        Body.setPosition(body, {
          x,
          y: body.position.y + (top - body.bounds.min.y),
        });
        Composite.add(engine.current.world, body);
      };
      img.src = HERO.avatar;
      setClicked(true);
      // swap to real photo of me
      setPhoto("");
    }

    // on clicks after that idk yet
  };

  return (
    <HomeTransition>
      <div ref={canvas} className="pointer-events-none fixed inset-0 z-0" />
      {/* relative + z-10 puts all the content above the canvas, bg-transparent so
          .section-page's background doesn't hide it (body already has the same bg) */}
      <main
        className={`section-page relative z-10 mx-auto w-full max-w-5xl bg-transparent px-4 sm:px-6 lg:px-8 ${holding ? "cursor-grabbing select-none" : ""}`}
        ref={main}
      >
        {/* title, pfp, and buttons */}
        <section className="grid grid-cols-1 items-center gap-8 py-10 sm:py-16 md:grid-cols-[1fr_auto] md:gap-12 lg:py-24">
          <div className="z-[inherit] order-2 text-center md:order-1 md:text-left">
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
              <WhirlpoolConicButton to="/contactme">
                Contact me
              </WhirlpoolConicButton>
              <CenterPillFillButton href={`/${krish_resume}`} external>
                Resume
              </CenterPillFillButton>
            </div>
          </div>
          {/* relative wrapper so the spawn controls can hang off the pfp */}
          <div className="relative order-1 mx-auto md:order-2">
            <img
              src={photo}
              alt={HERO.name}
              className="size-40 rounded-full border-4 border-primary object-cover shadow-xl shadow-primary/30 sm:size-56 lg:size-72"
              onClick={ProfileHandling}
              data-physics="circle"
              dataset-radius="16"
              ref={profileImg}
            />
            <PlushSpawner onSpawn={addPlushie} />
          </div>
        </section>
        {/* About me area */}
        <section id="about" className="py-10 sm:py-14">
          <SectionHeading title="About Me" />
          <div className="max-w-prose space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg whitespace-pre-line">
            {ABOUT.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>
        {/* Skills */}
        <section id="skills" className="py-10 sm:py-14">
          <SectionHeading title="Skills" />
          {/* flex-wrap instead of grid so a partial last row gets centered */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
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
        </section>
        <p className="flex mt-10 justify-center">MORE IS PLANNED STAY TUNED!</p>
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
