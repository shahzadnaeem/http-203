const mainEl = document.querySelector("#main");
const bothDirectionsCheckEl = document.querySelector("#bothDirections");

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

// ----------------------------------------------------------------------------

// TODO: Make this a frame based animation and manually adjust each cell per frame

const HIDDEN_MESSAGE = "Iman Iman Iman Iman Iman Iman Iman Iman ";

function fadeElement(el) {}

function addFadingLine() {
  const vertical = bothDirectionsMatrix ? Math.random() > 0.5 : true;
  const start = Math.floor(Math.random() * SIZE);
  const length = SIZE - start; // Math.floor(Math.random() * (SIZE - start));

  const offset = Math.floor(Math.random() * SIZE);
  const delta = vertical ? SIZE : 1;
  const startIdx = vertical ? SIZE * start + offset : SIZE * offset + start;
  const delayDelta = 50;

  // Loop from the start to the end - vertical or horizontal
  for (let i = start; i < start + length; i++) {
    const idx = startIdx + (i - start) * delta;

    const el = charElems[idx];

    setTimeout(() => {
      el.textContent = HIDDEN_MESSAGE[i - start];
      el.classList.add("fade");

      // Add random char updates
      for (let i = 1; i <= 5; i++) {
        setTimeout(() => {
          el.textContent = randomChar();
        }, 650 + delayDelta * i);
      }

      // Finalise by removing 'fade'
      activeElems[idx] = setTimeout(() => {
        activeElems[idx] = false;
        el.classList.remove("fade");
      }, (delayDelta * length) / 2);
    }, (i - start) * delayDelta);
  }
}

function randomCharChange() {
  const BATCH_SIZE = 10;

  for (let i = 0; i < BATCH_SIZE; i++) {
    const idx = Math.floor(Math.random() * charElems.length);
    if (!activeElems[idx]) {
      const el = charElems[idx];
      el.textContent = randomChar();
    }
  }
}

// ----------------------------------------------------------------------------

let addFadingLineInterval = false;
let randomCharChangeInterval = false;
let bothDirectionsMatrix = false;

function init() {
  console.log(`mainEl = ${mainEl.clientWidth} x ${mainEl.clientHeight}`);

  mainEl.innerHTML = "";
  if (addFadingLineInterval) {
    clearInterval(addFadingLineInterval);
    addFadingLineInterval = false;
  }
  if (randomCharChangeInterval) {
    clearInterval(randomCharChangeInterval);
    randomCharChangeInterval = false;
  }

  bothDirectionsCheckEl.checked = bothDirectionsMatrix;

  function bothDirectionsListener(ev) {
    bothDirectionsMatrix = ev.target.checked;
    bothDirectionsCheckEl.removeEventListener("change", bothDirectionsListener);
    init();
  }

  bothDirectionsCheckEl.addEventListener("change", bothDirectionsListener);

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

  mainEl.append(...charElems);

  activeElems = chars.map((c) => false);

  addFadingLineInterval = setInterval(addFadingLine, 50);
  randomCharChangeInterval = setInterval(randomCharChange, 10);
}

// ----------------------------------------------------------------------------

init();
