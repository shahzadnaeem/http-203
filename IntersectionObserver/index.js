import { clock, getViewportInfo, trackCheckbox, waitMs } from "./utils.js";

const mainEl = document.querySelector("#main");
const subHeadingEl = document.querySelector("#subheading");
const resetEl = document.querySelector("#reset");
const check1El = document.querySelector("#check1");
const appStatusEl = document.querySelector("#app-status");
const clockEl = document.querySelector("#clock");
let box1El = false;
let otherBoxesEls = false;

let count = 0;
let check1 = true;

function resetListener() {
  init();
}

function check1Listener(ev) {
  check1 = ev.target.checked;

  if (check1) {
    box1El.classList.add("invert-filter");
  } else {
    box1El.classList.remove("invert-filter");
  }
}

function initControls() {
  resetEl.removeEventListener("click", resetListener);
  resetEl.addEventListener("click", resetListener);

  trackCheckbox(check1El, check1, check1Listener);
}

let boxNum = 0;

function addBox(enabled = false) {
  boxNum++;

  const div = document.createElement("div");
  div.className = "box";

  // Closure vars
  let dblClickTimer = false;
  let num = boxNum;

  div.addEventListener("click", (ev) => {
    console.log(`Box ${num}: Click. ${dblClickTimer ? "2nd" : "1st"}`);

    if (dblClickTimer) {
      console.log("2nd click work...");

      clearTimeout(dblClickTimer);
      dblClickTimer = false;

      div.classList.add("dull-blip");

      setTimeout(() => {
        div.classList.remove("dull-blip");
      }, 500);
    } else {
      dblClickTimer = setTimeout(() => {
        console.log("1st click work...");

        dblClickTimer = false;

        div.classList.add("wobble");

        setTimeout(() => {
          div.classList.remove("wobble");
        }, 500);
      }, 250);
    }
  });

  if (!enabled) {
    div.classList.add("dull-filter");
  }

  if (check1 && boxNum == 1) {
    div.classList.add("invert-filter");
  }

  let boxSpan = ((boxNum - 1) % 3) + 1;
  if (boxSpan > 1) {
    div.classList.add(`box-span-${boxSpan}`);
  }

  mainEl.appendChild(div);

  if (boxNum == 1) {
    div.textContent = `Box #${boxNum}\n${JSON.stringify(
      getViewportInfo(),
      0,
      2
    )}`;
  } else {
    div.textContent = `Box #${boxNum}\n${JSON.stringify(
      div.getBoundingClientRect(),
      0,
      2
    )}`;
  }

  const topBox = document.createElement("div");
  topBox.className = "ratio-box-top";
  div.appendChild(topBox);

  const bottomBox = document.createElement("div");
  bottomBox.className = "ratio-box-bottom";
  div.appendChild(bottomBox);

  return div;
}

function addBoxes(numBoxes, enabled = false) {
  let bxs = Array(numBoxes).fill(0);

  return bxs.map((_, i) => {
    return addBox(enabled);
  });
}

function getObserver() {
  const options = {
    threshold: [0.0, 0.1, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
  };

  function updateVisibiltyIndicators(el) {
    const visibility = `${(el.intersectionRatio * 100).toFixed()}% visible`;

    const topBox = el.target.querySelector(".ratio-box-top");
    topBox.textContent = visibility;
    const bottomBox = el.target.querySelector(".ratio-box-bottom");
    bottomBox.textContent = visibility;
  }

  return new IntersectionObserver((els) => {
    els.forEach((el) => {
      updateVisibiltyIndicators(el);

      if (el.isIntersecting) {
        if (el.intersectionRatio >= 0.4) {
          el.target.classList.remove("dulling-filter", "dull-filter");
          el.target.classList.add("no-filter");
        } else if (el.intersectionRatio <= 0.25) {
          el.target.classList.add("dulling-filter");
          el.target.classList.remove("no-filter", "dull-filter");
        }
      } else {
        el.target.classList.add("dull-filter");
        el.target.classList.remove("no-filter");
      }
    });
  }, options);
}

function initIntersectionObservation(elems) {
  const observer = getObserver();

  elems.forEach((boxEl) => {
    observer.observe(boxEl);
  });
}

function initDisplay() {
  count++;

  mainEl.innerHTML = "";

  box1El = addBox(true);
  otherBoxesEls = addBoxes(20, false);

  initIntersectionObservation([box1El, ...otherBoxesEls]);

  clock(clockEl);
}

async function init() {
  check1 = true;

  await waitMs(500, appStatusEl, "app-status__working");

  initControls();
  initDisplay();
}

init();
