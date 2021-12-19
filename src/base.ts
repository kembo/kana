/** 平面上の位置座標のためのインターフェイス */
interface Vector2 {
    x: number,
    y: number
}
/** 象限 */
type Quadrant = 1 | 2 | 3 | 4;
/** 象限判定 */
function detectQuadrant(pos: Vector2): Quadrant {
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
const ROTATION = { Clock: "ClockWise", Counter: "CounterClockWise" } as const;
/** 回転方向を示す型 */
type Rotaion = typeof ROTATION[keyof typeof ROTATION];
/**
 * 回転方向判定関数
 * @param prev 移動元
 * @param cur 移動先
 * @returns 回転方向を判別出来ない組合せなら`null`を返す
 */
function detectRotation(prev: Quadrant, cur: Quadrant): Rotaion | null {
    const i = cur - prev;
    if (i == 1 || i == -3) {
        return ROTATION.Clock;
    } else if (i == -1 || i == 3) {
        return ROTATION.Counter;
    }
    return null;
}


/** 動きを示す型 */
class Motion {
    lastPos: Quadrant;
    rot: Rotaion | null;

    constructor(pos: Quadrant, rot?: Rotaion | null) {
        this.lastPos = pos;
        this.rot = rot || null;
    }
};
/**
 * 新しい動作状態を返す関数
 * @param prevMot 1つ前の動作状態
 * @param curPos 新しい象限
 * @returns 前の状態が `null` なら `null` を返す
 */
function detectMotion(prevMot: Motion | null, curPos: Quadrant): Motion | null {
    if (prevMot === null) { return null; }

    const newRot = detectRotation(prevMot.lastPos, curPos);
    return new Motion(curPos, newRot);
}


/** コマンド入力状態を示すクラス */
class FollowingState {
    readonly normalRot: FollowingState | null;
    readonly reverseRot: FollowingState | null;

    constructor(normalRot?: FollowingState | null, reverseRot?: FollowingState | null) {
        this.normalRot = normalRot || null;
        this.reverseRot = reverseRot || null;
    }
}
/** ここで入力終了することが可能な状態 */
class AcceptableState extends FollowingState {
    readonly accepted: string;

    constructor(char: string, normalRot?: FollowingState | null, reverseRot?: FollowingState | null) {
        super(normalRot, reverseRot);
        this.accepted = char;
    }
}
/** 初期状態 */
class StartState {
    readonly clockRot: FollowingState | null;
    readonly counterRot: FollowingState | null;

    constructor(clockRot?: FollowingState | null, counterRot?: FollowingState | null) {
        this.clockRot = clockRot || null;
        this.counterRot = counterRot || null;
    }
}
/** 入力状態全体の型 */
type InputState = StartState | FollowingState;


/**
 * 次の入力状態を返す関数
 * @param prev 1つ前の状態
 * @param motion 1つ前までの動作状態
 * @param curPos
 * @returns
 */
function nextState(prev: InputState | null, motion: Motion, curPos: Quadrant): [FollowingState | null, Motion] | [null, null] {
    if (prev === null) { return [null, null]; }

    const newMot = detectMotion(motion, curPos);
    if (newMot === null) { return [null, null]; }

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
