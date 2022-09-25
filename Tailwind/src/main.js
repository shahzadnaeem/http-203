// Let's do it all here!

class Builder {
  constructor(mainEl) {
    this.mainEl = mainEl;
    this.elNumber = 0;
  }

  add(el, to = this.mainEl) {
    if (typeof el === "function") {
      to.appendChild(el());
    } else {
      if (el instanceof Node) {
        to.appendChild(el);
      } else {
        throw new Error("Element is not a 'Node'!");
      }
    }

    return this;
  }

  newElement(name, classList = "", children = []) {
    this.elNumber++;

    if (name) {
      const element = document.createElement(name);
      element.classList = classList;

      if (Array.isArray(children)) {
        children.forEach((el) => {
          if (typeof el === "function") {
            element.appendChild(el());
          } else {
            // TODO: This should probably go or be better managed
            element.appendChild(el.cloneNode(true));
          }
        });
      } else {
        if (typeof children === "string") {
          element.textContent = children;
        } else if (typeof children === "function") {
          element.textContent = children(this.elNumber);
        } else {
          throw new Error("Invalid element 'content' (via children)");
        }
      }

      return element;
    } else {
      throw new Error("No element 'name' provided");
    }
  }

  defSectionCls = () =>
    "my-2 grid grid-cols-2 justify-items-center gap-2 bg-slate-100 text-white";

  newSection(children = [], cls = this.defSectionCls()) {
    if (!cls) cls = this.defSectionCls();
    return this.newElement("section", cls, children);
  }

  defParaCls = () => "w-full px-2 bg-pink-700 border-2 border-blue-900";

  newParagraph(children = [], cls = this.defParaCls()) {
    if (!cls) cls = this.defParaCls();
    return this.newElement("p", cls, children);
  }

  // A very basic start, init() still messy as a result

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

  builder.doNOf(3, () =>
    builder.add(() => builder.newParagraph((n) => `Just hello! - ${n}`))
  );

  builder.doNOf(1, () => {
    const section = builder.newSection();

    builder.add(
      () => builder.newParagraph((n) => `1/Just hello! in section - #${n}`),
      section
    );

    builder.doNOf(4, () =>
      builder.add(
        () => builder.newParagraph((n) => `2/Just hello! in section - #${n}`),
        section
      )
    );

    builder.add(section);
  });


  builder.doNOf(7, () =>
    builder.add(() =>
      builder.newSection(
        builder
          .nOf(5, () => builder.newParagraph((n) => `Hey - #${n}`))
          .concat(
            builder.nOf(3, () =>
              builder.newSection(
                builder
                  .nOf(3, () =>
                    builder.newParagraph(
                      (n) => `Para in 2nd section - #${n}`,
                      "w-full px-2 bg-blue-700 border-2 border-pink-900"
                    )
                  )
                  .concat(
                    builder.nOf(4, () =>
                      builder.newParagraph(
                        (n) => `Alt Para in 2nd section - #${n}`,
                        "w-full px-2 font-bold bg-green-700 border-2 border-indigo-900"
                      )
                    )
                  ),
                "my-2 grid grid-cols-2 justify-items-center gap-2 bg-emerald-100 text-white"
              )
            )
          ),
        "my-2 grid grid-cols-2 justify-items-center gap-2 bg-yellow-100 text-white"
      )
    )
  );
};

init();
