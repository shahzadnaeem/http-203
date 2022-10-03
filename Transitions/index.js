const mainEl = document.querySelector("#main");
const controlsEl = document.querySelector("#controls");
const resetEl = document.querySelector("#reset");
const pauseEl = document.querySelector("#pause");
const bothDirectionsCheckEl = document.querySelector("#bothDirections");
const secretMessageCheckEl = document.querySelector("#secretMessage");

const SIZE = 40;
const ITEMSZ = 32;

const CALC_XSZ = Math.floor(mainEl.clientWidth / ITEMSZ);
const XSZ = CALC_XSZ; // SIZE;
const CALC_YSZ = Math.floor(mainEl.clientHeight / ITEMSZ);
const YSZ = CALC_YSZ; // SIZE;
const NUMITEMS = XSZ * YSZ;

const FIRSTRANDCHAR = 33;
const LASTRANDCHAR = 96;

function randomChar() {
  return String.fromCharCode(
    Math.floor(Math.random() * (LASTRANDCHAR - FIRSTRANDCHAR) + FIRSTRANDCHAR)
  );
}

class Element {
  constructor(id, char, el) {
    this.id = id;
    this.char = char;
    this.el = el;
  }
}

class Matrix {
  static UPDATE_FREQ = 1;

  constructor(startIdx, length, delta, elements) {
    this.startIdx = startIdx;
    this.length = length;
    this.delta = delta;

    this.elements = elements;

    this.onPos = 0;
    this.offDelay = 10;
    this.offPos = 0;
    // this.restoreDelay = 10;
    // this.restorePos = 0;
    this.done = false;
    this.frameNo = -1;
    this.updateCount = 0;
    this.lastTick = 0;
  }

  tick() {
    if (!this.done) {
      this.frameNo++;
      if (this.frameNo % Matrix.UPDATE_FREQ === 0) {
        this.updateCount++;

        let incOn = false;
        let incOff = false;

        if (this.onPos < this.length) {
          const onIdx = this.startIdx + this.onPos * this.delta;
          const onEl = this.elements[onIdx].el;
          if (secretMessage) {
            onEl.textContent = SECRET_MESSAGE[this.onPos];
          } else {
            onEl.textContent = randomChar();
          }

          onEl.classList.add("fade");
          incOn = true;
        }

        if (
          this.onPos > 0 &&
          this.offDelay-- < 0 &&
          this.offPos < this.length
        ) {
          const offIdx = this.startIdx + this.offPos * this.delta;
          const offEl = this.elements[offIdx].el;
          offEl.textContent = randomChar();
          offEl.classList.remove("fade");
          incOff = true;
        }

        if (this.offPos > 0) {
          // Mush up the chars!
          for (let i = this.offPos; i < this.onPos; i++) {
            if (Math.random() <= 0.3 || i > this.onPos - 3) {
              const idx = this.startIdx + i * this.delta;
              const el = this.elements[idx].el;
              if (!secretMessage) {
                el.textContent = randomChar();
              }
            }
          }
        }

        if (incOn) this.onPos++;
        if (incOff) this.offPos++;

        this.done = this.offPos === this.length;
      }
    }

    return this.done;
  }
}

let chars = Array(NUMITEMS)
  .fill()
  .map((_, i) => randomChar());

let elements = [];
let matrixes = [];

let running = false;
let paused = true;
let frameNo = 0;

let bothDirectionsMatrix = false;
let secretMessage = false;

// ----------------------------------------------------------------------------

// TODO: Make this a frame based animation and manually adjust each cell per frame

const SECRET_MESSAGE = "Iman Iman Iman Iman Iman Iman Iman Iman ";

function addRandomMatrix() {
  const FRAMES_PER_ADD = 3;

  if (frameNo % FRAMES_PER_ADD === 0) {
    const vertical = bothDirectionsMatrix ? Math.random() > 0.5 : true;
    const start = Math.floor((Math.random() * SIZE) / 2);
    const length = SIZE - start; // Math.floor(Math.random() * (SIZE - start));

    const offset = Math.floor(Math.random() * SIZE);
    const delta = vertical ? SIZE : 1;
    const startIdx = vertical ? SIZE * start + offset : SIZE * offset + start;

    const matrix = new Matrix(startIdx, length, delta, elements);

    // console.log(`Added Matrix(${startIdx}, ${length}, ${delta})`);

    matrixes.push(matrix);
  }
}

