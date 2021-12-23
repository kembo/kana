"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
function subState(arg) {
    if (arg === null || arg === undefined) {
        return null;
    }
    else if (arg instanceof FollowingState) {
        return arg;
    }
    else if (typeof arg == 'string') {
        return new AcceptableState(arg);
    }
    else {
        return createStatesRec.apply(void 0, arg);
    }
}
function createStatesRec() {
    var tree = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        tree[_i] = arguments[_i];
    }
    var head = tree[0], norm = tree[1], rev = tree[2];
    return new AcceptableState(head, subState(norm), subState(rev));
}
/**
 * あ～お段を持つことを想定した行を返す関数
 * @param gyo その行の仮名文字一覧
 * @returns 先頭(あ段)の仮名を示す `State`
 */
function createGyoStates(gyo) {
    if (gyo.length == 3) {
        return createStatesRec(gyo[0], [gyo[1], gyo[2]]);
    }
    if (gyo.length == 5) {
        return createStatesRec(gyo[0], [gyo[2], gyo[4], gyo[3]], gyo[1]);
    }
    throw new Error("Gyo length must be 3 or 5!");
}
/** 仮名一覧(行ごと) */
var KANAS_LIST = {
    a: createGyoStates('あいうえお'),
    k: createGyoStates('かきくけこ'),
    s: createGyoStates('さしすせそ'),
    t: createGyoStates('たちつてと'),
    n: createGyoStates('なにぬねの'),
    h: createGyoStates('はひふへほ'),
    m: createGyoStates('まみむめも'),
    y: createGyoStates('やゆよ'),
    r: createGyoStates('らりるれろ'),
    w: createGyoStates('わをん')
};
console.log(KANAS_LIST);
var PreGyoState = /** @class */ (function (_super) {
    __extends(PreGyoState, _super);
    function PreGyoState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PreGyoState;
}(FollowingState));
/** 行一覧 */
var GYOES_LIST = {
    a: new PreGyoState(KANAS_LIST.a),
    k: new PreGyoState(KANAS_LIST.k),
    s: new PreGyoState(KANAS_LIST.s),
    t: new PreGyoState(KANAS_LIST.t),
    n: new PreGyoState(KANAS_LIST.n),
    h: new PreGyoState(KANAS_LIST.h),
    m: new PreGyoState(KANAS_LIST.m, KANAS_LIST.y),
    r: new PreGyoState(KANAS_LIST.r, KANAS_LIST.w)
};
/** 最初の状態 */
var StartState = new WaitingState({
    3: new TouchedState(GYOES_LIST.a, GYOES_LIST.k),
    2: new TouchedState(GYOES_LIST.s, GYOES_LIST.t),
    1: new TouchedState(GYOES_LIST.h, GYOES_LIST.n),
    4: new TouchedState(GYOES_LIST.m, GYOES_LIST.r)
});
//# sourceMappingURL=states.js.map