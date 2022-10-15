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

export class App {
  constructor(width, height, elements) {
    this.theBoard = new Board(width, height);

    const NEXT_SHAPE_BOARD_SIZE = 4;

    this.nextShapeBoard = new Board(
      NEXT_SHAPE_BOARD_SIZE,
      NEXT_SHAPE_BOARD_SIZE
    );

    // NOTE: Demo board!
    const DEMO_BOARD_WIDTH = 10;
    const DEMO_BOARD_HEIGHT = 18;
    this.demoBoard = new Board(DEMO_BOARD_WIDTH, DEMO_BOARD_HEIGHT);

    this.elements = elements;

    this.highScore = 0;

    // Keyboard handler
    document.addEventListener("keydown", (ev) => this.recordKeyPress(ev));

    this.initGameData();
  }

  initGameData() {
    this.initPosition();
    this.currShape = this.randomShape();
    this.nextShape = this.randomShape();

    this.tickNo = 0;
    this.minTickPlayRate = 5;
    this.tickPlayRate = 30; // Move piece after this many ticks
    this.ticksPerSec = 50;
    this.commands = [];
    this.lines = 0;
    this.score = 0;
    this.nextTimeAdjustScore = this.TimeAdjustScoreInc = 100;
    this.playTime = 0;
    this.gameOver = false;
  }

  initPosition() {
    this.position = { x: Math.floor(this.theBoard.width / 2) - 1, y: 0 };
  }

  newGame() {
    if (this.score > this.highScore) {
      this.highScore = this.score;
    }

    this.initGameData();
    this.initUI();
  }

  initUI() {
    this.nextShapeBoard.clearBoard();
    this.drawNextShape(this.elements.NEXTSHAPE);

    // START
    this.theBoard.clearBoard();
    this.theBoard.placeShape(this.currShape, this.position.x, this.position.y);

    this.demoBoard.clearBoard();
    this.demoBoard.drawBoard(this.elements.DEMOBOARD);

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
      if (ev.code === "Space") {
        this.newGame();
      }
    }
  }

  pickNextShape() {
    this.initPosition();
    this.currShape = this.nextShape;
    this.nextShape = this.randomShape();
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

  drawNextShape() {
    const width = this.nextShape.width;
    const height = this.nextShape.height;
    const yoffs = height < 4 ? 1 : 0;
    const xoffs = width < 4 ? 1 : 0;

    this.nextShapeBoard.clearBoard();
    this.nextShapeBoard.placeShape(this.nextShape, xoffs, yoffs);

    this.nextShapeBoard.drawBoard(this.elements.NEXTSHAPE);
  }

  drawDemoBoard() {
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

    // if (this.tickNo % 50 === 1) {
    //   demoShapes.forEach((shape, i) => {
    //     let shapeX = (i % 2) * 5 + 1;
    //     let shapeY = Math.floor(i / 2) * 4 + 1;
    //     if (i > 1) shapeY++;
    //     if (this.tickNo > 1) {
    //       this.demoBoard.removeShape(shape, shapeX, shapeY);
    //       if (i % 2 == 0) {
    //         shape.rotateCCW();
    //       } else {
    //         shape.rotateCW();
    //       }
    //     }
    //     this.demoBoard.placeShape(shape, shapeX, shapeY);
    //   });
    //   this.demoBoard.drawBoard(this.elements.DEMOBOARD);
    // }
  }

  drawScore() {
    this.elements.HIGHSCORE.textContent = `High Score: ${this.highScore}`;
    this.elements.SCORE.textContent = `Score: ${this.score}, Rows: ${this.lines}`;
  }

  drawNext() {
    this.elements.NEXT.textContent = `Next Shape`;
    this.elements.NEXT.classList.remove("gameOver");
  }

  drawGameOver() {
    this.elements.NEXT.textContent = "GAME OVER!";
    this.elements.NEXT.classList.add("gameOver");
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

  down() {
    let newPicked = false;

    const newY = this.position.y + 1;

    this.theBoard.removeShape(this.currShape, this.position.x, this.position.y);
    if (this.theBoard.canPlaceShape(this.currShape, this.position.x, newY)) {
      this.position.y = newY;
    }
    this.theBoard.placeShape(this.currShape, this.position.x, this.position.y);

    if (this.position.y !== newY) {
      newPicked = true;
      this.score++;
      this.pickNextShape();

      this.lines += this.theBoard.removeCompleteRows();
      this.score += 100 * this.lines;

      this.gameOver = !this.theBoard.canPlaceShape(
        this.currShape,
        this.position.x,
        this.position.y
      );

      this.theBoard.placeShape(
        this.currShape,
        this.position.x,
        this.position.y
      );
    }

    this.redraw();

    return newPicked;
  }

  left() {
    const newX = this.position.x - 1;

    this.theBoard.removeShape(this.currShape, this.position.x, this.position.y);
    if (this.theBoard.canPlaceShape(this.currShape, newX, this.position.y)) {
      this.position.x = newX;
    }
    this.theBoard.placeShape(this.currShape, this.position.x, this.position.y);

    this.redraw();
  }

  right() {
    const newX = this.position.x + 1;

    this.theBoard.removeShape(this.currShape, this.position.x, this.position.y);
    if (this.theBoard.canPlaceShape(this.currShape, newX, this.position.y)) {
      this.position.x = newX;
    }
    this.theBoard.placeShape(this.currShape, this.position.x, this.position.y);

    this.redraw();
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
    let rowsDropped = 0;
    do {
      done = this.down();
      if (!done) {
        rowsDropped++;
      }
    } while (!done);

    if (rowsDropped > 1) {
      this.score++;
      this.redraw();
    }
  }

  doCommand() {
    const command = this.commands.shift();
    // console.log(`command: ${command}...`);

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
    if (this.gameOver) {
      this.drawGameOver();
    } else {
      this.theBoard.drawBoard(this.elements.BOARD);
      this.drawPlayTime();
      this.drawScore();
      this.drawNext();
      this.drawNextShape();
    }
  }

  tick(tickNo) {
    if (this.gameOver) {
      return;
    }

    this.tickNo++;

    if (this.tickNo % 50 === 0) {
      this.playTime++;
    }

    this.drawDemoBoard();

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
