// Let's do it all here!

const uid = [0];

class Builder {
  static DEBUG = { ON: true, OFF: false };

  constructor(mainEl, debug = DEBUG.OFF) {
    this.debug = debug;
    this.mainEl = mainEl;
    this.elCounts = {};
    this.elements = 0;
    this.elClones = {};
    // Use this to get count of elements that have been cloned
    // TODO: Assuming that elements that are cloned, are not added too!
    this.cloneSources = new Map();
    this.clones = 0;
    this.badNestedClones = {};
  }

  stats() {
    return JSON.stringify(
      {
        lastUID: uid[0],
        totalElems: this.elements - this.cloneSources.size + this.clones,
        numElems: this.elements - this.cloneSources.size,
        numClones: this.clones,
        counts: this.elCounts,
        clones: this.elClones,
        badNestedClones: this.badNestedClones,
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

  incBadNestedCloneCount(name, numChildrenMissed) {
    if (!this.badNestedClones[name]) {
      this.badNestedClones[name] = { count: 0, childrenMissed: 0 };
    }

    this.badNestedClones[name].count++;
    this.badNestedClones[name].childrenMissed += numChildrenMissed;
  }

  add(el, to = this.mainEl) {
    if (typeof el === "function") {
      to.appendChild(el());
    } else {
      if (el instanceof Node) {
        to.appendChild(el);
      } else if (Array.isArray(el) && el.every((el) => el instanceof Node)) {
        to.append(...el);
      } else {
        throw new Error("Element is not a 'Node'!");
      }
    }

    return to;
  }

  setUID(el) {
    uid[0]++;

    el.newElUID = `E.${uid[0]}/${el.nodeName}`;
  }

  clone(el) {
    const cloned = el.cloneNode(true);
    // TODO: How to really clone nested elements!
    if (el.children.length) {
      this.incBadNestedCloneCount(el.nodeName, el.children.length);

      // TODO: This does not quite work :(

      // while (cloned.firstChild) {
      //   cloned.removeChild(cloned.firstChild);
      // }

      // for (const child of el.children) {
      //   console.log(`Really deep cloning: ${child.newElUID}...`);
      //   cloned.appendChild(this.clone(child));
      // }
    }
    this.setUID(cloned);

    return cloned;
  }

  newElement(name, classList = "", children = []) {
    if (name) {
      this.incElementCount(name);

      const element = document.createElement(name);

      this.setUID(element);
      element.classList = classList;

      if (Array.isArray(children)) {
        children.forEach((el, i) => {
          if (typeof el === "function") {
            element.appendChild(el());
          } else {
            let inception = el.children.length;

            // Clone elements and track them - stats track clones
            this.incCloneCount(el.nodeName, el);
            const cloned = this.clone(el);

            // if (inception) {
            //   // Doh! Need to go deeper!
            //   console.log(
            //     `INCEPTION ALERT!: created ${name}/${cloned.newElUID} from ${name}/${element.newElUID} that has children!`
            //   );
            // }

            if (cloned.textContent) {
              if (this.debug) {
                cloned.textContent += `🐑${this.getCloneCount(el.nodeName)}`;

                if (inception) {
                  let nodes = [];
                  for (const child of el.children) {
                    nodes.push(child.nodeName);
                  }

                  cloned.textContent =
                    `🚩 ${cloned.newElUID} has ${
                      el.children.length
                    } child nodes [${nodes.join(
                      ", "
                    )}] FLATTENED as 'text' 🚩 ` + cloned.textContent;
                }
              }
            }

            element.appendChild(cloned);
          }
        });
      } else {
        if (typeof children === "string") {
          element.textContent = children;
        } else if (typeof children === "function") {
          element.textContent = children(
            `${element.newElUID}-${this.getElementCount(name)}`
          );
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

  makeNOf(n, itFn) {
    return Array(n)
      .fill(itFn)
      .map((f) => f());
  }
}

const init = (debug = Builder.DEBUG.OFF) => {
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

    // Recreate above with the following code

    const paras2 = builder.makeNOf(2, (n) =>
      builder.newParagraph(
        (n) => `Single makeNOf paragraph - #${n}`,
        `w-full px-2 bg-teal-700 border-2 border-black`
      )
    );

    builder.doNOf(2, () => {
      const sectionWithParas = builder.newSection(paras2);
      builder.add(sectionWithParas, section);
    });

    // This nesting of paragraphs in paragraphs fails!

    const paras3 = builder.makeNOf(5, (n) =>
      builder.newParagraph(
        paras2,
        `w-full px-2 bg-red-100 border-2 border-black text-black`
      )
    );

    // NOTE: This step does work!

    builder.add(paras3, section);

    // TODO: This fails - related to cloning as creating <p> tags nested to 3 levels works
    builder.add(builder.newSection(paras3), section);

    // TODO: As does this - remove for now!

    // builder.doNOf(2, () => {
    //   const sectionWithParas = builder.newSection(paras3);
    //   builder.add(sectionWithParas, section);
    // });

    // This alternative nesting of paragraphs in paragraphs works - builder.add() updated

    builder.doNOf(2, () => {
      builder.add(
        builder.add(
          builder.add(
            builder.makeNOf(5, () =>
              builder.newParagraph(
                (n) => `${n} of 5 paras`,
                `w-full px-2 bg-yellow-200 border-2 border-black text-black`
              )
            ),
            builder.newParagraph(
              (n) => `Mid Containing paragraph ${n}`,
              `w-full px-2 bg-gray-200 border-2 border-white text-black`
            )
          ),
          builder.newParagraph((n) => `Top Containing paragraph ${n}`)
        ),
        section
      );
    });

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

  if (debug) {
    console.log(`builder_stats: ${builder.stats()}`);
  }
};

init(Builder.DEBUG.ON);
