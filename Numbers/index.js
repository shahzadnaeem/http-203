const headerEl = document.querySelector("#header");
const mainEl = document.querySelector("#main");
const toEl = document.querySelector("#to");
const resetEl = document.querySelector("#reset");
const lettersEl = document.querySelector("#letters");
const checkOrderEl = document.querySelector("#checkOrder");
const numLimitEl = document.querySelector("#num-limit");

const START_NUM = 1;
const END_NUM = 20;

let letters = false;
let numLimit = 20;
let checkOrder = true;

let firstItem, lastItem, currentItem;

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

  init();
}

function checkOrderListener(ev) {
  checkOrder = ev.target.checked;
}

function numLimitListener(ev) {
  const newLimit = ev.target.value;

  if (newLimit === "No limit") {
    numLimit = 0;
  } else {
    numLimit = Number(newLimit);
  }

  init();
}

function mainListener(ev) {
  if (allDone()) {
    init();
  }
}

// ----------------------------------------------------------------------------

function initItemTracker() {
  if (letters) {
    firstItem = "A";
    lastItem = "Z";
    currentItem = "A";
  } else {
    firstItem = 1;
    lastItem = numLimit;
    currentItem = 1;
  }
}

function allDone() {
  return currentItem > lastItem;
}

function nextItem() {
  if (!allDone()) {
    if (letters) {
      currentItem = String.fromCharCode(currentItem.charCodeAt(0) + 1);
    } else {
      currentItem++;
    }
  }
}

function initControls() {
  resetEl.removeEventListener("click", resetListener);
  resetEl.addEventListener("click", resetListener);

  lettersEl.checked = letters;
  lettersEl.removeEventListener("change", lettersListener);
  lettersEl.addEventListener("change", lettersListener);

  checkOrderEl.checked = checkOrder;
  checkOrderEl.removeEventListener("change", checkOrderListener);
  checkOrderEl.addEventListener("change", checkOrderListener);

  numLimitEl.value = numLimit === 0 ? "No limit" : numLimit;
  numLimitEl.removeEventListener("input", numLimitListener);
  numLimitEl.addEventListener("input", numLimitListener);

  removeEventListener("resize", resizeListener);
  addEventListener("resize", resizeListener);

  mainEl.removeEventListener("click", mainListener);
  mainEl.addEventListener("click", mainListener);

  initItemTracker();

  console.log(`currentItem = ${currentItem}`);
}

function initDisplay() {
  const clientRects = mainEl.getClientRects();
  const boundingRect = mainEl.getBoundingClientRect();

  console.log(`mainEl.clientRects = ${JSON.stringify(clientRects)}`);
  console.log(`mainEl.boundingRects = ${JSON.stringify(boundingRect)}`);

  let maxX = mainEl.clientWidth;
  let maxY = mainEl.clientHeight;

  console.log(`mainEl = ${maxX} x ${maxY}`);

  if (maxY === 0) {
    // Make an adjustment - 4 is the mainEl top + bottom border width
    maxY = document.documentElement.clientHeight - headerEl.clientHeight - 4;

    console.log(
      `document.documentEl = ${document.documentElement.clientWidth} x ${document.documentElement.clientHeight}`
    );
    console.log(
      `headerEl = ${headerEl.clientWidth} x ${headerEl.clientHeight}`
    );
    console.log(`😠 mainEl = ${maxX} x ${maxY}`);
  }

  let CALC_END_NUM = Math.floor((maxX * maxY) / (200 * 200));
  CALC_END_NUM -= CALC_END_NUM % 5;

  if (CALC_END_NUM === 0) {
    console.log(`CALC_END_NUM was 0!`);
    CALC_END_NUM = 20;
  }

  if (CALC_END_NUM > 100) {
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
      tryLimit--;

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

    function animateEl(el, cls, delayMs = 500) {
      el.classList.add(cls);

      setTimeout(() => {
        el.classList.remove(cls);
      }, delayMs);
    }

    function animateEl2(el, cls, postRemoveCls, delayMs = 500) {
      el.classList.add(cls);

      setTimeout(() => {
        el.classList.remove(cls);
        el.classList.add(postRemoveCls);
      }, delayMs);
    }

    div.addEventListener("click", (ev) => {
      ev.stopPropagation();

      if (checkOrder) {
        if (!allDone()) {
          if (ev.target.textContent == currentItem) {
            nextItem();

            animateEl2(ev.target, "wobble", "fade");
          } else {
            animateEl(ev.target, "incorrect");
          }
        }

        if (allDone()) {
          mainEl.classList.add("done");
        }
      } else {
        animateEl2(ev.target, "wobble", "fade");
      }
    });

    extents.push(rect);

    return div;
  }

  mainEl.innerHTML = "";
  mainEl.classList.remove("done");

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
