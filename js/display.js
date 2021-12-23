"use strict";
var ClsToken = { SLSH: "slashed", BSLSH: "bslashed", MINI: "mini" };
var Allow = {
    1: { ClockWise: function (t) { return "\u2190\n".concat(t); }, CounterClockWise: function (t) { return "\u2191".concat(t); } },
    2: { ClockWise: function (t) { return "".concat(t, "\u2191"); }, CounterClockWise: function (t) { return "\u2192\n".concat(t); } },
    3: { ClockWise: function (t) { return "".concat(t, "\n\u2192"); }, CounterClockWise: function (t) { return "".concat(t, "\u2193"); } },
    4: { ClockWise: function (t) { return "\u2193".concat(t); }, CounterClockWise: function (t) { return "".concat(t, "\n\u2190"); } },
};
var _BASE_T4 = [null, null, null, null];
function createTuple4(fn) {
    if (fn instanceof Function) {
        return _BASE_T4.map(function (_, i) { return fn(i); });
    }
    return [fn, fn, fn, fn];
}
var D_SIZE = 4;
/**
 * `index` 番目の HTML 要素を探すか、無ければ追加する関数
 * @param parent 親となる要素
 * @param tagName HTMLタグ名
 * @param index
 * @param clsName ※クラス名は検索条件ではない
 * @returns 発見／追加した要素
 */
