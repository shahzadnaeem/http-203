import { SHAPES, SHAPE_NAMES } from "./shapes.js";
import { Shape } from "./shape.js";
import { Board } from "./board.js";

const COMMANDS = {
  ROTATE: 1,
  LEFT: 2,
  RIGHT: 3,
  DOWN: 4,
  DROP: 5,
};

const COMMAND_NAMES = Object.keys(COMMANDS);

let demoShapes = SHAPE_NAMES.map((k) => new Shape(SHAPES[k]));
let demoShapesByName = {};
SHAPE_NAMES.forEach((name, i) => (demoShapesByName[name] = demoShapes[i]));

const SHAPE_BOARD_SIZE = 4;

export class App {
  constructor(width, height, elements, ticksPerSec) {
    this.theBoard = new Board(width, height);
    this.elements = elements;
    this.ticksPerSec = ticksPerSec;

    // this.nextShapeBoard = new Board(SHAPE_BOARD_SIZE, SHAPE_BOARD_SIZE);

    this.showDemoBoard = false;

    if (this.showDemoBoard) {
      const DEMO_BOARD_WIDTH = 10;
      const DEMO_BOARD_HEIGHT = 18;
      this.demoBoard = new Board(DEMO_BOARD_WIDTH, DEMO_BOARD_HEIGHT);
      this.elements.DEMOBOARD.classList.remove("hidden");
    } else {
      this.elements.DEMOBOARD.classList.add("hidden");
    }

    this.highScore = 0;

    // Keyboard handler
    document.addEventListener("keydown", (ev) => this.recordKeyPress(ev));

    this.initGameData();
  }

  initGameData() {
    this.initShapeStats();

    this.pickNextShape(true);
    this.rowsDropped = 0;

    this.tickNo = 0;
    this.minTickPlayRate = Math.floor(0.2 * this.ticksPerSec);
    this.tickPlayRate = Math.floor(0.8 * this.ticksPerSec); // Move piece after this many ticks
    this.commands = [];
    this.lines = 0;
    this.score = 0;
    this.nextTimeAdjustScore = 1000;
    this.TimeAdjustScoreInc = 1000;
    this.playTime = 0;
    this.gameOver = false;
  }

  initShapeStats() {
    this.shapeStats = {};

    SHAPE_NAMES.forEach((name) => {
      this.shapeStats[name] = { name, count: 0 };
    });
  }

  initPosition() {
    this.position = { x: Math.floor(this.theBoard.width / 2) - 1, y: 0 };
  }

  pickNextShape(start = false) {
    this.initPosition();
    this.currShape = start ? this.randomShape() : this.nextShape;
    this.nextShape = this.randomShape();
  }

  newGame() {
    if (this.score > this.highScore) {
      this.highScore = this.score;
    }

    this.initGameData();
    this.initUI();
  }

  initUI() {
    this.drawNextShape(this.elements.NEXTSHAPE);

    // START
    this.theBoard.clearBoard();
    this.theBoard.placeShape(this.currShape, this.position.x, this.position.y);

    if (this.showDemoBoard) {
      this.demoBoard.clearBoard();
      this.demoBoard.drawBoard(this.elements.DEMOBOARD);
    }

    this.redraw();
  }

  recordKeyPress(ev) {
    if (!this.gameOver) {
      if (this.commands.length > 2) {
        return;
      }

      switch (ev.code) {
        case "ArrowUp":
          this.commands.push(COMMANDS.ROTATE);
          break;
        case "ArrowLeft":
          this.commands.push(COMMANDS.LEFT);
          break;
        case "ArrowRight":
          this.commands.push(COMMANDS.RIGHT);
          break;
        case "ArrowDown":
          this.commands.push(COMMANDS.DOWN);
          break;
        case "Space":
          this.commands.push(COMMANDS.DROP);
          break;
      }
    } else {
      if (ev.code === "Enter" || ev.code === "Space") {
        this.newGame();
      }
    }
  }

  randomInt(a, b) {
    return Math.floor(Math.random() * (b - a) + a);
  }

  randomFromArray(array) {
    const idx = this.randomInt(0, array.length);
    return array[idx];
  }

