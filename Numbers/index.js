const mainEl = document.querySelector("#main");
const toEl = document.querySelector("#to");
const resetEl = document.querySelector("#reset");
const lettersEl = document.querySelector("#letters");
const numLimitEl = document.querySelector("#num-limit");

const START_NUM = 1;
const END_NUM = 20;

let letters = false;
let numLimit = 0;

function resetListener() {
  init();
}

const resizeListener = (function makeResizeListener() {
  const resizeDelay = 500;
  let timeout = false;

  return function resizeListener() {
    clearTimeout(timeout);
    timeout = setTimeout(init, resizeDelay);
  };
})();

function lettersListener(ev) {
  letters = ev.target.checked;
  lettersEl.removeEventListener("change", lettersListener);

  init();
}

function numLimitListener(ev) {
  const newLimit = ev.target.value;

  if (newLimit === "No limit") {
    numLimit = 0;
  } else {
    numLimit = Number(newLimit);
  }
  numLimitEl.removeEventListener("input", numLimitListener);

  init();
}

// ----------------------------------------------------------------------------

function initControls() {
  resetEl.removeEventListener("click", resetListener);
  resetEl.addEventListener("click", resetListener);

  lettersEl.checked = letters;
  lettersEl.addEventListener("change", lettersListener);

  numLimitEl.value = numLimit === 0 ? "No limit" : numLimit;
  numLimitEl.addEventListener("input", numLimitListener);

  removeEventListener("resize", resizeListener);
  addEventListener("resize", resizeListener);
}

function initDisplay() {

  const rects = mainEl.getClientRects();

  console.log(`mainEl.rects = ${JSON.stringify(rects)}`);

  const maxX = mainEl.clientWidth;
  const maxY = mainEl.clientHeight;

  console.log(`mainEl = ${maxX} x ${maxY}`);

  let CALC_END_NUM = Math.floor((maxX * maxY) / (200 * 200));
  CALC_END_NUM -= CALC_END_NUM % 5;

  if (CALC_END_NUM === 0) {
    console.log(`CALC_END_NUM was 0!`);
    CALC_END_NUM = 20;
  }

  if ( CALC_END_NUM > 100 ) {
    CALC_END_NUM = 100;
  }

  if (numLimit) {
    CALC_END_NUM = Math.min(numLimit, CALC_END_NUM);
  }

  // console.log(`CALC_END_NUM = ${CALC_END_NUM}`);

  const SIZES = [80, 110, 145, 190, 225, 250];

  const COLOURS = [
    "crimson",
    "darkorange",
    "darkred",
    "darkgreen",
    "rebeccapurple",
    "navy",
    "firebrick",
  ];

  const extents = [];
  let overlaps = 0;

  function randomFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  function nextSmallerFromArray(array, val) {
    for (let i = array.length - 1; i >= 0; i--) {
      if (array[i] < val) {
        return array[i];
      }
    }
    return array[0];
  }

  function noOverlap(r1, r2) {
    return r1.l > r2.r || r1.r < r2.l || r1.t > r2.b || r1.b < r2.t;
  }

  function isSafe(rect) {
    if (extents.length === 0) return true;

    return extents.every((ext) => {
      return noOverlap(rect, ext);
    });
  }

  function newRect(x, y, sz) {
    return {
      l: x,
      r: x + sz,
      t: y,
      b: y + sz,
      sz: sz,
    };
  }

  function findSafe(rect) {
    const STARTX = Math.floor(Math.random() * 10);
    const STARTY = Math.floor(Math.random() * 10);
    const STEP = Math.floor(Math.random() * 5 + 5);

    for (let x = STARTX; x < maxX - rect.sz; x += STEP) {
      for (let y = STARTY; y < maxY - rect.sz; y += STEP) {
        const alt = newRect(x, y, rect.sz);

        if (isSafe(alt)) {
          console.log(
            `Found spot for ${JSON.stringify(rect)} now ${JSON.stringify(alt)}`
          );

          return alt;
        }
      }
    }

    console.log(`No safe place found for ${JSON.stringify(rect)}`);

    return rect;
  }

  function getNumElem(num) {
    let size = randomFromArray(SIZES.slice(2)); // Start with larger sizes
    const col = randomFromArray(COLOURS);

    let x, y;
    let safe;
    let rect;
    let tryLimit = 50;

    do {
      tryLimit --;

      x = Math.floor(Math.random() * (maxX - size));
      y = Math.floor(Math.random() * (maxY - size));

      rect = newRect(x, y, size);

      safe = isSafe(rect);

      if (!safe) {
        if (tryLimit % 10 === 0) {
          const origRect = rect;
          rect = findSafe(rect);
          if (rect === origRect) {
            size = nextSmallerFromArray(SIZES, size);
          } else {
            // Use 'new' rect coordinates
            x = rect.l;
            y = rect.t;

            safe = true;
          }
        }
      }

      if (!safe && tryLimit === 0) {
        const origRect = rect;
        rect = findSafe(rect);
        if (rect === origRect) {
          overlaps++;
        }

        // Use 'new' rect coordinates
        x = rect.l;
        y = rect.t;

        // We give up, but may have a new location
        safe = true;
      }
    } while (!safe);

    // console.log(`${num}: ${JSON.stringify(rect)}`);

    const div = document.createElement("div");
    div.textContent = num;
    div.classList.add("number");

    // Custom styles
    div.style.setProperty("left", `${x}px`);
    div.style.setProperty("top", `${y}px`);
    div.style.setProperty("height", `${size}px`);
    div.style.setProperty("width", `${size}px`);

    div.style.setProperty("font-size", `${size / 22.0}rem`);
    div.style.setProperty("color", `${col}`);

    const borderWidth = 5; //Math.max(5, Math.floor(size / 25));
    div.style.setProperty(
      "border",
      `${borderWidth}px solid ${randomFromArray(COLOURS.slice(2))}`
    );
    div.style.setProperty("border-radius", "25%");

    div.addEventListener('click', (ev) => {
      div.classList.add("wobble");

      setTimeout(() => {
        div.classList.remove("wobble");
        div.classList.add("fade");
      }, 500);
    });

    extents.push(rect);

    return div;
  }

  mainEl.innerHTML = "";

  if (letters) {
    for (let l = 1; l <= 26; l++) {
      mainEl.appendChild(getNumElem(String.fromCharCode(l + 64)));
    }
  } else {
    for (let num = START_NUM; num <= CALC_END_NUM; num++) {
      mainEl.appendChild(getNumElem(num));
    }
  }

  if (overlaps) {
    overlaps = `(${overlaps} overlap${overlaps > 1 ? "s" : ""}!)`;
  } else {
    overlaps = "";
  }

  if (letters) {
    toEl.textContent = `A to Z ${overlaps}`;
  } else {
    toEl.textContent = `${START_NUM} to ${CALC_END_NUM} ${overlaps}`;
  }
}

function init() {
  initControls();

  initDisplay();
}

// ----------------------------------------------------------------------------

init();
