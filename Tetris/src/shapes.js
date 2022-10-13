import { CELL_COLOURS } from "./board.js";

export const SHAPES = {
  LINE4: { grid: ["....", "xxxx"], colour: CELL_COLOURS.CYAN },
  ELL1: { grid: ["x..", "xxx"], colour: CELL_COLOURS.BLUE },
  ELL2: { grid: ["..x", "xxx"], colour: CELL_COLOURS.ORANGE },
  SQUARE: { grid: ["xx", "xx"], colour: CELL_COLOURS.YELLOW },
  STEP: { grid: [".xx", "xx."], colour: CELL_COLOURS.GREEN },
  TEE: { grid: [".x.", "xxx"], colour: CELL_COLOURS.PURPLE },
  STEP2: { grid: ["xx.", ".xx"], colour: CELL_COLOURS.RED },
  // Extras!
  ZIG: { grid: ["x.", ".."], colour: CELL_COLOURS.PINK },
  FISH: { grid: ["xx.", "xxx"], colour: CELL_COLOURS.LIME },
  FANG: { grid: ["xx", " x"], colour: CELL_COLOURS.NIGHT },
};

export const SHAPE_NAMES = Object.keys(SHAPES);
