const mainEl = document.querySelector("#main");

const START_NUM = 1;
const END_NUM = 20;

// ----------------------------------------------------------------------------

function init() {
    console.log(`mainEl = ${mainEl.clientWidth} x ${mainEl.clientHeight}`);

    const maxX = mainEl.clientWidth;
    const maxY = mainEl.clientHeight;

    const SIZES = [
        150,
        200,
        250,
    ];

    const COLOURS = [
        "crimson",
        "darkorange",
        "darkred",
        "darkgreen",
        "rebeccapurple",
        "navy",
        "firebrick"
    ];

    const extents = [];

    function randomFromArray(array) {
        return array[ Math.floor(Math.random()*array.length)];
    }

    function nextSmallerFromArray(array, val) {
        for (let i = array.length - 1; i >=0;  i -- ) {
            if ( array[i] < val ) {
                return array[i];
            }
        }
        return array[0];
    }

    function noOverlap( r1, r2 ) {
        return r1.l > r2.r || r1.r < r2.l || r1.t > r2.b || r1.b < r2.t 
    }

    function isSafe(trial) {
        if ( extents.length === 0 ) return true;

        return extents.every( ex => {
            return noOverlap( trial, ex );
        }); 
    }
    
    function getNumElem(num) {
        let size = randomFromArray(SIZES);
        const col = randomFromArray(COLOURS);

        let x, y;
        let safe;
        let rect;
        let tryLimit = 40;

        do {
            x = Math.floor(Math.random()*(maxX-size));
            y = Math.floor(Math.random()*(maxY-size));

            rect = { l: x, r: x + size, t: y, b: y + size, sz: size };
    
            safe = isSafe( rect );

            if (!safe) {
                if ( tryLimit % 10 === 0 ) {
                    size = nextSmallerFromArray( SIZES, size );
                }
            }

            tryLimit --;
            if ( tryLimit === 0 ) {
                console.log(`out of luck!: ${JSON.stringify(rect)} for ${num}`);
                safe = true;
            }
        } while ( !safe )

        console.log(`${num}: ${JSON.stringify(rect)}`);

        const div = document.createElement('div');
        div.textContent = num;

        const bd = ""

        div.style.setProperty('left', `${x}px`);
        div.style.setProperty('top', `${y}px`);
        div.style.setProperty('height', `${size}px`);
        div.style.setProperty('width', `${size}px`);
        div.style.setProperty('font-size', `${size/20.0}rem`);
        div.style.setProperty('color', `${col}`);
        div.style.setProperty('border', `${Math.floor(size/50)+2}px solid indigo`);

        extents.push(rect);

        return div;
    }

    mainEl.innerHTML = "";

    for (let num = START_NUM; num <=END_NUM ; num++) {
        mainEl.appendChild(getNumElem(num));
    }
}

// ----------------------------------------------------------------------------

init();


