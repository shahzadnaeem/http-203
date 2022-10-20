import { clock } from "./utils.js";

import { App } from "./src/app.js";

const mainEl = document.querySelector("#main");
const resetEl = document.querySelector("#reset");
const pauseEl = document.querySelector("#pause");
const clockEl = document.querySelector("#clock");
const boardEl = document.querySelector("#board");
const highScoreEl = document.querySelector("#highScore");
const playTimeEl = document.querySelector("#playTime");
const scoreEl = document.querySelector("#score");
const nextEl = document.querySelector("#next");
const nextBoardEl = document.querySelector("#nextBoard");
const shapeStatsEl = document.querySelector("#shapeStats");
const demoBoardEl = document.querySelector("#demoBoard");

const ALL_ELEMENTS = {
  MAIN: mainEl,
  RESET: resetEl,
  PAUSE: pauseEl,
  BOARD: boardEl,
  HIGHSCORE: highScoreEl,
  PLAYTIME: playTimeEl,
  SCORE: scoreEl,
  NEXT: nextEl,
  NEXTSHAPE: nextBoardEl,
  SHAPESTATS: shapeStatsEl,
  DEMOBOARD: demoBoardEl,
};

const APP_ELEMENTS = {
  BOARD: boardEl,
  HIGHSCORE: highScoreEl,
  PLAYTIME: playTimeEl,
  SCORE: scoreEl,
  NEXT: nextEl,
  NEXTSHAPE: nextBoardEl,
  SHAPESTATS: shapeStatsEl,
  DEMOBOARD: demoBoardEl,
};

// ----------------------------------------------------------------------------

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 25;

const app = new App(BOARD_WIDTH, BOARD_HEIGHT, APP_ELEMENTS);

function resetListener() {
  paused = true;
  togglePaused();

  ticks = 0;

  init();
}

let ticks = 0;
const ticksPerSec = 50;
let tickSpeed = Math.floor(1000 / ticksPerSec);
let tickInterval = false;

let paused = false;

function tick() {
  if (paused) {
    return;
  }

  ticks++;

  app.tick(ticks);
}

// ----------------------------------------------------------------------------

function togglePaused() {
  paused = !paused;

  if (paused) {
    ALL_ELEMENTS.PAUSE.textContent = "Resume";
  } else {
    ALL_ELEMENTS.PAUSE.textContent = "Pause";
  }

  ALL_ELEMENTS.PAUSE.blur();
}

function initControls() {
  ALL_ELEMENTS.RESET.removeEventListener("click", resetListener);
  ALL_ELEMENTS.RESET.addEventListener("click", resetListener);

  ALL_ELEMENTS.PAUSE.removeEventListener("click", togglePaused);
  ALL_ELEMENTS.PAUSE.addEventListener("click", togglePaused);

  ALL_ELEMENTS.RESET.blur();
  ALL_ELEMENTS.PAUSE.blur();

  if (tickInterval) {
    clearInterval(tickInterval);
  }
}

function initDisplay() {
  app.newGame();

  clock(clockEl);
}

async function init() {
  initControls();
  initDisplay();

  tickInterval = setInterval(tick, tickSpeed);
}

// ----------------------------------------------------------------------------

init();

// TODO:
// Extract Board and other classes into own files
//   Tests needed!
// Others
//   Tick function to `App`
//     Levels with Speed up
//   Rotation wobble fix
//   Scale based on available display size
//     CSS fixes - too many specific classes

// ----------------------------------------------------------------------------

// Debug stuff

if (false) {
  for (let key in SHAPES) {
    const sh = SHAPES[key];
    const shape = new Shape(sh);
    console.log(`${key}\n${shape.toString()}`);

    shape.rotateCCW();
    console.log(`${key}:CCW\n${shape.toString()}`);
  }
}
