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

function check1Listener(ev) {
  check1 = ev.target.checked;
  initDisplay();
}

function initControls() {
  resetEl.removeEventListener("click", resetListener);
  resetEl.addEventListener("click", resetListener);

  trackCheckbox(check1El, check1, check1Listener);
}

function initDisplay() {
  count++;

  appTlEl.innerHTML = "";

  subHeadingEl.textContent = `Hello, I'm ready... #${count}`;

  const div = document.createElement("div");
  div.classList.add("box");
  div.textContent = `#${count}\n${JSON.stringify(getViewportInfo(), 0, 2)}`;

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
