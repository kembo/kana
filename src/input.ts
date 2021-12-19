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

function getElementCarefully(id: string): HTMLElement {
    const elem = document.getElementById(id);
    if (elem === null) {
        throw new Error(`#${id} is not found!`);
    }
    return elem;
}


window.addEventListener('load', () => {
    const inputArea = getElementCarefully("input-area");
    const textBox = getElementCarefully("text-box");

    const posOfArea = (p: Touch) => relPos(centerPos(inputArea), touchToVec(p));

    let mot: Motion | null = null;
    let stat: InputState | null = null;

    inputArea.addEventListener('touchstart', ev => {
        ev.preventDefault();
        if (stat instanceof AcceptableState) {
            textBox.innerText += stat.accepted;
        }

        const pos = detectQuadrant(posOfArea(ev.touches[0]));
        stat = FIRST_STEPS[pos];
        mot = new Motion(pos);
    });
    inputArea.addEventListener('touchmove', ev => {
        ev.preventDefault();
        if (stat === null || mot === null) { return; }

        const pos = detectQuadrant(posOfArea(ev.touches[0]));
        if (pos != mot.lastPos) {
            [stat, mot] = nextState(stat, mot, pos);
            console.log([stat, mot]);
        }
    });
    inputArea.addEventListener('touchend', ev => {
        ev.preventDefault();
        if (stat === null || mot === null) { return; }

        if (stat instanceof AcceptableState) {
            textBox.innerText += stat.accepted;
        }
        stat = null;
        mot = null;
    });
});
