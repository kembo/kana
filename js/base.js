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
var assertUnreachable = function (x) {
    throw new Error("Unexpected value!! ".concat(x));
};
var QList = [4, 1, 2, 3];
function toQ(n) {
    if (n < 0) {
        n = n % 4 + 4;
    }
    return QList[Math.floor(n) % 4];
}
/** 象限判定 */
function detectQuadrant(pos) {
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
/** 回転方向 */
var ROTATION = { Clock: "ClockWise", Counter: "CounterClockWise" };
function rev(rot) {
    return rot === ROTATION.Clock
        ? ROTATION.Counter
        : ROTATION.Clock;
}
function rotQ(q, rot) {
    if (rot === null) {
        return q;
    }
    if (rot === ROTATION.Clock || rot === true) {
        return q == 4 ? 1 : q + 1;
    }
    else {
        return q == 1 ? 4 : q - 1;
    }
}
/**
 * 回転方向判定関数
 * @param prev 移動元
 * @param cur 移動先
 * @returns 回転方向を判別出来ない組合せなら`null`を返す
 */
function detectRotation(prev, cur) {
    var i = cur - prev;
    if (i == 1 || i == -3) {
        return ROTATION.Clock;
    }
    else if (i == -1 || i == 3) {
        return ROTATION.Counter;
    }
    return null;
}
/** 動きを示す型 */
var Motion = /** @class */ (function () {
    function Motion(pos, rot) {
        this.lastPos = pos;
        this.rot = rot || null;
    }
    return Motion;
}());
;
/**
 * 新しい動作状態を返す関数
 * @param prevMot 1つ前の動作状態
 * @param curPos 新しい象限
 */
function detectMotion(prevMot, curPos) {
    var newRot = detectRotation(prevMot.lastPos, curPos);
    return newRot === null ? null : new Motion(curPos, newRot);
}
/** 初期状態 */
var WaitingState = /** @class */ (function () {
    function WaitingState(list) {
        this.FIRST_STEPS = list;
    }
    WaitingState.prototype.next = function (pos) {
        var st = this.FIRST_STEPS[pos];
        if (!st) {
            return null;
        }
        return [st, new Motion(pos)];
    };
    return WaitingState;
}());
;
;
/** タッチ直後 */
var TouchedState = /** @class */ (function () {
    function TouchedState(clockRot, counterRot) {
        this.clockRot = clockRot || null;
        this.counterRot = counterRot || null;
    }
    TouchedState.prototype.next = function (pos, prevMot) {
        var newMot = detectMotion(prevMot, pos);
        if (newMot === null) {
            return null;
        }
        var newStat = newMot.rot === ROTATION.Clock
            ? this.clockRot
            : this.counterRot;
        if (newStat === null) {
            return null;
        }
        return [newStat, newMot];
    };
    return TouchedState;
}());
/** コマンド入力状態 */
var FollowingState = /** @class */ (function () {
    function FollowingState(normalRot, reverseRot) {
        this.normalRot = normalRot || null;
        this.reverseRot = reverseRot || null;
    }
    FollowingState.prototype.next = function (pos, prevMot) {
        var newMot = detectMotion(prevMot, pos);
        if (newMot === null) {
            return null;
        }
        var newStat = newMot.rot === prevMot.rot
            ? this.normalRot
            : this.reverseRot;
        if (newStat === null) {
            return null;
        }
        return [newStat, newMot];
    };
    return FollowingState;
}());
/** ここで入力終了することが可能な状態 */
var AcceptableState = /** @class */ (function (_super) {
    __extends(AcceptableState, _super);
    function AcceptableState(char, normalRot, reverseRot) {
        var _this = _super.call(this, normalRot, reverseRot) || this;
        if (typeof char == 'string') {
            _this.accepted = char;
        }
        else {
            _this.accepted = char.char;
            _this.note = char.note;
        }
        return _this;
    }
    return AcceptableState;
}(FollowingState));
/** `AcceptableState` に続く `AcceptableState` */
var ContinueAcceptableState = /** @class */ (function (_super) {
    __extends(ContinueAcceptableState, _super);
    function ContinueAcceptableState(char, normalRot, reverseRot) {
        var _this = _super.call(this, char, null, reverseRot) || this;
        _this.normalRot = normalRot;
        return _this;
    }
    return ContinueAcceptableState;
}(AcceptableState));
//# sourceMappingURL=base.js.map