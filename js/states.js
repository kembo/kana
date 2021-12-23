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
    else if (typeof arg == 'string' || !Array.isArray(arg)) {
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
function createYoon(iK) {
    return createStatesRec(iK, [iK + 'ゃ', [iK + 'ゅ', iK + 'ょ']]);
}
/**
 * あ～お段を持つことを想定した行を返す関数
 * @param gyo その行の仮名文字一覧
 * @returns 先頭(あ段)の仮名を示す `State`
 */
function createGyoStates(gyo, yoon) {
    if (gyo.length == 3) {
        return createStatesRec(gyo[0], [gyo[1], gyo[2]]);
    }
    if (gyo.length == 5) {
        if (yoon && typeof gyo == 'string') {
            return createStatesRec(gyo[0], [gyo[2], gyo[4], gyo[3]], createYoon(gyo[1]));
        }
        return createStatesRec(gyo[0], [gyo[2], gyo[4], gyo[3]], gyo[1]);
    }
    throw new Error("Gyo length must be 3 or 5!");
}
function createKomojiStates(yo) {
    var conv = yo.split('').map(function (y) { return { char: y, note: "\u5C0F".concat(y) }; });
    if (yo.length == 1) {
        return new AcceptableState(conv[0]);
    }
    else {
        return createGyoStates(conv);
    }
}
/** 仮名一覧(行ごと) */
var KANAS_LIST = {
    a: createGyoStates('あいうえお'),
    k: createGyoStates('かきくけこ', true),
    g: createGyoStates('がぎぐげご', true),
    s: createGyoStates('さしすせそ', true),
    z: createGyoStates('ざじずぜぞ', true),
    t: createGyoStates('たちつてと', true),
    d: createGyoStates('だぢづでど', true),
    n: createGyoStates('なにぬねの', true),
    h: createGyoStates('はひふへほ', true),
    p: createGyoStates('ぱぴぷぺぽ', true),
    b: createGyoStates('ばびぶべぼ', true),
    m: createGyoStates('まみむめも', true),
    y: createStatesRec('や', ['ゆ', 'よ', createKomojiStates('ゃゅょ')], ['（', '）', '　']),
    r: createGyoStates('らりるれろ', true),
    w: createStatesRec('わ', ['を', 'ん', createKomojiStates('ゎ')], ['、', ['。', '！', '？'], '：']),
    x: createKomojiStates('ぁぃぅぇぉ')
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
    a: new PreGyoState(KANAS_LIST.a, KANAS_LIST.x),
    k: new PreGyoState(KANAS_LIST.k, new PreGyoState(KANAS_LIST.g)),
    s: new PreGyoState(KANAS_LIST.s, new PreGyoState(KANAS_LIST.z)),
    t: new PreGyoState(KANAS_LIST.t, new AcceptableState({ char: 'っ', note: '小っ' }, KANAS_LIST.d)),
    n: new PreGyoState(KANAS_LIST.n),
    h: new PreGyoState(KANAS_LIST.h, new PreGyoState(KANAS_LIST.b, KANAS_LIST.p)),
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