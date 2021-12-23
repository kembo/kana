class DanAState extends ContinueAcceptableState { }
class DanIState extends AcceptableState { }
class DanUState extends ContinueAcceptableState { }
class DanEState extends AcceptableState { }
class DanOState extends AcceptableState { }
type KanaState = DanAState | DanIState | DanUState | DanEState | DanOState
/**
 * あ～お段を持つことを想定した行を返す関数
 * @returns 先頭(あ段)の仮名を示す `State`
 */
function createGyoStates(a: string, i: string | null, u: string, e: string | null, o: string): DanAState {
    const oSt = new DanOState(o);
    const eSt = e === null ? null : new DanEState(e);
    const uSt = new DanUState(u, oSt, eSt);
    const iSt = i === null ? null : new DanIState(i);
    return new DanAState(a, uSt, iSt);
}

/** 仮名一覧(行ごと) */
const KANAS_LIST = {
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
} as const;
console.log(KANAS_LIST);

class PreGyoState extends FollowingState {
    readonly normalRot: DanAState;
    readonly reverseRot: FollowingState | null;

    constructor(normalRot: DanAState, reverseRot?: FollowingState | null) {
        super();
        this.normalRot = normalRot;
        this.reverseRot = reverseRot || null;
    }
}
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
    3: new TouchedState(GYOES_LIST.k, GYOES_LIST.a),
    2: new TouchedState(GYOES_LIST.s, GYOES_LIST.t),
    1: new TouchedState(GYOES_LIST.h, GYOES_LIST.n),
    4: new TouchedState(GYOES_LIST.m, GYOES_LIST.r)
});

GYOES_LIST.a.normalRot.next
