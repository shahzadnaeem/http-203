import { clock, waitMs } from "./utils.js";

const numBoxesEl = document.querySelector("#numBoxes");
const boxesContainerEl = document.querySelector(".boxes-container");
const resetEl = document.querySelector("#reset");
const howManyEl = document.querySelector("#howMany");
const frameEl = document.querySelector("#animation-frame");
const appStatusEl = document.querySelector("#app-status");
const clockEl = document.querySelector("#clock");

let boxesEls;
let howMany = 100;

let frameRate = 50;
let frameRateMs = 1000 / frameRate;

let animationState = {
  currFactor: 0,
  animationId: 0,
  timestamp: 0,
  frame: 0,
};

function resetListener() {
  restartAnimation();
}

function howManyListener(ev) {
  howMany = parseInt(ev.target.value);

  console.log(`howManyListener: ${howMany}`);

  initDisplay();
}

function initControls() {
  resetEl.removeEventListener("click", resetListener);
  resetEl.addEventListener("click", resetListener);

  howManyEl.removeEventListener("input", howManyListener);
  howManyEl.addEventListener("input", howManyListener);
}

function addBox() {
  const div = document.createElement("div");

  boxesContainerEl.appendChild(div);

  div.classList.add("box", "invert-filter");

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
    timestamp: 0,
    last: 0,
    frame: 0,
  };

  boxesEls.forEach((boxEl, i) => {
    boxEl.classList.remove("box-lit");
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
  }

  animationState.timestamp = timestamp;

  let elapsed = animationState.timestamp - animationState.last;

  if (elapsed === 0 || elapsed > frameRateMs) {
    animationState.frame++;
    animationState.last = animationState.timestamp;
    animationState.currFactor++;

    // Sort out all of the boxes based on the current factor
    boxesEls.forEach((boxEl, i) => {
      if ((i + 1) % animationState.currFactor === 0) {
        boxEl.classList.toggle("box-lit");
      }
    });

    frameEl.textContent = `${animationState.frame} @${frameRate}/s`;
  }

  animationState.animationId = window.requestAnimationFrame(animate);
}

function updateDisplay() {
  howManyEl.value = howMany;
  numBoxesEl.textContent = `${howMany}`;

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

  waitMs(500, appStatusEl);
}

init();
