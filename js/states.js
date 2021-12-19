"use strict";
/**
 * 通常の仮名用の `State` を作る関数
 * @param char 対象の仮名
 * @param normal 順行で回し続けた場合の状態
 * @param reverse 逆行した場合の状態
 * @returns 仮名自体が `null` だったら `null` を返す
 */
function createKanaState(char, normal, reverse) {
    if (char === null) {
        return null;
    }
    return new AcceptableState(char, normal, reverse);
}
/**
 * あ～お段を持つことを想定した行を返す関数
 * @param text その行の文字列(5文字限定とし、空白は全角スペースで表す ※あ段は空白にならない)
 * @returns 先頭(あ段)の仮名を示す `State`
 */
function createGyoStates(text) {
    if (text.length != 5) {
        throw new Error("Gyo length must be 5.");
    }
    var kanas = text.split('').map(function (c) { return c === '　' ? null : c; });
    var o = createKanaState(kanas[4]);
    var e = createKanaState(kanas[3]);
    var u = createKanaState(kanas[2], o, e);
    var i = createKanaState(kanas[1]);
    var a = createKanaState(kanas[0], u, i);
    if (a === null) {
        throw new Error("The first char of the Gyo must not be null.");
    }
    return a;
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
    y: createGyoStates('や　ゆ　よ'),
    r: createGyoStates('らりるれろ'),
    w: createGyoStates('わ　を　ん')
};
console.log(KANAS_LIST);
/** 行一覧 */
var GYOES_LIST = {
    a: new FollowingState(KANAS_LIST.a),
    k: new FollowingState(KANAS_LIST.k),
    s: new FollowingState(KANAS_LIST.s),
    t: new FollowingState(KANAS_LIST.t),
    n: new FollowingState(KANAS_LIST.n),
    h: new FollowingState(KANAS_LIST.h),
    m: new FollowingState(KANAS_LIST.m, KANAS_LIST.y),
    r: new FollowingState(KANAS_LIST.r, KANAS_LIST.w)
};
/** 最初の入力状態 */
var FIRST_STEPS = {
    3: new StartState(GYOES_LIST.k, GYOES_LIST.a),
    2: new StartState(GYOES_LIST.s, GYOES_LIST.t),
    1: new StartState(GYOES_LIST.h, GYOES_LIST.n),
    4: new StartState(GYOES_LIST.m, GYOES_LIST.r)
};
//# sourceMappingURL=states.js.map