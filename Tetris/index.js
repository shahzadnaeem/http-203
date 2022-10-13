import { clock } from "./utils.js";

import { Shape } from "./src/shape.js";
import { Board } from "./src/board.js";
import { SHAPES, SHAPE_NAMES } from "./src/shapes.js";

const mainEl = document.querySelector("#main");
const subHeadingEl = document.querySelector("#subheading");
const resetEl = document.querySelector("#reset");
const pauseEl = document.querySelector("#pause");
const clockEl = document.querySelector("#clock");
const boardEl = document.querySelector("#board");
const playTimeEl = document.querySelector("#playTime");
const scoreEl = document.querySelector("#score");
const nextBoardEl = document.querySelector("#nextBoard");
const demoBoardEl = document.querySelector("#demoBoard");

const ALL_ELEMENTS = {
  MAIN: mainEl,
  SUBHEADING: subHeadingEl,
  RESET: resetEl,
  PAUSE: pauseEl,
  BOARD: boardEl,
  PLAYTIME: playTimeEl,
  SCORE: scoreEl,
  NEXTSHAPE: nextBoardEl,
  DEMOBOARD: demoBoardEl,
};

const APP_ELEMENTS = {
  SUBHEADING: subHeadingEl,
  BOARD: boardEl,
  PLAYTIME: playTimeEl,
  SCORE: scoreEl,
  NEXTSHAPE: nextBoardEl,
  DEMOBOARD: demoBoardEl,
};

class App {
  constructor(width, height, elements) {
    this.theBoard = new Board(width, height);

    // NOTE: Demo board!
    this.demoBoard = new Board(10, 15);

    this.elements = elements;
    this.keys = [];
    this.lines = 0;
    this.score = 0;
    this.playTime = 0;
  }

  randomInt(a, b) {
    return Math.floor(Math.random() * (b - a) + a);
  }

  randomFromArray(array) {
    const idx = this.randomInt(0, array.length);
    return array[idx];
  }

  randomShape() {
    const rawShape = SHAPES[this.randomFromArray(SHAPE_NAMES)];

    return new Shape(rawShape);
  }

  randomShapes(board, num = 20, below = 0) {
    for (let i = 0; i < num; i++) {
      let shape, x, y;

      let tries = 0;
      do {
        tries++;
        if (tries > 5) {
          return;
        }

        shape = this.randomShape();

        const rand = Math.floor(Math.random() * 3);

        if (rand % 3 === 1) {
          shape.rotateCCW();
        } else if (rand % 3 === 2) {
          shape.rotateCW();
        }

        const width = shape.width;
        const height = shape.height;
        x = this.randomInt(0, board.width - width + 1);
        y = this.randomInt(0, board.height - height - below + 1) + below;
      } while (!board.canPlaceShape(shape, x, y));

      board.placeShape(shape, x, y);
    }
  }

  drawNextShape(el) {
    const MINI_BOARD_WIDTH = 4;
    const MINI_BOARD_HEIGHT = 4;

    const miniBoard = new Board(MINI_BOARD_WIDTH, MINI_BOARD_HEIGHT);
    const shape = this.randomShape();

    const width = shape.width;
    const height = shape.height;
    const yoffs = height < 4 ? 1 : 0;
    const xoffs = width < 4 ? 1 : 0;

    miniBoard.placeShape(shape, xoffs, yoffs);

    miniBoard.drawBoard(el);
  }

  drawDemoBoard(el, tickNo) {
    this.demoBoard.shiftBoardDown();

    if (tickNo % 5 === 3) {
      for (let i = 4; i < 7; i++) {
        this.demoBoard.board[70 + i] = 4;
      }
    }

    if (tickNo % 5 === 0) {
      this.demoBoard.removeRow(10);
    }

    this.randomShapes(this.demoBoard, 1);
    this.demoBoard.drawBoard(el);
  }

  drawScore(el) {
    this.score++;

    el.textContent = `Score: ${Math.floor(this.score / 4)}`;
  }

  padNum(num) {
    if (num < 10) {
      return `0${num}`;
    } else {
      return num;
    }
  }

  drawPlayTime(el) {
    const mins = Math.floor(this.score / 60);
    const secs = this.score % 60;

    el.textContent = `Play Time: ${this.padNum(mins)}:${this.padNum(secs)}`;
  }

  init() {
    app.theBoard.clearBoard();
    app.theBoard.drawBoard(this.elements.BOARD);

    app.demoBoard.clearBoard();
    app.demoBoard.drawBoard(this.elements.DEMOBOARD);

    app.drawScore(this.elements.SCORE);
    app.drawPlayTime(this.elements.PLAYTIME);
  }

  tick(tickNo) {
    allShapes.forEach((shape, i) => {
      const shapeX = (i % 2) * 5 + 1;
      const shapeY = Math.floor(i / 2) * 5 + 1;

      if (ticks > 1) {
        app.theBoard.removeShape(shape, shapeX, shapeY);
        shape.rotateCCW();
      }

      app.theBoard.placeShape(shape, shapeX, shapeY);
    });

    app.theBoard.drawBoard(this.elements.BOARD);
    app.drawNextShape(this.elements.NEXTSHAPE);
    app.drawDemoBoard(this.elements.DEMOBOARD, tickNo);
    app.drawScore(this.elements.SCORE);
    app.drawPlayTime(this.elements.PLAYTIME);
  }
}

// ----------------------------------------------------------------------------

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 25;

const app = new App(BOARD_WIDTH, BOARD_HEIGHT, APP_ELEMENTS);

function resetListener() {
  paused = true;
  togglePaused();

  ticks = 0;

  allShapes = SHAPE_NAMES.map((k) => new Shape(SHAPES[k]));

  init();
}

let ticks = 0;
let tickSpeed = 1000;
let tickInterval = false;

let allShapes = SHAPE_NAMES.map((k) => new Shape(SHAPES[k]));

let paused = false;

function tick() {
  if (paused) {
    return;
  }

  ticks++;

  app.tick(ticks);

  ALL_ELEMENTS.SUBHEADING.textContent = `Tetris #${ticks}`;
}

// ----------------------------------------------------------------------------

function togglePaused() {
  paused = !paused;

  if (paused) {
    ALL_ELEMENTS.PAUSE.textContent = "Resume";
  } else {
    ALL_ELEMENTS.PAUSE.textContent = "Pause";
  }
}

function initControls() {
  ALL_ELEMENTS.RESET.removeEventListener("click", resetListener);
  ALL_ELEMENTS.RESET.addEventListener("click", resetListener);

  ALL_ELEMENTS.PAUSE.removeEventListener("click", togglePaused);
  ALL_ELEMENTS.PAUSE.addEventListener("click", togglePaused);

  if (tickInterval) {
    clearInterval(tickInterval);
  }
}

function initDisplay() {
  ALL_ELEMENTS.SUBHEADING.textContent = `Tetris ...`;

  app.init();

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
// Make playable
//   Tick function to `App`
//     Pick shape, start it moving down
//     Keyboard - rotate, move, drop
//       Need to support rotate and move in `one move`
//       Capture key strokes and apply up to 2 perhaps?
//     Add next shape when current `hits`
//     Clear complete rows
//     Speed up
//   Score keeping and time keeping
//   Next shape selection and display - bit ugly
//   Reset and Pause in `App`
//   Top score
//   Scale based on available display size

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
