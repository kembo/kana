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
var DanAState = /** @class */ (function (_super) {
    __extends(DanAState, _super);
    function DanAState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DanAState;
}(ContinueAcceptableState));
var DanIState = /** @class */ (function (_super) {
    __extends(DanIState, _super);
    function DanIState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DanIState;
}(AcceptableState));
var DanUState = /** @class */ (function (_super) {
    __extends(DanUState, _super);
    function DanUState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DanUState;
}(ContinueAcceptableState));
var DanEState = /** @class */ (function (_super) {
    __extends(DanEState, _super);
    function DanEState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DanEState;
}(AcceptableState));
var DanOState = /** @class */ (function (_super) {
    __extends(DanOState, _super);
    function DanOState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DanOState;
}(AcceptableState));
/**
 * あ～お段を持つことを想定した行を返す関数
 * @returns 先頭(あ段)の仮名を示す `State`
 */
function createGyoStates(a, i, u, e, o) {
    var oSt = new DanOState(o);
    var eSt = e === null ? null : new DanEState(e);
    var uSt = new DanUState(u, oSt, eSt);
    var iSt = i === null ? null : new DanIState(i);
    return new DanAState(a, uSt, iSt);
}
/** 仮名一覧(行ごと) */
var KANAS_LIST = {
    a: createGyoStates('あ', 'い', 'う', 'え', 'お'),
    k: createGyoStates('か', 'き', 'く', 'け', 'こ'),
    s: createGyoStates('さ', 'し', 'す', 'せ', 'そ'),
    t: createGyoStates('た', 'ち', 'つ', 'て', 'と'),
    n: createGyoStates('な', 'に', 'ぬ', 'ね', 'の'),
    h: createGyoStates('は', 'ひ', 'ふ', 'へ', 'ほ'),
    m: createGyoStates('ま', 'み', 'む', 'め', 'も'),
    y: createGyoStates('や', null, 'ゆ', null, 'よ'),
    r: createGyoStates('ら', 'り', 'る', 'れ', 'ろ'),
    w: createGyoStates('わ', null, 'を', null, 'ん')
};
console.log(KANAS_LIST);
var PreGyoState = /** @class */ (function (_super) {
    __extends(PreGyoState, _super);
    function PreGyoState(normalRot, reverseRot) {
        var _this = _super.call(this) || this;
        _this.normalRot = normalRot;
        _this.reverseRot = reverseRot || null;
        return _this;
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
    3: new TouchedState(GYOES_LIST.k, GYOES_LIST.a),
    2: new TouchedState(GYOES_LIST.s, GYOES_LIST.t),
    1: new TouchedState(GYOES_LIST.h, GYOES_LIST.n),
    4: new TouchedState(GYOES_LIST.m, GYOES_LIST.r)
});
GYOES_LIST.a.normalRot.next;
//# sourceMappingURL=states.js.map