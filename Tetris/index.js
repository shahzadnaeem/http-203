import { clock } from "./utils.js";

const mainEl = document.querySelector("#main");
const subHeadingEl = document.querySelector("#subheading");
const resetEl = document.querySelector("#reset");
const pauseEl = document.querySelector("#pause");
const clockEl = document.querySelector("#clock");
const boardEl = document.querySelector("#board");

const CELL_COLOURS = {
  EMPTY: 0,
  RED: 1,
  PURPLE: 2,
  GREEN: 3,
  YELLOW: 4,
  ORANGE: 5,
  BLUE: 6,
  CYAN: 7,
  FIRST: 8,
};

const CELL_CLASSES = Object.keys(CELL_COLOURS).map((k) => k.toLowerCase());

const CELL_CHAR = "x";
const EMPTY_CELL_CHAR = ".";

const SHAPES = {
  LINE4: { grid: ["....", "xxxx"], colour: CELL_COLOURS.CYAN },
  ELL1: { grid: ["x..", "xxx"], colour: CELL_COLOURS.BLUE },
  ELL2: { grid: ["..x", "xxx"], colour: CELL_COLOURS.ORANGE },
  SQUARE: { grid: ["xx", "xx"], colour: CELL_COLOURS.YELLOW },
  STEP: { grid: [".xx", "xx."], colour: CELL_COLOURS.GREEN },
  TEE: { grid: [".x.", "xxx"], colour: CELL_COLOURS.PURPLE },
  STEP2: { grid: ["xx.", ".xx"], colour: CELL_COLOURS.RED },
};

class Shape {
  constructor(rawShape) {
    this.initShape(rawShape);
  }

  initShape(rawShape) {
    this.grid = [...rawShape.grid];
    this.colour = rawShape.colour;
    this.valid = false;

    const maxWidth = this.grid.reduce(
      (width, row) => (row.length > width ? row.length : width),
      0
    );

    if (maxWidth === 0) {
      throw new Error(`Invalid grid: Empty!`);
    }

    if (!this.grid.every((row) => row.length === maxWidth)) {
      throw new Error(`Invalid grid: not all rows same width`);
    }

    if (!this.grid.some((row) => row.includes(CELL_CHAR))) {
      throw new Error(`Invalid grid: No active present!`);
    }

    this.width = maxWidth;
    this.height = this.grid.length;

    while (this.height !== this.width) {
      this.grid.push(EMPTY_CELL_CHAR.repeat(this.width));
      this.height++;
    }

    // Now create internal representation
    this.initGridMatrix();

    this.valid = true;
  }

  initGridMatrix() {
    this.gridMatrix = [];

    for (let x = 0; x < this.width; x++) {
      this.gridMatrix.push(Array(this.height).fill(0));
    }

    const rows = this.grid.map((row) =>
      row.split("").map((ch) => (ch === CELL_CHAR ? 1 : 0))
    );

    let y = 0;
    rows.forEach((row) => {
      let x = 0;
      row.forEach((v) => (this.gridMatrix[x++][y] = v));
      y++;
    });
  }

  hasCellAt(x, y) {
    return this.gridMatrix[x][y] !== 0;
  }

  clonedGridMatrix() {
    return this.gridMatrix.map((col) => [...col]);
  }

