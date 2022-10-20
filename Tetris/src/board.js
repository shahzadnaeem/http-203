export const CELL_COLOURS = {
  EMPTY: 0,
  RED: 1,
  PURPLE: 2,
  GREEN: 3,
  YELLOW: 4,
  ORANGE: 5,
  BLUE: 6,
  CYAN: 7,
  FIRST: 8,
  PINK: 9,
  LIME: 10,
  NIGHT: 11,
  GHOST: 12,
  FIRE: 13,
  WHITE: 14,
};

const CELL_CLASSES = Object.keys(CELL_COLOURS).map((k) => k.toLowerCase());

export class Board {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.numEntries = this.width * this.height;
    this.board = Array(this.width * this.height).fill(0);
    this.rowsDeleted = 0;
  }

  isOnBoard(x, y) {
    return x < this.width && x >= 0 && y < this.height && y >= 0;
  }

  fitsOnBoard(shape, x, y) {
    const width = shape.width;
    const height = shape.height;

    if (!this.isOnBoard(x, y)) {
      return false;
    }

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
    const width = shape.width;
    const height = shape.height;

    for (let sy = 0; sy < height; sy++) {
      for (let sx = 0; sx < width; sx++) {
        if (shape.hasCellAt(sx, sy)) {
          if (
            !this.isOnBoard(x + sx, y + sy) ||
            !this.isEmpty(x + sx, y + sy)
          ) {
            return false;
          }
        }
      }
    }

    return true;
  }

  placeShape(shape, x, y) {
    const width = shape.width;
    const height = shape.height;

    for (let sy = 0; sy < height; sy++) {
      for (let sx = 0; sx < width; sx++) {
        if (shape.hasCellAt(sx, sy)) {
          this.setBoard(
            shape.isFirst(sx, sy) ? -shape.colour : shape.colour,
            x + sx,
            y + sy
          );
        }
      }
    }
  }

  removeShape(shape, x, y) {
    const width = shape.width;
    const height = shape.height;

    for (let sy = 0; sy < height; sy++) {
      for (let sx = 0; sx < width; sx++) {
        if (shape.hasCellAt(sx, sy)) {
          this.setBoard(CELL_COLOURS.EMPTY, x + sx, y + sy);
        }
      }
    }
  }

  clearBoard() {
    for (let i = 0; i < this.numEntries; i++) {
      this.board[i] = CELL_COLOURS.EMPTY;
    }
  }

  randomInt(a, b) {
    return Math.floor(Math.random() * (b - a) + a);
  }

  setRandomRow() {
    const y = this.randomInt(0, this.height);

    for (let x = 0; x < this.width; x++) {
      if (!this.getBoard(x, y)) {
        this.setBoard(CELL_COLOURS.WHITE, x, y);
      }
    }
  }

  newCellEl(cell, i) {
    const div = document.createElement("div");
    if (cell < 0) {
      div.classList.add("cell", CELL_CLASSES[-cell]);
      div.classList.add("cell", CELL_CLASSES[CELL_COLOURS.FIRST]);
    } else {
      div.classList.add("cell", CELL_CLASSES[cell]);
    }
    if (i % 2 === 0) {
      div.classList.add("cellAlt");
    }

    const row = Math.floor(i / this.width);
    const col = i % this.width;

    // Row, Col number on Board
    // if (row === 0) {
    //   div.textContent = `${(col + 1) % 10}`;
    // } else if (col === 0) {
    //   div.textContent = `${(row + 1) % 10}`;
    // }

    return div;
  }

  shiftBoardDown(rows = 1) {
    const amount = rows * this.width;
    this.board.copyWithin(amount, 0, this.numEntries - amount);
    for (let i = 0; i < amount; i++) {
      this.board[i] = CELL_COLOURS.EMPTY;
    }
  }

  removeRow(row) {
    this.board.copyWithin(
      this.width,
      0,
      this.numEntries - (this.height - row) * this.width
    );
    for (let i = 0; i < this.width; i++) {
      this.board[i] = CELL_COLOURS.EMPTY;
    }

    this.rowsDeleted++;
  }

  isRowComplete(row) {
    for (let x = 0; x < this.width; x++) {
      if (!this.board[row * this.width + x]) {
        return false;
      }
    }

    return true;
  }

  removeCompleteRows() {
    let completed = 0;

    for (let y = 0; y < this.height; y++) {
      if (this.isRowComplete(y)) {
        this.removeRow(y);
        completed++;
      }
    }

    return completed;
  }

  drawBoard(el) {
    el.innerHTML = "";

    for (let i = 0; i < this.numEntries; i++) {
      const cell = this.board[i];
      const cellEl = this.newCellEl(cell, i);
      el.appendChild(cellEl);
    }
  }
}
