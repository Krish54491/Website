import { useEffect, useRef, useState } from "react";
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
} from "matter-js";
export const Confetti = () => {
  const WALL = 300;
  const WALL_LENGTH = 10000;
  const [holding, setHolding] = useState(false); // check if user is holding plush

  //Initialize everything from Matter.js
  const engine = useRef();
  const render = useRef();
  const runner = useRef();
  const mouse = useRef();
  const mouseConstraint = useRef();
  const walls = useRef({});
  const canvas = useRef();
  useEffect(() => {
    initializeRenderer(); //Initialize Matter.js objects
    window.addEventListener("scroll", updateMouseOffset());
    window.addEventListener("resize", resizeRenderer);
    // catches layout changes that aren't a window resize, like fonts or images loading in.
    // watches the whole body since obstacles outside FrontPage (the footer) move too

    return () => {
      //Done when the component closes. Do the opposite.
      clearRenderer(); //Remove all data from Matter.js
      window.removeEventListener("scroll", updateMouseOffset());
      window.removeEventListener("resize", resizeRenderer);
    };
  }, []);
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
    // mouse is on the body since the canvas sits behind the page and can't get clicks
    mouse.current = Mouse.create(document.body);
    removeBlockingListeners(mouse.current);
    document.body.addEventListener("mousedown", blockPressOnConfetti);
    document.body.addEventListener("touchstart", blockPressOnConfetti, {
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
  };
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
    document.body.removeEventListener("mousedown", blockPressOnConfetti);
    document.body.removeEventListener("touchstart", blockPressOnConfetti);

    if (!render.current) return;
    Render.stop(render.current);
    Runner.stop(runner.current);
    render.current.canvas.remove();
    render.current.textures = {};
    render.current = null;

    if (!engine.current) return;
    Composite.clear(engine.current.world);
    Engine.clear(engine.current);
    engine.current = null;
  };
  const isOverPlushie = (x, y) =>
    Query.point(
      Composite.allBodies(engine.current.world).filter((b) => !b.isStatic),
      { x, y },
    ).length > 0;
  const blockPressOnConfetti = (event) => {
    if (!engine.current) return;
    const point = event.touches ? event.touches[0] : event;
    if (isOverPlushie(point.clientX, point.clientY)) event.preventDefault();
  };
  function addConfetti() {
    const CONFETTI_SIZE = 50; // size of the confetti in px
    const options = {
      label: "confetti",
      frictionAir: 1,
      friction: 0.1,
      restitution: 0,
    };
    const x = window.innerWidth / 2 + (Math.random() - 0.5) * 200;

    const body = Bodies.rectangle(
      x,
      CONFETTI_SIZE,
      CONFETTI_SIZE,
      CONFETTI_SIZE / 2,
      { ...options },
    );
    Composite.add(engine.current.world, body);
  }
  return (
    <div
      ref={canvas}
      onClick={addConfetti}
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
};