function getOrCreateElement(parent, tagName, index, clsName) {
    var _a;
    if (index === void 0) { index = 0; }
    var collection = parent.getElementsByTagName(tagName);
    var newElem = collection[index];
    while (collection.length <= index) {
        newElem = document.createElement(tagName);
        parent.append(newElem);
    }
    if (clsName) {
        if (typeof clsName === 'string') {
            newElem.classList.add(clsName);
        }
        else {
            (_a = newElem.classList).add.apply(_a, clsName);
        }
    }
    return newElem;
}
function slashSwitchCell(cell, slash, on) {
    var clsList = cell.td.classList;
    var token = slash ? ClsToken.SLSH : ClsToken.BSLSH;
    if (on) {
        clsList.add(token);
    }
    else {
        clsList.remove(token);
    }
}
function qToV(q) {
    var x = q & 2 ? 0 : 1;
    return { x: x, y: (q & 1) ^ x ? 0 : 1 };
}
var DialTable = /** @class */ (function () {
    /**
     * @param planeTable 予め用意した `<table>` の `HTMLElement`
     */
    function DialTable(planeTable) {
        var tbody = getOrCreateElement(planeTable, "tbody");
        var trList = createTuple4(function (i) { return getOrCreateElement(tbody, "tr", i); });
        this.data = trList.map(function (tr, i) { return createTuple4(function (j) {
            var e = getOrCreateElement(tr, "td", j);
            if (i == D_SIZE / 2) {
                e.classList.add("b-top");
            }
            if (j == D_SIZE / 2) {
                e.classList.add("b-left");
            }
            return { td: e, div: getOrCreateElement(e, "div", 0, "content") };
        }); });
        this.slashOn();
        this.resetText();
    }
    DialTable.prototype.resetText = function () {
        for (var _i = 0, _a = this.data; _i < _a.length; _i++) {
            var row = _a[_i];
            for (var _b = 0, row_1 = row; _b < row_1.length; _b++) {
                var cell = row_1[_b];
                cell.div.innerText = "";
            }
        }
    };
    DialTable.prototype.slashSwitch = function (on, part) {
        if (part === undefined) {
            var d = D_SIZE - 1;
            for (var i = 0; i < D_SIZE; i++) {
                slashSwitchCell(this.data[i][i], false, on);
                slashSwitchCell(this.data[i][d - i], true, on);
            }
        }
        else {
            var v = qToV(part);
            v = { x: v.x * 2, y: v.y * 2 };
            if (part & 1) {
                slashSwitchCell(this.data[v.y][v.x], false, on);
                slashSwitchCell(this.data[v.y + 1][v.x + 1], false, on);
            }
            else {
                slashSwitchCell(this.data[v.y + 1][v.x], true, on);
                slashSwitchCell(this.data[v.y][v.x + 1], true, on);
            }
        }
    };
    DialTable.prototype.slashOn = function (part) { this.slashSwitch(true, part); };
    DialTable.prototype.slashOff = function (part) { this.slashSwitch(false, part); };
    DialTable.prototype.getCell = function (q, side) {
        var p1 = qToV(q);
        var p2 = qToV(rotQ(q, side));
        return this.data[p1.y * 2 + p2.y][p1.x * 2 + p2.x];
    };
    DialTable.prototype.displayMessage = function (pos, side, mes) {
        var target = this.getCell(pos, side);
        if (!mes) {
            mes = "";
        }
        else {
            target.td.classList.remove(ClsToken.SLSH, ClsToken.BSLSH);
        }
        target.div.innerText = mes;
        if (mes.length > 1) {
            target.div.classList.add(ClsToken.MINI);
        }
        else {
            target.div.classList.remove(ClsToken.MINI);
        }
    };
    DialTable.prototype.displaySuggest = function (pos, side, sugg) {
        return this.displayMessage(pos, side, Allow[pos][side](sugg.accepted));
    };
    DialTable.prototype.displayByState = function (state, mot) {
        this.resetText();
        this.slashOn();
        if (state === null) {
            return null;
        }
        if (state instanceof WaitingState || mot === null) {
            // デフォルト表示
            for (var _i = 0, QList_1 = QList; _i < QList_1.length; _i++) {
                var q = QList_1[_i];
                var state_1 = StartState.FIRST_STEPS[q];
                var gyoes = [
                    [ROTATION.Clock, state_1.clockRot],
                    [ROTATION.Counter, state_1.counterRot]
                ];
                for (var _a = 0, gyoes_1 = gyoes; _a < gyoes_1.length; _a++) {
                    var _b = gyoes_1[_a], r = _b[0], s = _b[1];
                    if (s === null) {
                        continue;
                    }
                    var mes = "";
                    if (s.normalRot instanceof AcceptableState) {
                        mes += s.normalRot.accepted;
                    }
                    if (s.reverseRot instanceof AcceptableState) {
                        mes += s.reverseRot.accepted;
                    }
                    this.displayMessage(q, r, mes);
                }
            }
        }
        else if (state instanceof TouchedState) {
            // タップ直後
            var gyoes = [
                [ROTATION.Clock, state.clockRot],
                [ROTATION.Counter, state.counterRot]
            ];
            for (var _c = 0, gyoes_2 = gyoes; _c < gyoes_2.length; _c++) {
                var _d = gyoes_2[_c], r = _d[0], s = _d[1];
                var q = rotQ(mot.lastPos, r);
                if (s === null) {
                    continue;
                }
                if (s.normalRot instanceof AcceptableState) {
                    this.displaySuggest(q, r, s.normalRot);
                }
                if (s.reverseRot instanceof AcceptableState) {
                    var rr = rev(r);
                    this.displaySuggest(q, rr, s.reverseRot);
                }
            }
        }
        else if (state instanceof FollowingState) {
            // 入力中
            var p = mot.lastPos;
            for (var _e = 0, _f = [ROTATION.Clock, ROTATION.Counter]; _e < _f.length; _e++) {
                var r = _f[_e];
                var q = rotQ(p, r);
                var s = mot.rot === r
                    ? state.normalRot
                    : state.reverseRot;
                if (s === null) {
                    continue;
                }
                if (s instanceof AcceptableState) {
                    this.displaySuggest(p, r, s);
                }
                if (s.normalRot instanceof AcceptableState) {
                    this.displaySuggest(q, r, s.normalRot);
                }
                if (s.reverseRot instanceof AcceptableState) {
                    var rr = rev(r);
                    this.displaySuggest(q, rr, s.reverseRot);
                }
            }
            if (state instanceof AcceptableState) {
                this.displayMessage(p, null, state.accepted);
                return state.accepted;
            }
        }
        else {
            assertUnreachable(state);
        }
        return null;
    };
    return DialTable;
}());
//# sourceMappingURL=display.js.map