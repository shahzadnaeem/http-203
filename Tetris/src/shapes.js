import { CELL_COLOURS } from "./board.js";

export const SHAPES = {
  LINE4: { name: "LINE4", grid: ["....", "xxxx"], colour: CELL_COLOURS.CYAN },
  ELL1: { name: "ELL1", grid: ["x..", "xxx"], colour: CELL_COLOURS.BLUE },
  ELL2: { name: "ELL2", grid: ["..x", "xxx"], colour: CELL_COLOURS.ORANGE },
  SQUARE: { name: "SQUARE", grid: ["xx", "xx"], colour: CELL_COLOURS.YELLOW },
  STEP: { name: "STEP", grid: [".xx", "xx."], colour: CELL_COLOURS.GREEN },
  TEE: { name: "TEE", grid: [".x.", "xxx"], colour: CELL_COLOURS.PURPLE },
  STEP2: { name: "STEP2", grid: ["xx.", ".xx"], colour: CELL_COLOURS.RED },
  // Extras!
  // XZIG: { name: "XZIG", grid: ["x.", ".."], colour: CELL_COLOURS.PINK },

  // XFISH: { name: "XFISH", grid: ["xx.", "xxx"], colour: CELL_COLOURS.LIME },
  // XFISH2: { name: "XFISH2", grid: ["xx.", "xx.", "..x"], colour: CELL_COLOURS.LIME },
  // XFANG: { name: "XFANG", grid: ["xx", " x"], colour: CELL_COLOURS.NIGHT },
  // XSTAR: {
  //   name: "XSTAR",
  //   grid: [".xx.", "xxxx", "xxxx", ".xx."],
  //   colour: CELL_COLOURS.GHOST,
  // },
  // XPAIR: { name: "XPAIR", grid: ["x.", ".x"], colour: CELL_COLOURS.FIRE },
};

export const SHAPE_NAMES = Object.keys(SHAPES);
