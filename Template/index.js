import { clock, getViewportInfo, trackCheckbox } from "./utils.js";

const mainEl = document.querySelector("#main");
const subHeadingEl = document.querySelector("#subheading");
const resetEl = document.querySelector("#reset");
const check1El = document.querySelector("#check1");
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

  mainEl.innerHTML = "";
  subHeadingEl.textContent = `Hello, I'm ready... #${count}`;

  const div = document.createElement("div");
  div.className = "box";
  div.textContent = `#${count}\n${JSON.stringify(getViewportInfo(), 0, 2)}`;

  if (check1) {
    div.classList.add("red");
  }
  mainEl.appendChild(div);

  clock(clockEl);
}

function init() {
  check1 = true;

  initControls();
  initDisplay();
}

init();
