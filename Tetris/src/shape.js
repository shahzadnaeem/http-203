const FIRST_CELL_CHAR = "X";
const CELL_CHAR = "x";
const EMPTY_CELL_CHAR = ".";

export class Shape {
  constructor(rawShape) {
    this.initShape(rawShape);
  }

  initShape(rawShape) {
    this.grid = rawShape.grid;
    this.colour = rawShape.colour;
    this.firstX = this.firstY = -1;
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

    let first = true;
    let y = 0;
    rows.forEach((row) => {
      let x = 0;
      row.forEach((v) => {
        if (v && first) {
          this.firstX = x;
          this.firstY = y;
          first = false;
        }

        this.gridMatrix[x++][y] = v;
      });
      y++;
    });
  }

  hasCellAt(x, y) {
    return this.gridMatrix[x][y] !== 0;
  }

  isFirst(x, y) {
    return x === this.firstX && y === this.firstY;
  }

  cloneGridMatrix() {
    return this.gridMatrix.map((col) => [...col]);
  }

  rotateCCW() {
    const origGridMatrix = this.cloneGridMatrix();

    [this.firstX, this.firstY] = [this.firstY, this.height - 1 - this.firstX];

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.gridMatrix[x][y] = origGridMatrix[this.width - 1 - y][x];
      }
    }
  }

  rotateCW() {
    const origGridMatrix = this.cloneGridMatrix();

    [this.firstX, this.firstY] = [this.width - 1 - this.firstY, this.firstX];

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
        if (this.isFirst(x, y)) {
          s += FIRST_CELL_CHAR;
        } else {
          s += this.gridMatrix[x][y] ? CELL_CHAR : EMPTY_CELL_CHAR;
        }
      }
      s += "\n";
    }

    return s;
  }
}
