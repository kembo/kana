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

    if (!(inputArea instanceof HTMLTableElement)) { throw new Error("#input-area must be the TableElement."); }
    const table = new DialTable(inputArea);

    const posOfArea = (p: Touch) => relPos(centerPos(inputArea), touchToVec(p));

    type StatusVariable =
        | [state: InputtingState, motion: Motion]
        | [state: WaitingState, motion: null]
        | [state: null, motion: null];
    let cur: StatusVariable = [StartState, null];
    table.displayByState(...cur);

    type TouchEventFunction = (e: TouchEvent) => void;
    function onTouchEvent(fn: ((e: TouchEvent, s: StatusVariable) => StatusVariable | null)): TouchEventFunction {
        return e => {
            e.preventDefault();
            const prev = cur;
            cur = fn(e, prev) || [null, null];
            if (cur[0] !== prev[0]) {
                table.displayByState(cur[0], cur[1]);
                console.log(cur);
            }
        }
    }
    function onTouching(fn: ((pos: Quadrant, st: State, mt: Motion | null) => [InputtingState, Motion] | null)): TouchEventFunction {
        return onTouchEvent((e, cur) => {
            // state が null なのは異常
            if (cur[0] === null) { return null; }
            return fn(detectQuadrant(posOfArea(e.touches[0])), cur[0], cur[1]);
        });
    }
    inputArea.addEventListener('touchstart', onTouching((pos, st) => {
        if (!(st instanceof WaitingState)) {
            console.error("status invalid in 'touchstart'");
            console.error(`${st}`);
            st = StartState;
        }
        return st.next(pos);
    }));
    inputArea.addEventListener('touchmove', onTouching((pos, st, mt) => {
        if (st instanceof WaitingState || mt === null) { return null; }
        if (pos == mt.lastPos) { return [st, mt]; }
        return st.next(pos, mt);
    }));
    inputArea.addEventListener('touchend', onTouchEvent((_, cur) => {
        const state = cur[0];
        if (state instanceof AcceptableState) {
            textBox.innerText += state.accepted;
        }
        return [StartState, null];
    }));
});
