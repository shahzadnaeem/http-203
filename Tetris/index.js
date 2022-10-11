import { clock } from "./utils.js";

const mainEl = document.querySelector("#main");
const subHeadingEl = document.querySelector("#subheading");
const resetEl = document.querySelector("#reset");
const clockEl = document.querySelector("#clock");
const boardEl = document.querySelector("#board");

const CELLS = {
  EMPTY: 0,
  RED: 1,
  PURPLE: 2,
  GREEN: 3,
  YELLOW: 4,
  ORANGE: 5,
  BLUE: 6,
  CYAN: 7,
};

const CELL_CLASSES = Object.keys(CELLS).map((k) => k.toLowerCase());

const SHAPES = {
  LINE4: { grid: ["....", "xxxx", "....", "...."], col: CELLS.CYAN },
  ELL1: { grid: ["x..", "xxx"], col: CELLS.BLUE },
  ELL2: { grid: ["..x", "xxx"], col: CELLS.ORANGE },
  SQUARE: { grid: ["xx", "xx"], col: CELLS.YELLOW },
  STEP: { grid: [".xx", "xx."], col: CELLS.GREEN },
  TEE: { grid: [".x.", "xxx"], col: CELLS.PURPLE },
  STEP2: { grid: ["xx.", ".xx"], col: CELLS.RED },
};

const SHAPE_NAMES = Object.keys(SHAPES);

class App {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.numEntries = this.width * this.height;
    this.score = 0;
    this.board = Array(this.width * this.height).fill(0);
  }

  randomInt(a, b) {
    return Math.floor(Math.random() * (b - a) + a);
  }

  randomFromArray(array) {
    const idx = this.randomInt(0, array.length);
    return array[idx];
  }

  randomShape() {
    return SHAPES[this.randomFromArray(SHAPE_NAMES)];
  }

  fitsOnBoard(shape, x, y) {
    const width = shape.grid[0].length;
    const height = shape.grid.length;

    return x + width <= this.width && y + height <= this.height;
  }

  setBoard(val, x, y) {
    this.board[y * this.width + x] = val;
  }

  getBoard(x, y) {
    return this.board[y * this.width + x];
  }

  isEmpty(x, y) {
    return this.board[y * this.width + x] === CELLS.EMPTY;
  }

  canPlaceShape(shape, x, y) {
    let canPlace = true;
    if (!this.fitsOnBoard(shape, x, y)) {
      canPlace = false;
    }

    // TODO: Worry about overlaps here!
    const width = shape.grid[0].length;
    const height = shape.grid.length;

    return canPlace;
  }

  placeShape(shape, x, y) {
    const width = shape.grid[0].length;
    const height = shape.grid.length;

    for (let sx = 0; sx < width; sx++) {
      for (let sy = 0; sy < height; sy++) {
        if (shape.grid[sy].charAt(sx) === "x") {
          this.setBoard(shape.col, x + sx, y + sy);
        }
      }
    }
  }

  randomShapes(num = 20) {
    for (let i = 0; i < num; i++) {
      let shape, x, y;

      do {
        shape = this.randomShape();
        const width = shape.grid[0].length;
        const height = shape.grid.length;
        x = this.randomInt(0, this.width - width);
        y = this.randomInt(0, this.height - height);
      } while (!this.canPlaceShape(shape, x, y));

      this.placeShape(shape, x, y);
    }
  }

  clearBoard() {
    for (let i = 0; i < this.numEntries; i++) {
      this.board[i] = CELLS.EMPTY;
    }
  }

  randomBoard() {
    for (let i = 0; i < this.numEntries; i++) {
      this.board[i] = this.randomInt(0, CELL_CLASSES.length);
    }
  }

  newCellEl(cell) {
    const div = document.createElement("div");
    div.classList.add("cell", CELL_CLASSES[cell]);
    div.textContent = "▢";

    return div;
  }

  shapeFits(shapeName, x, y) {}

  shiftBoardDown() {
    this.board.copyWithin(this.width, 0, this.numEntries - this.width);
    for (let i = 0; i < this.width; i++) {
      this.board[i] = CELLS.EMPTY;
    }
  }

  drawBoard(el) {
    el.innerHTML = "";

    for (let i = 0; i < this.numEntries; i++) {
      const cell = this.board[i];
      const cellEl = this.newCellEl(cell);
      el.appendChild(cellEl);
    }
  }
}

// ----------------------------------------------------------------------------

const app = new App(10, 20);

function resetListener() {
  init();
}

let ticks = 0;
let tickSpeed = 1000;
let tickInterval = false;

function tick() {
  ticks++;

  app.randomShapes(1);
  app.shiftBoardDown();
  app.drawBoard(boardEl);

  subHeadingEl.textContent = `Tetris #${ticks}`;
}

// ----------------------------------------------------------------------------

function initControls() {
  resetEl.removeEventListener("click", resetListener);
  resetEl.addEventListener("click", resetListener);

  if (tickInterval) {
    clearInterval(tickInterval);
  }
}

function initDisplay() {
  subHeadingEl.textContent = `Tetris`;

  app.clearBoard();
  // app.randomBoard();
  app.randomShapes(1);
  app.drawBoard(boardEl);

  clock(clockEl);
}

async function init() {
  initControls();
  initDisplay();

  tickInterval = setInterval(tick, tickSpeed);
}

// ----------------------------------------------------------------------------

init();
