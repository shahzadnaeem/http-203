const mainEl = document.querySelector("#main");

const FIRSTRANDCHAR=33
const LASTRANDCHAR=96

function randomChar() {
  return String.fromCharCode(Math.floor(Math.random()*(LASTRANDCHAR-FIRSTRANDCHAR)+FIRSTRANDCHAR));
}

let chars = [];
let charElems = [];

function init() {

  console.log(`mainEl = ${mainEl.clientWidth} x ${mainEl.clientHeight}`);

  const ITEMSZ = 32;
  const CALC_XSZ = Math.floor(mainEl.clientWidth / ITEMSZ); 
  const XSZ = 40;
  const CALC_YSZ = Math.floor(mainEl.clientHeight / ITEMSZ);
  const YSZ = 37;
  const NUMITEMS = XSZ * YSZ;

  console.log(`CALC_XSZ = ${CALC_XSZ}, CALC_YSZ = ${CALC_YSZ}, NUMITEMS' = ${CALC_XSZ * CALC_YSZ}`);
  console.log(`XSZ = ${XSZ}, YSZ = ${YSZ}, NUMITEMS = ${NUMITEMS}`);

  chars = Array(NUMITEMS).fill().map((_,i) => randomChar());

  charElems = chars.map(c => {
    const el = document.createElement('span');
    el.textContent = c;
    return el;
  })

  console.log(charElems)

  mainEl.append(...charElems);
}

init();
