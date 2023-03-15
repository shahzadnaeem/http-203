const resetEl = document.querySelector("#reset");
const debugCssEl = document.querySelector("#debugCss");
const debugSpecificCssEl = document.querySelector("#debugSpecificCss");
const mainEl = document.querySelector("#main");
const specificEl = document.querySelector("#deepest");

console.log(`specificEl = ${specificEl}`);

let debugClass = "__CSSDEBUG__";

let debugCss = false;
let debugSpecificCss = false;

function resetListener() {
  debugCss = false;
  debugSpecificCss = false;

  init();
}

function debugCssListener(ev) {
  console.log("Debug Main listener");

  debugCss = ev.target.checked;

  updatePage();
}

function debugSpecificCssListener(ev) {
  console.log("Debug Deepest listener");

  debugSpecificCss = ev.target.checked;

  updatePage();
}

function updatePage() {
  if (debugCss) {
    mainEl.classList.add(debugClass);
  } else {
    mainEl.classList.remove(debugClass);
  }

  if (debugSpecificCss) {
    specificEl.classList.add(debugClass);
  } else {
    specificEl.classList.remove(debugClass);
  }
}

function initControls() {
  resetEl.removeEventListener("click", resetListener);
  resetEl.addEventListener("click", resetListener);

  debugCssEl.checked = debugCss;
  debugCssEl.removeEventListener("change", debugCssListener);
  debugCssEl.addEventListener("change", debugCssListener);

  debugSpecificCssEl.checked = debugSpecificCss;
  debugSpecificCssEl.removeEventListener("change", debugSpecificCssListener);
  debugSpecificCssEl.addEventListener("change", debugSpecificCssListener);
}

function init() {
  initControls();

  updatePage();
}

init();