  randomShape() {
    const shapeName = this.randomFromArray(SHAPE_NAMES);
    const rawShape = SHAPES[shapeName];

    this.shapeStats[shapeName].count++;

    return new Shape(rawShape);
  }

  randomlyPlaceShape(board, shape, num = 20, below = 0) {
    for (let i = 0; i < num; i++) {
      let x, y;
      let clonedShape = shape.clone();
      let tries = 0;

      do {
        tries++;
        if (tries > 5) {
          return false;
        }

        const rand = Math.floor(Math.random() * 4);

        for (let i = 0; i < rand; i++) {
          clonedShape.rotateCCW();
        }

        const width = clonedShape.width;
        const height = clonedShape.height;
        x = this.randomInt(0, board.width - width + 1);
        y = this.randomInt(0, board.height - height - below + 1) + below;
      } while (!board.canPlaceShape(clonedShape, x, y));

      board.placeShape(clonedShape, x, y);
    }

    return true;
  }

  randomShapes(board, num = 20, below = 0) {
    for (let i = 0; i < num; i++) {
      const shape = this.randomShape();
      if (!this.randomlyPlaceShape(board, shape, num, below)) {
        return false;
      }
    }
  }

  drawShapeTo(shape, boardEl) {
    const width = shape.width;
    const height = shape.height;
    const yoffs = height < SHAPE_BOARD_SIZE ? 1 : 0;
    const xoffs = width < SHAPE_BOARD_SIZE ? 1 : 0;

    const board = new Board(SHAPE_BOARD_SIZE, SHAPE_BOARD_SIZE);
    board.placeShape(shape, xoffs, yoffs);
    board.drawBoard(boardEl);
    boardEl.classList.add("shapeBoard");
  }

  drawNextShape() {
    this.drawShapeTo(this.nextShape, this.elements.NEXTSHAPE);

    this.elements.NEXTSHAPE.classList.remove("gameOver");
  }

  drawDemoBoard(random = false) {
    if (random) {
      if (this.tickNo % 50 === 1) {
        this.demoBoard.shiftBoardDown();

        if (Math.floor(this.tickNo / 50) % 5 === 3) {
          this.demoBoard.setRandomRow();
        }
        if (Math.floor(this.tickNo / 50) % 5 === 0) {
          this.demoBoard.removeCompleteRows();
          this.randomlyPlaceShape(this.demoBoard, this.randomShape(), 3);
        }
        this.demoBoard.drawBoard(this.elements.DEMOBOARD);
      }
    } else {
      if (this.tickNo % 250 === 1) {
        demoShapes.forEach((shape, i) => {
          let shapeX = (i % 2) * 5 + 1;
          let shapeY = Math.floor(i / 2) * 4 + 1;
          if (i > 1) shapeY++;
          if (this.tickNo > 1) {
            this.demoBoard.removeShape(shape, shapeX, shapeY);
            if (i % 2 == 0) {
              shape.rotateCCW();
            } else {
              shape.rotateCCW();
              // shape.rotateCW();
            }
          }
          this.demoBoard.placeShape(shape, shapeX, shapeY);
        });
        this.demoBoard.drawBoard(this.elements.DEMOBOARD);
      }
    }
  }

  drawScore() {
    this.elements.HIGHSCORE.textContent = `High Score: ${this.highScore}`;
    this.elements.SCORE.textContent = `Score: ${this.score}, Lines: ${this.lines}`;
  }

  drawNext() {
    this.elements.NEXT.textContent = `Next Shape`;
    this.elements.NEXT.classList.remove("gameOver");
  }

  drawGameOver() {
    this.elements.NEXT.textContent = "GAME OVER!";
    this.elements.NEXT.classList.add("gameOver");
    this.elements.NEXTSHAPE.classList.add("gameOver");
  }

  padNum(num) {
    if (num < 10) {
      return `0${num}`;
    } else {
      return num;
    }
  }

  drawPlayTime() {
    const mins = Math.floor(this.playTime / 60);
    const secs = this.playTime % 60;

    this.elements.PLAYTIME.textContent = `Play Time: ${this.padNum(
      mins
    )}:${this.padNum(secs)}`;
  }

