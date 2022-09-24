// Let's do it all here!

class Builder {
  constructor(mainEl) {
    this.mainEl = mainEl;
  }

  add(el) {
    if (typeof el === "function" ) {
      this.mainEl.appendChild(el());
    } else {
      this.mainEl.appendChild(el);
    }
    
    return this;
  }

  newSection(children = []) {
    const section = document.createElement("section");
    section.classList =
      "my-2 grid grid-cols-2 justify-items-center gap-2 bg-slate-100 text-white";

    children.forEach((el) => {
      if (typeof el === "function") {
        section.appendChild(el());
      } else {
        section.appendChild(el.cloneNode(true));
      }
    });

    return section;
  }

  newParagraph(children = []) {
    const para = document.createElement("p");
    para.classList =
      "w-full bg-pink-700 border border-emerald-900 border-spacing-2";

    if (Array.isArray(children)) {
      children.forEach((el) => {
        if (typeof el === "function") {
          para.appendChild(el());
        } else {
          para.appendChild(el.cloneNode(true));
        }
      });
    } else {
      para.textContent = children;
    }

    return para;
  }

  nOf(n, itFn) {
    return Array(n).fill(itFn);
  }

  doNOf(n, itFn) {
    Array(n)
      .fill(itFn)
      .forEach((f) => f());
  }
}

const init = () => {
  const mainEl = document.querySelector("#main");

  const builder = new Builder(mainEl);

  builder.doNOf(3, () => builder.add( () =>
  builder.newParagraph("Just hello!")
  ));

  builder.doNOf(3, () => builder.add( () =>
    builder.newSection(
      builder
        .nOf(5, () => builder.newParagraph("Hey"))
        .concat(
          builder.nOf(5, () =>
            builder.newParagraph(builder.nOf(3, () => builder.newSection(
              builder.nOf(2, builder.newParagraph("In a section, in a para!"))
            )))
          )
        )
    ))
  );
};

init();