function updateMatrixes() {
  if (matrixes.length) {
    const startCount = matrixes.length;
    let someDone = false;

    matrixes.forEach((mtx) => {
      if (mtx.tick()) someDone = true;
    });

    if (someDone) {
      matrixes = matrixes.filter((mat) => !mat.done);
    }
  }
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

function startRunning() {
  console.log(`startRunning(): START`);
  running = true;

  pauseEl.removeAttribute("disabled");
  pauseEl.removeEventListener("click", togglePaused);
  pauseEl.addEventListener("click", togglePaused);

  paused = true;
  togglePaused();
  console.log(`startRunning(): END`);
}

function resetListener() {
  bothDirectionsMatrix = false;
  secretMessage = false;
  init();
}

let animateInterval = false;

// --------------------------------------------------------------------------

function bothDirectionsListener(ev) {
  bothDirectionsMatrix = ev.target.checked;
  bothDirectionsCheckEl.removeEventListener("change", bothDirectionsListener);

  init();
}

// --------------------------------------------------------------------------

function secretMessageListener(ev) {
  secretMessage = ev.target.checked;
  secretMessageCheckEl.removeEventListener("change", secretMessageListener);

  init();
}

function initControls() {
  if (animateInterval) {
    clearInterval(animateInterval);
    animateInterval = false;
  }

  // --------------------------------------------------------------------------

  resetEl.addEventListener("click", resetListener);

  bothDirectionsCheckEl.checked = bothDirectionsMatrix;
  secretMessageCheckEl.checked = secretMessage;

  bothDirectionsCheckEl.addEventListener("change", bothDirectionsListener);
  secretMessageCheckEl.addEventListener("change", secretMessageListener);
}

// ----------------------------------------------------------------------------

function focusListener(ev) {
  ev.target.classList.add("fade");
}

function blurListener(ev) {
  const BLUR_DELAY = 20 * frameInterval;

  setTimeout(() => {
    ev.target.classList.remove("fade");
  }, BLUR_DELAY);
}

function charBlipper(el) {
  const BLIP_DELAY = 20 * frameInterval;

  el.classList.add("blip");

  setTimeout(() => {
    el.classList.remove("blip");
  }, BLIP_DELAY);
}

// ----------------------------------------------------------------------------

function initDisplay() {
  console.log(
    `CALC_XSZ = ${CALC_XSZ}, CALC_YSZ = ${CALC_YSZ}, NUMITEMS' = ${
      CALC_XSZ * CALC_YSZ
    }`
  );
  console.log(`XSZ = ${XSZ}, YSZ = ${YSZ}, NUMITEMS = ${NUMITEMS}`);

  charElems = chars.map((c, id) => {
    const el = document.createElement("span");

    el.addEventListener("mouseover", focusListener);
    el.addEventListener("mouseleave", blurListener);

    el.textContent = c;

    elements.push(new Element(id, c, el));

    return el;
  });

  mainEl.append(...charElems);

  setTimeout(() => {
    elements.forEach((elem) => elem.el.classList.add("new"));

    setTimeout(() => {
      // Remove or this prevents 'fade' from working
      elements.forEach((elem) => elem.el.classList.remove("new"));

      startRunning();
    }, 1000);
  }, 300);
}

// ----------------------------------------------------------------------------

let framesPerSecond = 25;
let frameInterval = Math.floor(1000 / framesPerSecond);

function calcFrameDelay(n) {
  return n * frameInterval;
}

function secondsToFrames(n) {
  return n * framesPerSecond;
}

function init() {
  console.log(`mainEl = ${mainEl.clientWidth} x ${mainEl.clientHeight}`);

  const rootFontSize = getComputedStyle(
    document.documentElement
  ).getPropertyValue("--font-size");
  console.log(`:root --fontsize = ${rootFontSize}`);

  mainEl.innerHTML = "";

  elements = [];
  matrixes = [];

  running = false;
  paused = true;
  frameNo = 0;

  initControls();

  initDisplay();

  // --------------------------------------------------------------------------

  animateInterval = setInterval(animate, frameInterval);
}

// ----------------------------------------------------------------------------

function getRandomElement() {
  const idx = Math.floor(Math.random() * elements.length);
  const elem = elements[idx];

  return elem;
}

const DEFAULT_RANDOM_CHARS_TO_CHANGE = 3;

function randomCharChange(numChars = DEFAULT_RANDOM_CHARS_TO_CHANGE) {
  for (let i = 0; i < numChars; i++) {
    const elem = getRandomElement();

    if (!elem.active) {
      if (Math.random() <= 0.1) {
        charBlipper(elem.el);
      }

      elem.el.textContent = randomChar();
    }
  }
}

// ----------------------------------------------------------------------------

function animate() {
  if (running && !paused) {
    frameNo++;

    randomCharChange();
    addRandomMatrix();
    updateMatrixes();
  }
}

// ----------------------------------------------------------------------------

init();
