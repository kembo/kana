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
    var posOfArea = function (p) { return relPos(centerPos(inputArea), touchToVec(p)); };
    var mot = null;
    var stat = null;
    inputArea.addEventListener('touchstart', function (ev) {
        ev.preventDefault();
        if (stat instanceof AcceptableState) {
            textBox.innerText += stat.accepted;
        }
        var pos = detectQuadrant(posOfArea(ev.touches[0]));
        stat = FIRST_STEPS[pos];
        mot = new Motion(pos);
    });
    inputArea.addEventListener('touchmove', function (ev) {
        var _a;
        ev.preventDefault();
        if (stat === null || mot === null) {
            return;
        }
        var pos = detectQuadrant(posOfArea(ev.touches[0]));
        if (pos != mot.lastPos) {
            _a = nextState(stat, mot, pos), stat = _a[0], mot = _a[1];
            console.log([stat, mot]);
        }
    });
    inputArea.addEventListener('touchend', function (ev) {
        ev.preventDefault();
        if (stat === null || mot === null) {
            return;
        }
        if (stat instanceof AcceptableState) {
            textBox.innerText += stat.accepted;
        }
        stat = null;
        mot = null;
    });
});
//# sourceMappingURL=input.js.map