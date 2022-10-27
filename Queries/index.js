import { clock, getViewportInfo, trackCheckbox, waitMs } from "./utils.js";

const mainEl = document.querySelector("#main");
const appEl = document.querySelector("#app");
const appTlEl = document.querySelector("#app-tl");
const subHeadingEl = document.querySelector("#subheading");
const resetEl = document.querySelector("#reset");
const check1El = document.querySelector("#check1");
const appStatusEl = document.querySelector("#app-status");
const clockEl = document.querySelector("#clock");

let count = 0;
let check1 = true;

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

function check1Listener(ev) {
  check1 = ev.target.checked;
  initDisplay();
}

function initControls() {
  resetEl.removeEventListener("click", resetListener);
  resetEl.addEventListener("click", resetListener);

  removeEventListener("resize", resizeListener);
  addEventListener("resize", resizeListener);

  trackCheckbox(check1El, check1, check1Listener);
}

function initDisplay() {
  count++;

  subHeadingEl.textContent = `Hello, I'm ready... #${count}`;

  appTlEl.innerHTML = "";

  const div = document.createElement("div");
  div.classList.add("box");

  const viewportInfo = getViewportInfo();

  div.innerHTML = `#${count} <span>Top Left</span>\n\n${new Date(
    Date.now()
  ).toLocaleString()}\n\n${viewportInfo.documentElement.clientWidth} x ${
    viewportInfo.documentElement.clientHeight
  }`;

  div.addEventListener("click", (ev) => {
    div.classList.add("wobble");

    setTimeout(() => {
      div.classList.remove("wobble");
    }, 500);
  });

  if (check1) {
    div.classList.add("invert-filter");
  }

  appTlEl.appendChild(div);

  clock(clockEl);
}

async function init() {
  check1 = true;

  await waitMs(1000, appStatusEl, "app-status__working");

  initControls();
  initDisplay();
}

init();
