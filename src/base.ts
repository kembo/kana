interface ReadonlyArray<T> {
    /** tuple のための拡張 */
    map<U>(callbackfn: (value: T, index: number, tuple: T[] | [T]) => U, thisArg?: any): { [K in keyof this]: U }
}
const assertUnreachable = (x: never): never => {
    throw new Error(`Unexpected value!! ${x}`);
}

/** 平面上の位置座標のためのインターフェイス */
interface Vector2 {
    x: number,
    y: number
}
/** 象限 */
type Quadrant = 1 | 2 | 3 | 4;
const QList: Quadrant[] = [4, 1, 2, 3];
function toQ(n: number): Quadrant {
    if (n < 0) { n = n % 4 + 4; }
    return QList[Math.floor(n) % 4];
}
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
function rev(rot: Rotaion): Rotaion {
    return rot === ROTATION.Clock
        ? ROTATION.Counter
        : ROTATION.Clock;
}
function rotQ(q: Quadrant, rot: Rotaion | boolean | null): Quadrant {
    if (rot === null) { return q; }
    if (rot === ROTATION.Clock || rot === true) {
        return q == 4 ? 1 : q + 1 as Quadrant;
    } else {
        return q == 1 ? 4 : q - 1 as Quadrant;
    }
}
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
 */
function detectMotion(prevMot: Motion, curPos: Quadrant): Motion | null {
    const newRot = detectRotation(prevMot.lastPos, curPos);
    return newRot === null ? null : new Motion(curPos, newRot);
}


/** `State` が満たすべき条件 */
interface AbstractState {
    next(pos: Quadrant, mot?: Motion): ([AbstractState, Motion] | null)
}
/** 既知の定義済みの状態 */
type State = WaitingState | TouchedState | FollowingState;
/** 初期状態 */
class WaitingState implements AbstractState {
    readonly FIRST_STEPS;

    constructor(list: { readonly [Q in Quadrant]: TouchedState }) {
        this.FIRST_STEPS = list;
    }

    public next(pos: Quadrant): [TouchedState, Motion] | null {
        const st = this.FIRST_STEPS[pos];
        if (!st) { return null; }
        return [st, new Motion(pos)];
    }
};
/** 入力中の状態が満たすべき条件 */
interface AbstractInputtingState extends AbstractState {
    next(pos: Quadrant, mot: Motion): ([FollowingState, Motion] | null);
};
/** 入力中の状態の型 */
type InputtingState = TouchedState | FollowingState;
/** タッチ直後 */
class TouchedState implements AbstractInputtingState {
    readonly clockRot: FollowingState | null;
    readonly counterRot: FollowingState | null;

    constructor(clockRot?: FollowingState | null, counterRot?: FollowingState | null) {
        this.clockRot = clockRot || null;
        this.counterRot = counterRot || null;
    }

    public next(pos: Quadrant, prevMot: Motion): [FollowingState, Motion] | null {
        const newMot = detectMotion(prevMot, pos);
        if (newMot === null) { return null; }
        const newStat = newMot.rot === ROTATION.Clock
            ? this.clockRot
            : this.counterRot
        if (newStat === null) { return null; }
        return [newStat, newMot];
    }
}
/** コマンド入力状態 */
class FollowingState implements AbstractInputtingState {
    readonly normalRot: FollowingState | null;
    readonly reverseRot: FollowingState | null;

    constructor(normalRot?: FollowingState | null, reverseRot?: FollowingState | null) {
        this.normalRot = normalRot || null;
        this.reverseRot = reverseRot || null;
    }

    public next(pos: Quadrant, prevMot: Motion): [FollowingState, Motion] | null {
        const newMot = detectMotion(prevMot, pos);
        if (newMot === null) { return null; }
        const newStat = newMot.rot === prevMot.rot
            ? this.normalRot
            : this.reverseRot;
        if (newStat === null) { return null; }
        return [newStat, newMot];
    }
}
interface WithNote { char: string; note: string; }
/** ここで入力終了することが可能な状態 */
class AcceptableState extends FollowingState {
    readonly accepted: string;
    readonly note?: string;

    constructor(char: string | WithNote, normalRot?: FollowingState | null, reverseRot?: FollowingState | null) {
        super(normalRot, reverseRot);
        if (typeof char == 'string') {
            this.accepted = char;
        } else {
            this.accepted = char.char;
            this.note = char.note;
        }
    }
}
/** `AcceptableState` に続く `AcceptableState` */
class ContinueAcceptableState extends AcceptableState {
    readonly normalRot: AcceptableState;

    constructor(char: string | WithNote, normalRot: AcceptableState, reverseRot?: FollowingState | null) {
        super(char, null, reverseRot);
        this.normalRot = normalRot;
    }
}
