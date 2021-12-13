interface Vector2 {
    x: number;
    y: number;
}
type Quadrant = 1 | 2 | 3 | 4;

function centerPos(elem: HTMLElement): Vector2 {
    const rect = elem.getBoundingClientRect();
    return {
        x: (rect.left + rect.right) / 2,
        y: (rect.top + rect.bottom) / 2
    };
}

function touchToVec(touch: Touch): Vector2 {
    return { x: touch.clientX, y: touch.clientY };
}

function relPos(from: Vector2, to: Vector2): Vector2 {
    return {
        x: to.x - from.x,
        y: to.y - from.y
    };
}

function quadrant(pos: Vector2): Quadrant {
    if (pos.x < 0) {
        if (pos.y < 0) {
            return 3;
        }
        return 2;
    }
    if (pos.y < 0) {
        return 4;
    }
    return 1;
}

function getElementCarefully(id: string): HTMLElement {
    const elem = document.getElementById(id);
    if (elem === null) {
        throw new Error(`#${id} is not found!`);
    }
    return elem;
}


window.addEventListener('load', () => {
    const inputArea = getElementCarefully("input-area");
    const printPos = getElementCarefully("position");
    const textBox = getElementCarefully("text-box");

    const posOfArea = (p: Touch) => relPos(centerPos(inputArea), touchToVec(p));

    inputArea.addEventListener('touchstart', ev => {
        ev.preventDefault();
        textBox.innerText = "";
    });
    inputArea.addEventListener('touchmove', ev => {
        ev.preventDefault();
        const pos = posOfArea(ev.touches[0]);
        const quad = `${quadrant(pos)}`;

        printPos.innerText = `X:${pos.x}, Y:${pos.y}`;
        if (textBox.innerText.slice(-1) != quad) {
            textBox.innerText += quad;
        }
    });
});