  rotateCCW() {
    const origGridMatrix = this.clonedGridMatrix();

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.gridMatrix[x][y] = origGridMatrix[this.height - 1 - y][x];
      }
    }
  }

  rotateCW() {
    const origGridMatrix = this.clonedGridMatrix();

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.gridMatrix[x][y] = origGridMatrix[y][this.width - 1 - x];
      }
    }
  }

  toString() {
    let s = `${this.colour}\n`;
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        s += this.gridMatrix[x][y] ? CELL_CHAR : EMPTY_CELL_CHAR;
      }
      s += "\n";
    }

    return s;
  }
}

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
    const rawShape = SHAPES[this.randomFromArray(SHAPE_NAMES)];

    return new Shape(rawShape);
  }

  fitsOnBoard(shape, x, y) {
    const width = shape.width;
    const height = shape.height;

    return x + width <= this.width && y + height <= this.height;
  }

  setBoard(val, x, y) {
    this.board[y * this.width + x] = val;
  }

  getBoard(x, y) {
    return this.board[y * this.width + x];
  }

  isEmpty(x, y) {
    return this.board[y * this.width + x] === CELL_COLOURS.EMPTY;
  }

  canPlaceShape(shape, x, y) {
    if (!this.fitsOnBoard(shape, x, y)) {
      return false;
    }

    const width = shape.width;
    const height = shape.height;

    for (let sy = 0; sy < height; sy++) {
      for (let sx = 0; sx < width; sx++) {
        if (shape.hasCellAt(sx, sy)) {
          if (!this.isEmpty(x + sx, y + sy)) {
            return false;
          }
        }
      }
    }

    return true;
  }

  placeShape(shape, x, y) {
    console.log(`placeShape()`);
    const width = shape.grid[0].length;
    const height = shape.grid.length;

    let first = true;

    for (let sy = 0; sy < height; sy++) {
      for (let sx = 0; sx < width; sx++) {
        if (shape.hasCellAt(sx, sy)) {
          this.setBoard(first ? -shape.colour : shape.colour, x + sx, y + sy);
          if (first) first = false;
        }
      }
    }
  }

  randomShapes(num = 20) {
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
        x = this.randomInt(0, this.width - width);
        y = this.randomInt(0, this.height - height);
      } while (!this.canPlaceShape(shape, x, y));

      this.placeShape(shape, x, y);
    }
  }

  clearBoard() {
    for (let i = 0; i < this.numEntries; i++) {
      this.board[i] = CELL_COLOURS.EMPTY;
    }
  }

  randomBoard() {
    for (let i = 0; i < this.numEntries; i++) {
      this.board[i] = this.randomInt(0, CELL_CLASSES.length);
    }
  }

  newCellEl(cell) {
    const div = document.createElement("div");
    if (cell < 0) {
      div.classList.add("cell", CELL_CLASSES[-cell]);
      div.classList.add("cell", CELL_CLASSES[CELL_COLOURS.FIRST]);
    } else {
      div.classList.add("cell", CELL_CLASSES[cell]);
    }

    return div;
  }

  shiftBoardDown(rows = 1) {
    const amount = rows * this.width;
    this.board.copyWithin(amount, 0, this.numEntries - amount);
    for (let i = 0; i < amount; i++) {
      this.board[i] = CELL_COLOURS.EMPTY;
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

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 25;

const app = new App(BOARD_WIDTH, BOARD_HEIGHT);

function resetListener() {
  paused = true;
  togglePaused();

  ticks = 0;

  init();
}

let ticks = 0;
let tickSpeed = 1000;
let tickInterval = false;

let paused = false;

function tick() {
  if (paused) {
    return;
  }

  ticks++;

  app.randomShapes(1);
  app.shiftBoardDown();
  app.drawBoard(boardEl);

  subHeadingEl.textContent = `Tetris #${ticks}`;
}

// ----------------------------------------------------------------------------

function togglePaused() {
  paused = !paused;

  if (paused) {
    pauseEl.textContent = "Resume";
  } else {
    pauseEl.textContent = "Pause";
  }
}

function initControls() {
  resetEl.removeEventListener("click", resetListener);
  resetEl.addEventListener("click", resetListener);

  pauseEl.removeEventListener("click", togglePaused);
  pauseEl.addEventListener("click", togglePaused);

  if (tickInterval) {
    clearInterval(tickInterval);
  }
}

function initDisplay() {
  subHeadingEl.textContent = `Tetris`;

  app.clearBoard();
  app.randomShapes(10);
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

for (let key in SHAPES) {
  const sh = SHAPES[key];
  const shape = new Shape(sh);
  console.log(`${key}\n${shape.toString()}`);

  shape.rotateCCW();
  console.log(`${key}:CCW\n${shape.toString()}`);
}
