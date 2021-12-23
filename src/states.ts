type StateNode = string | FollowingState | StateTree | null;
type StateTree = [head: string, norm?: StateNode, rev?: StateNode];
function subState(arg?: StateNode): FollowingState | null {
    if (arg === null || arg === undefined) {
        return null;
    } else if (arg instanceof FollowingState) {
        return arg;
    } else if (typeof arg == 'string') {
        return new AcceptableState(arg);
    } else {
        return createStatesRec(...arg);
    }
}
function createStatesRec(...tree: StateTree): AcceptableState {
    const [head, norm, rev] = tree;
    return new AcceptableState(head, subState(norm), subState(rev));
}

/**
 * あ～お段を持つことを想定した行を返す関数
 * @param gyo その行の仮名文字一覧
 * @returns 先頭(あ段)の仮名を示す `State`
 */
function createGyoStates(gyo: string): AcceptableState {
    if (gyo.length == 3) {
        return createStatesRec(gyo[0], [gyo[1], gyo[2]]);
    }
    if (gyo.length == 5) {
        return createStatesRec(gyo[0], [gyo[2], gyo[4], gyo[3]], gyo[1]);
    }
    throw new Error("Gyo length must be 3 or 5!");
}

/** 仮名一覧(行ごと) */
const KANAS_LIST = {
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
} as const;
console.log(KANAS_LIST);

class PreGyoState extends FollowingState { }
/** 行一覧 */
const GYOES_LIST = {
    a: new PreGyoState(KANAS_LIST.a),
    k: new PreGyoState(KANAS_LIST.k),
    s: new PreGyoState(KANAS_LIST.s),
    t: new PreGyoState(KANAS_LIST.t),
    n: new PreGyoState(KANAS_LIST.n),
    h: new PreGyoState(KANAS_LIST.h),
    m: new PreGyoState(KANAS_LIST.m, KANAS_LIST.y),
    r: new PreGyoState(KANAS_LIST.r, KANAS_LIST.w)
} as const;

/** 最初の状態 */
const StartState = new WaitingState({
    3: new TouchedState(GYOES_LIST.a, GYOES_LIST.k),
    2: new TouchedState(GYOES_LIST.s, GYOES_LIST.t),
    1: new TouchedState(GYOES_LIST.h, GYOES_LIST.n),
    4: new TouchedState(GYOES_LIST.m, GYOES_LIST.r)
});
