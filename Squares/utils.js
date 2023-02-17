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
