"use strict";
function centerPos(elem) {
    var rect = elem.getBoundingClientRect();
    return {
        x: (rect.left + rect.right) / 2,
        y: (rect.top + rect.bottom) / 2
    };
}
function touchToVec(touch) {
    return { x: touch.clientX, y: touch.clientY };
}
function relPos(from, to) {
    return {
        x: to.x - from.x,
        y: to.y - from.y
    };
}
function getElementCarefully(id) {
    var elem = document.getElementById(id);
    if (elem === null) {
        throw new Error("#".concat(id, " is not found!"));
    }
    return elem;
}
window.addEventListener('load', function () {
    var inputArea = getElementCarefully("input-area");
    var textBox = getElementCarefully("text-box");
    if (!(inputArea instanceof HTMLTableElement)) {
        throw new Error("#input-area must be the TableElement.");
    }
    var table = new DialTable(inputArea);
    var posOfArea = function (p) { return relPos(centerPos(inputArea), touchToVec(p)); };
    var cur = [StartState, null];
    table.displayByState.apply(table, cur);
    function onTouchEvent(fn) {
        return function (e) {
            e.preventDefault();
            var prev = cur;
            cur = fn(e, prev) || [null, null];
            if (cur[0] !== prev[0]) {
                table.displayByState(cur[0], cur[1]);
                console.log(cur);
            }
        };
    }
    function onTouching(fn) {
        return onTouchEvent(function (e, cur) {
            // state が null なのは異常
            if (cur[0] === null) {
                return null;
            }
            return fn(detectQuadrant(posOfArea(e.touches[0])), cur[0], cur[1]);
        });
    }
    inputArea.addEventListener('touchstart', onTouching(function (pos, st) {
        if (!(st instanceof WaitingState)) {
            console.error("status invalid in 'touchstart'");
            console.error("".concat(st));
            st = StartState;
        }
        return st.next(pos);
    }));
    inputArea.addEventListener('touchmove', onTouching(function (pos, st, mt) {
        if (st instanceof WaitingState || mt === null) {
            return null;
        }
        if (pos == mt.lastPos) {
            return [st, mt];
        }
        return st.next(pos, mt);
    }));
    inputArea.addEventListener('touchend', onTouchEvent(function (_, cur) {
        var state = cur[0];
        if (state instanceof AcceptableState) {
            textBox.innerText += state.accepted;
        }
        return [StartState, null];
    }));
});
//# sourceMappingURL=input.js.map