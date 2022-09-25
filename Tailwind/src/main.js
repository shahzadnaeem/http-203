// Let's do it all here!

class Builder {
  constructor(mainEl, debug = false) {
    this.debug = debug;
    this.mainEl = mainEl;
    this.elCounts = {};
    this.elements = 0;
    this.elClones = {};
    // Use this to get count of elements that have been cloned
    // TODO: Assuming that elements that are cloned, are not added too!
    this.cloneSources = new Map();
    this.clones = 0;
  }

  stats() {
    return JSON.stringify(
      {
        totalElems: this.elements - this.cloneSources.size + this.clones,
        numElems: this.elements - this.cloneSources.size,
        numClones: this.clones,
        counts: this.elCounts,
        clones: this.elClones,
      },
      null,
      2
    );
  }

  incElementCount(name) {
    if (!this.elCounts[name]) {
      this.elCounts[name] = 0;
    }

    this.elCounts[name]++;
    this.elements++;
  }

  getElementCount(name) {
    if (this.elCounts[name]) {
      return this.elCounts[name];
    }

    return 0;
  }

  incCloneCount(name, node) {
    if (!this.elClones[name]) {
      this.elClones[name] = 0;
    }

    // Keep track of what we have cloned
    this.cloneSources.set(node, true);

    this.elClones[name]++;
    this.clones++;
  }

  getCloneCount(name) {
    if (this.elClones[name]) {
      return this.elClones[name];
    }

    return 0;
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
    this.incElementCount(name);

    if (name) {
      const element = document.createElement(name);
      element.classList = classList;

      if (Array.isArray(children)) {
        children.forEach((el) => {
          if (typeof el === "function") {
            element.appendChild(el());
          } else {
            // Clone elements and track them - stats track clones
            this.incCloneCount(el.nodeName, el);
            const cloned = el.cloneNode(true);
            if (cloned.textContent) {
              if (this.debug) {
                cloned.textContent += `🐑${this.getCloneCount(el.nodeName)}`;
              }
            }
            element.appendChild(cloned);
          }
        });
      } else {
        if (typeof children === "string") {
          element.textContent = children;
        } else if (typeof children === "function") {
          element.textContent = children(this.getElementCount(name));
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

const init = (debug = false) => {
  const mainEl = document.querySelector("#main");

  const builder = new Builder(mainEl, debug);

  builder.doNOf(3, () =>
    builder.add(() =>
      builder.newParagraph(
        (n) => `Just hello! - ${n}`,
        "w-full my-2 px-2 bg-blue-700 border-2 border-yellow-900"
      )
    )
  );

  builder.doNOf(2, () => {
    const section = builder.newSection();

    builder.add(
      () => builder.newParagraph((n) => `1/Just hello! in section - #${n}`),
      section
    );

    builder.doNOf(1, () =>
      builder.add(
        () => builder.newParagraph((n) => `2/Just hello! in section - #${n}`),
        section
      )
    );

    // Cloning check - see clone count of 2nd iteration
    for (let o = 0; o < 2; o++) {
      const paras = [];

      for (let i = 0; i < 3; i++) {
        const singlePara = builder.newParagraph(
          (n) => `Single manual paragraph - #${n}`
        );
        paras.push(singlePara, singlePara);
      }

      const sectionWithParas = builder.newSection(paras);
      builder.add(sectionWithParas, section);
    }

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

  console.log(`builder_stats: ${builder.stats()}`);
};

init(true);
