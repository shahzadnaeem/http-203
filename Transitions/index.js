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
let activeElems = [];   // Elements with something going on

const STATES = {
  IDLE: "IDLE",
  FADE_IN: "FADING_IN",
  FADE_OUT: "FADING_OUT"
}


class Element {
  constructor(id) {
    this.id = id;
    this.active = false;
    this.activeFrame = 0;
    this.frames = 0;
    this.state = STATES.IDLE;
  }
}

// ----------------------------------------------------------------------------

// TODO: Make this a frame based animation and manually adjust each cell per frame

const SECRET_MESSAGE = "Iman Iman Iman Iman Iman Iman Iman Iman ";
const FADE_IN = 350; // From custom.css!
const FADE_OUT = 250;
const VISIBLE = 650 - FADE_OUT;
const PRE_DUR = 300;

function fadeElement(el) {}

function addFadingLine() {
  const vertical = bothDirectionsMatrix ? Math.random() > 0.5 : true;
  const start = Math.floor(Math.random() * SIZE / 2);
  const length = SIZE - start; // Math.floor(Math.random() * (SIZE - start));

  const offset = Math.floor(Math.random() * SIZE);
  const delta = vertical ? SIZE : 1;
  const startIdx = vertical ? SIZE * start + offset : SIZE * offset + start;
  const delayDelta = 50;

  // Loop from the start to the end - vertical or horizontal
  for (let i = start; i < start + length; i++) {
    const idx = startIdx + (i - start) * delta;

    const el = charElems[idx];

    const activationDelay = (i - start) * delayDelta;

    setTimeout(() => {
      if (secretMessage) {
        el.textContent = SECRET_MESSAGE[i - start];
      } else {
        el.textContent = randomChar();
      }

      // el.classList.add("fade");

      // Add random char updates - after fading
      for (let i = 1; i <= Math.floor(PRE_DUR / delayDelta); i++) {
        setTimeout(() => {
          el.textContent = randomChar();
        }, activationDelay + delayDelta * i + FADE_IN);
      }

      // Finalise by removing 'fade'
      activeElems[idx] = setTimeout(() => {
        activeElems[idx] = false;
        el.classList.remove("fade");
      }, VISIBLE);
    }, activationDelay);

    // Add pre start random char updates
    const numTimeouts = Math.floor(PRE_DUR / delayDelta);
    for (let i = 1; i <= numTimeouts; i++) {
      setTimeout(() => {
        if ( i > numTimeouts / 2 ) {
          el.classList.add("fade");
        }
        el.textContent = randomChar();
      }, activationDelay - PRE_DUR * 1.5 + delayDelta * i);
    }
  }
}

const DEFAULT_RANDOM_CHARS_TO_CHANGE = 10;

function randomCharChange(numChars = DEFAULT_RANDOM_CHARS_TO_CHANGE) {
  for (let i = 0; i < numChars; i++) {
    const idx = Math.floor(Math.random() * charElems.length);
    if (!activeElems[idx]) {
      const el = charElems[idx];
      el.textContent = randomChar();
    }
  }
}

// ----------------------------------------------------------------------------

const optionsEls = [];

const resetEl = document.querySelector('#reset');

// const bothDirectionsCheckEl = document.querySelector("#bothDirections");
// const secretMessageCheckEl = document.querySelector("#secretMessage")

let animateInterval = false;

// let bothDirectionsMatrix = false;
// let secretMessage = false;

function initControls() {
  if (animateInterval) {
    clearInterval(animateInterval);
    animateInterval = false;
  }

  // --------------------------------------------------------------------------

  function resetListener() {
    init();
  }

  resetEl.addEventListener('click', resetListener);

  // --------------------------------------------------------------------------

  // bothDirectionsCheckEl.checked = bothDirectionsMatrix;

  // function bothDirectionsListener(ev) {
  //   bothDirectionsMatrix = ev.target.checked;
  //   bothDirectionsCheckEl.removeEventListener("change", bothDirectionsListener);
  //   init();
  // }

  // bothDirectionsCheckEl.addEventListener("change", bothDirectionsListener);

  // // --------------------------------------------------------------------------

  // secretMessageCheckEl.checked = secretMessage;

  // function secretMessageListener(ev) {
  //   secretMessage = ev.target.checked;
  //   secretMessageCheckEl.removeEventListener("change", secretMessageListener);
  //   init();
  // }

  // secretMessageCheckEl.addEventListener("change", secretMessageListener);
}

// ----------------------------------------------------------------------------

function focusListener(ev) {
  ev.target.classList.add('fade');
}

function blurListener(ev) {
  const BLUR_DELAY = 20 * frameInterval;

  setTimeout(() => {
    ev.target.classList.remove('fade');
  }, BLUR_DELAY)
}

function initDisplay() {
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

    el.addEventListener('mouseover', focusListener);
    el.addEventListener('mouseleave', blurListener);

    el.textContent = c;

    return el;
  });

  mainEl.append(...charElems);

  setTimeout( () => {
    charElems.forEach(el => el.classList.add('new'));

    setTimeout( () => {
      // Remove or this prevents 'fade' from working
      charElems.forEach(el => el.classList.remove('new'));
    }, 1000);
  }, 300);

  activeElems = chars.map((c) => false);
}

// ----------------------------------------------------------------------------

let framesPerSecond = 25;
let frameInterval = Math.floor(1000/framesPerSecond);

function calcFrameDelay(n) {
  return n * frameInterval;
}


function init() {
  console.log(`mainEl = ${mainEl.clientWidth} x ${mainEl.clientHeight}`);

  const rootFontSize = getComputedStyle(document.documentElement).getPropertyValue('--font-size');
  console.log(`:root --fontsize = ${rootFontSize}`);

  mainEl.innerHTML = "";

  initControls();

  initDisplay();

  // --------------------------------------------------------------------------

  animateInterval = setInterval(animate, frameInterval);
}

// ----------------------------------------------------------------------------

function animate() {
  randomCharChange();
}

// ----------------------------------------------------------------------------

init();