  drawShapeStats() {
    this.elements.SHAPESTATS.innerHTML = "";

    for (let name in this.shapeStats) {
      const stat = this.shapeStats[name];

      const statEl = document.createElement("div");
      statEl.classList.add("shapeStat");
      const shapeEl = document.createElement("div");
      this.drawShapeTo(demoShapesByName[name], shapeEl);
      const countEl = document.createElement("h2");
      countEl.textContent = stat.count;

      statEl.append(shapeEl, countEl);

      this.elements.SHAPESTATS.append(statEl);
    }
  }

  drawStats() {
    this.drawPlayTime();
    this.drawScore();

    if (this.gameOver) {
      this.drawGameOver();
    } else {
      this.drawNext();
      this.drawNextShape();
      this.drawShapeStats();
    }
  }

  down(hard = false) {
    let newPicked = false;

    const newY = this.position.y + 1;

    this.theBoard.removeShape(this.currShape, this.position.x, this.position.y);
    if (this.theBoard.canPlaceShape(this.currShape, this.position.x, newY)) {
      this.position.y = newY;
      this.rowsDropped++;
    }
    this.theBoard.placeShape(this.currShape, this.position.x, this.position.y);

    if (this.position.y !== newY) {
      newPicked = true;
      this.score += hard ? this.rowsDropped * 2 : this.rowsDropped;
      this.pickNextShape();
      this.rowsDropped = 0;

      this.lines += this.theBoard.removeCompleteRows();
      this.score += 100 * this.lines;

      if (
        !this.theBoard.canPlaceShape(
          this.currShape,
          this.position.x,
          this.position.y
        )
      ) {
        this.gameOver = true;
      }

      // Place anyway at end of game
      this.theBoard.placeShape(
        this.currShape,
        this.position.x,
        this.position.y
      );
    }

    this.redraw();

    return newPicked;
  }

  moveHorizontally(newX) {
    this.theBoard.removeShape(this.currShape, this.position.x, this.position.y);
    if (this.theBoard.canPlaceShape(this.currShape, newX, this.position.y)) {
      this.position.x = newX;
    }
    this.theBoard.placeShape(this.currShape, this.position.x, this.position.y);

    this.redraw();
  }

  left() {
    this.moveHorizontally(this.position.x - 1);
  }

  right() {
    this.moveHorizontally(this.position.x + 1);
  }

  rotate() {
    this.theBoard.removeShape(this.currShape, this.position.x, this.position.y);
    this.currShape.rotateCCW();
    if (
      !this.theBoard.canPlaceShape(
        this.currShape,
        this.position.x,
        this.position.y
      )
    ) {
      this.currShape.rotateCW();
    }
    this.theBoard.placeShape(this.currShape, this.position.x, this.position.y);

    this.redraw();
  }

  drop() {
    let done = false;
    do {
      // We are hard dropping
      done = this.down(true);
    } while (!done);
  }

  doCommand() {
    const command = this.commands.shift();

    if (command === COMMANDS.DOWN) {
      this.down();
    } else if (command === COMMANDS.LEFT) {
      this.left();
    } else if (command === COMMANDS.RIGHT) {
      this.right();
    } else if (command === COMMANDS.ROTATE) {
      this.rotate();
    } else if (command === COMMANDS.DROP) {
      this.drop();
    }
  }

  redraw() {
    this.theBoard.drawBoard(this.elements.BOARD);
    this.drawStats();
  }

  // TODO: Need to manage ticks in app - and pause/resume
  tick(tickNo) {
    if (this.gameOver) {
      return;
    }

    this.tickNo++;

    if (this.tickNo % this.ticksPerSec === 0) {
      this.playTime++;

      // NOTE: Keeps time display smooth
      this.drawPlayTime();
    }

    if (this.showDemoBoard) {
      this.drawDemoBoard();
    }

    if (this.commands.length) {
      this.doCommand();
    }

    if (this.tickNo % this.tickPlayRate === 0) {
      this.down();

      this.redraw();

      if (this.score >= this.nextTimeAdjustScore) {
        if (this.tickPlayRate > this.minTickPlayRate) {
          this.tickPlayRate--;
        }
        this.nextTimeAdjustScore = this.score + this.TimeAdjustScoreInc;
      }
    }
  }
}
