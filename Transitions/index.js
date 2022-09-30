const mainEl = document.querySelector("#main");

const FIRSTRANDCHAR = 33;
const LASTRANDCHAR = 96;

const SIZE = 40;
const ITEMSZ = 32;

function randomChar() {
  return String.fromCharCode(
    Math.floor(Math.random() * (LASTRANDCHAR - FIRSTRANDCHAR) + FIRSTRANDCHAR)
  );
}

let chars = [];
let charElems = [];
let activeElems = [];

function init() {
  console.log(`mainEl = ${mainEl.clientWidth} x ${mainEl.clientHeight}`);

  const CALC_XSZ = Math.floor(mainEl.clientWidth / ITEMSZ);
  const XSZ = CALC_XSZ; // SIZE;
  const CALC_YSZ = Math.floor(mainEl.clientHeight / ITEMSZ);
  const YSZ = CALC_YSZ; // SIZE;
  const NUMITEMS = XSZ * YSZ;

  console.log(
    `CALC_XSZ = ${CALC_XSZ}, CALC_YSZ = ${CALC_YSZ}, NUMITEMS' = ${
      CALC_XSZ * CALC_YSZ
    }`
  );
  console.log(`XSZ = ${XSZ}, YSZ = ${YSZ}, NUMITEMS = ${NUMITEMS}`);

  chars = Array(NUMITEMS)
    .fill()
    .map((_, i) => randomChar());

  charElems = chars.map((c) => {
    const el = document.createElement("span");
    el.textContent = c;
    return el;
  });

  // console.log(charElems)

  mainEl.append(...charElems);

  activeElems = chars.map((c) => false);

  setInterval(addFadingLine, 60);
  setInterval(randomCharChange, 10);
}

function fadeElement(el) {}

function addFadingLine() {
  const vertical = Math.random() > 0.5;
  const start = Math.floor(Math.random() * SIZE);
  const length = SIZE - start; // Math.floor(Math.random() * (SIZE - start));

  if (length !== 0) {
    const offset = Math.floor(Math.random() * SIZE);
    const delta = vertical ? SIZE : 1;
    const startIdx = vertical ? SIZE * start + offset : SIZE * offset + start;
    const startDelay = 10;
    const delayDelta = 30;

    // Loop from the start to the end - vertical or horizontal
    for (let i = start; i < start + length; i++) {
      const idx = startIdx + (i - start) * delta;

      if (idx >= charElems.length) {
        // How can this be???
        console.log(
          `DANGER: ${
            vertical ? "V" : "H"
          }: startIdx=${startIdx}, i=${i}, start=${start}, length=${length}, delta=${delta}`
        );
      }

      const el = charElems[idx];

      if (el) {
        setTimeout(() => {
          el.textContent = randomChar();
          el.classList.add("fade");

          activeElems[idx] = setTimeout(() => {
            activeElems[idx] = false;
            el.classList.remove("fade");
            el.textContent = randomChar();
          }, 300);
        }, startDelay + (i - start) * delayDelta);
      } else {
        console.log(`addFadingLine: el undefined!`);
        console.log(
          `  ${
            vertical ? "V" : "H"
          }: start=${start}, length=${length} offset=${offset}, delta=${delta}, idx=${idx}`
        );
      }
    }
  } else {
    console.log(`addFadingLine: length === 0!`);
  }
}

function randomCharChange() {
  for (let i = 0; i < 10; i++) {
    const idx = Math.floor(Math.random() * charElems.length);
    const el = charElems[idx];
    el.textContent = randomChar();
  }
}

init();
