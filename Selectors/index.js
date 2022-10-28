const headerEl = document.querySelector("#header");
const controlsEl = document.querySelector("#controls");
const mainEl = document.querySelector("#main");
const resetEl = document.querySelector("#reset");
const showCssEl = document.querySelector("#showCss");

let showCss = false;
let currentSize = {};

function resetListener() {
  init();
}

function onResize() {}

const resizeListener = (function makeResizeListener() {
  const resizeDelay = 500;
  let timeout = false;

  return function resizeListener() {
    clearTimeout(timeout);
    timeout = setTimeout(onResize, resizeDelay);
  };
})();

function showCssListener(ev) {
  showCss = ev.target.checked;

  const elTypes = ["main", "article", "div", "p"];

  elTypes.forEach((elType) => {
    document
      .querySelectorAll(elType)
      .forEach((el) => el.classList.toggle("showCss"));
  });

  // Don't show CSS here
  controlsEl.classList.remove("showCss");

  init();
}

// ----------------------------------------------------------------------------

function initControls() {
  resetEl.removeEventListener("click", resetListener);
  resetEl.addEventListener("click", resetListener);

  showCssEl.checked = showCss;
  showCssEl.removeEventListener("change", showCssListener);
  showCssEl.addEventListener("change", showCssListener);

  removeEventListener("resize", resizeListener);
  addEventListener("resize", resizeListener);
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
}

function init() {
  initControls();

  initDisplay();
}

// ----------------------------------------------------------------------------

init();
