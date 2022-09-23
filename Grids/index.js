const numsSets = document.querySelectorAll(".numsSet");

numsSets.forEach((numsSet) => {
  if (Math.random() > 0.5) {

    h3 = numsSet.previousSibling.previousSibling;

    if (h3.textContent !== "Fixed") {
        const nums = numsSet.querySelectorAll(".num");
        nums.forEach((num) => {
        num.classList.add("alt");
      });
    }
  }
});
