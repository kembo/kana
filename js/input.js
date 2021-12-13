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
function quadrant(pos) {
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
function getElementCarefully(id) {
    var elem = document.getElementById(id);
    if (elem === null) {
        throw new Error("#" + id + " is not found!");
    }
    return elem;
}
window.addEventListener('load', function () {
    var inputArea = getElementCarefully("input-area");
    var printPos = getElementCarefully("position");
    var textBox = getElementCarefully("text-box");
    var posOfArea = function (p) { return relPos(centerPos(inputArea), touchToVec(p)); };
    inputArea.addEventListener('touchstart', function (ev) {
        ev.preventDefault();
        textBox.innerText = "";
    });
    inputArea.addEventListener('touchmove', function (ev) {
        ev.preventDefault();
        var pos = posOfArea(ev.touches[0]);
        var quad = "" + quadrant(pos);
        printPos.innerText = "X:" + pos.x + ", Y:" + pos.y;
        if (textBox.innerText.slice(-1) != quad) {
            textBox.innerText += quad;
        }
    });
});
//# sourceMappingURL=input.js.map