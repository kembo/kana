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
 * @returns 前の状態が `null` なら `null` を返す
 */
function detectMotion(prevMot, curPos) {
    if (prevMot === null) {
        return null;
    }
    var newRot = detectRotation(prevMot.lastPos, curPos);
    return new Motion(curPos, newRot);
}
/** コマンド入力状態を示すクラス */
var FollowingState = /** @class */ (function () {
    function FollowingState(normalRot, reverseRot) {
        this.normalRot = normalRot || null;
        this.reverseRot = reverseRot || null;
    }
    return FollowingState;
}());
/** ここで入力終了することが可能な状態 */
var AcceptableState = /** @class */ (function (_super) {
    __extends(AcceptableState, _super);
    function AcceptableState(char, normalRot, reverseRot) {
        var _this = _super.call(this, normalRot, reverseRot) || this;
        _this.accepted = char;
        return _this;
    }
    return AcceptableState;
}(FollowingState));
/** 初期状態 */
var StartState = /** @class */ (function () {
    function StartState(clockRot, counterRot) {
        this.clockRot = clockRot || null;
        this.counterRot = counterRot || null;
    }
    return StartState;
}());
/**
 * 次の入力状態を返す関数
 * @param prev 1つ前の状態
 * @param motion 1つ前までの動作状態
 * @param curPos
 * @returns
 */
function nextState(prev, motion, curPos) {
    if (prev === null) {
        return [null, null];
    }
    var newMot = detectMotion(motion, curPos);
    if (newMot === null) {
        return [null, null];
    }
    if (prev instanceof StartState) {
        if (newMot.rot === ROTATION.Clock) {
            return [prev.clockRot, newMot];
        }
        return [prev.counterRot, newMot];
    }
    if (newMot.rot === motion.rot) {
        return [prev.normalRot, newMot];
    }
    return [prev.reverseRot, newMot];
}
//# sourceMappingURL=base.js.map