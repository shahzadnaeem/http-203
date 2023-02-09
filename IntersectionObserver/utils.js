let clockTimer;

export function clock(el) {
  if (clockTimer) {
    clearInterval(clockTimer);
  }

  clockTimer = setInterval(() => {
    let now = new Date(Date.now());

    el.textContent = now.toLocaleString();
  }, 1000);
}

export function getViewportInfo() {
  return {
    documentElement: {
      clientWidth: document.documentElement.clientWidth,
      clientHeight: document.documentElement.clientHeight,
    },
  };
}

export function trackCheckbox(el, initVal, listener) {
  el.checked = initVal;
  el.removeEventListener("change", listener);
  el.addEventListener("change", listener);
}

export async function waitMs(
  ms = 1000,
  el,
  workingClass = "app-status__working"
) {
  el && el.classList.add(workingClass);

  return new Promise((resolve, _) => {
    setTimeout(() => {
      el && el.classList.remove(workingClass);
      resolve("done");
    }, ms);
  });
}
