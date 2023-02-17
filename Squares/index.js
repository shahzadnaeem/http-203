import { clock, waitMs } from "./utils.js";

const numBoxesEl = document.querySelector("#numBoxes");
const boxesContainerEl = document.querySelector(".boxes-container");
const resetEl = document.querySelector("#reset");
const howManyEl = document.querySelector("#howMany");
const speedEl = document.querySelector("#speed");
const showSpeedEl = document.querySelector("#showSpeed");
const frameEl = document.querySelector("#animation-frame");
const clockEl = document.querySelector("#clock");

let boxesEls;
let howMany = 100;

let updateRate = 50;
let updateWaitMs = 1000.0 / updateRate;

let animationState = {
  currFactor: 0,
  animationId: 0,
  start: 0,
  timestamp: 0,
  frame: 0,
};

function resetListener() {
  restartAnimation();
}

function howManyListener(ev) {
  howMany = parseInt(ev.target.value);

  initDisplay();
}

function rateListener(ev) {
  updateRate = parseInt(ev.target.value);
  updateWaitMs = 1000.0 / updateRate;

  initDisplay();
}

function initControls() {
  resetEl.removeEventListener("click", resetListener);
  resetEl.addEventListener("click", resetListener);

  howManyEl.removeEventListener("input", howManyListener);
  howManyEl.addEventListener("input", howManyListener);

  speed.removeEventListener("input", rateListener);
  speed.addEventListener("input", rateListener);
}

function addBox(special) {
  const div = document.createElement("div");

  boxesContainerEl.appendChild(div);

  div.classList.add("box", "invert-filter");
  if (special) {
    div.classList.add("special-box");
  }

  return div;
}

function addBoxes(numBoxes, enabled = false) {
  let bxs = Array(numBoxes).fill(0);

  return bxs.map((_, i) => {
    return addBox(enabled);
  });
}

function startAnimation(animator = animate) {
  animationState.animationId = requestAnimationFrame(animator);
}

function initAnimationState() {
  animationState = {
    currFactor: 0,
    animationId: 0,
    start: 0,
    timestamp: 0,
    last: 0,
    frame: 0,
  };

  boxesEls.forEach((boxEl, i) => {
    boxEl.classList.remove("box-lit", "finished");
  });
}

function stopAnimation() {
  if (animationState.animationId != 0) {
    window.cancelAnimationFrame(animationState.animationId);
  }
}

function restartAnimation() {
  stopAnimation();
  initAnimationState();
  startAnimation();
}

function animate(timestamp) {
  if (animationState.currFactor >= howMany) {
    // All done
    return;
  }

  if (animationState.timestamp === 0) {
    animationState.last = timestamp;
    animationState.start = timestamp;
  }

  animationState.timestamp = timestamp;

  let elapsed = animationState.timestamp - animationState.last;

  if (elapsed === 0 || elapsed > updateWaitMs) {
    animationState.frame++;
    animationState.last = animationState.timestamp;
    animationState.currFactor++;

    // Sort out all of the boxes based on the current factor
    boxesEls.forEach((boxEl, i) => {
      if ((i + 1) % animationState.currFactor === 0) {
        boxEl.classList.toggle("box-lit");

        if (i + 1 === animationState.currFactor) {
          boxEl.classList.add("finished");
        }
      }
    });

    frameEl.textContent = `${animationState.frame}`;
  }

  animationState.animationId = window.requestAnimationFrame(animate);
}

function updateDisplay() {
  howManyEl.value = howMany;
  numBoxesEl.textContent = `${howMany}`;
  speedEl.value = updateRate;
  showSpeedEl.textContent = `${updateRate}`;

  // If we are animating, reset it here
  restartAnimation();
}

function initDisplay() {
  boxesContainerEl.innerHTML = "";

  boxesEls = addBoxes(howMany, false);

  updateDisplay();

  clock(clockEl);
}

async function init() {
  howMany = 100;

  initControls();
  initDisplay();
}

init();
