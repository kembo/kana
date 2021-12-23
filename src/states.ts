type StateNode = string | WithNote | FollowingState | StateTree | null;
type StateTree = [head: string | WithNote, norm?: StateNode, rev?: StateNode];
function subState(arg?: StateNode): FollowingState | null {
    if (arg === null || arg === undefined) {
        return null;
    } else if (arg instanceof FollowingState) {
        return arg;
    } else if (typeof arg == 'string' || !Array.isArray(arg)) {
        return new AcceptableState(arg);
    } else {
        return createStatesRec(...arg);
    }
}
function createStatesRec(...tree: StateTree): AcceptableState {
    const [head, norm, rev] = tree;
    return new AcceptableState(head, subState(norm), subState(rev));
}

function createYoon(iK: string): AcceptableState {
    return createStatesRec(iK, [iK + 'ゃ', [iK + 'ゅ', iK + 'ょ']]);
}
/**
 * あ～お段を持つことを想定した行を返す関数
 * @param gyo その行の仮名文字一覧
 * @returns 先頭(あ段)の仮名を示す `State`
 */
function createGyoStates(gyo: string | WithNote[], yoon?: boolean): AcceptableState {
    if (gyo.length == 3) {
        return createStatesRec(gyo[0], [gyo[1], gyo[2]]);
    }
    if (gyo.length == 5) {
        if (yoon && typeof gyo == 'string') {
            return createStatesRec(
                gyo[0],
                [gyo[2], gyo[4], gyo[3]],
                createYoon(gyo[1])
            );
        }
        return createStatesRec(gyo[0], [gyo[2], gyo[4], gyo[3]], gyo[1]);
    }
    throw new Error("Gyo length must be 3 or 5!");
}
function createKomojiStates(yo: string): AcceptableState {
    const conv: WithNote[] = yo.split('').map(y => { return { char: y, note: `小${y}` }; })
    if (yo.length == 1) {
        return new AcceptableState(conv[0]);
    } else {
        return createGyoStates(conv);
    }
}

/** 仮名一覧(行ごと) */
const KANAS_LIST = {
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
} as const;
console.log(KANAS_LIST);

class PreGyoState extends FollowingState { }
/** 行一覧 */
const GYOES_LIST = {
    a: new PreGyoState(KANAS_LIST.a, KANAS_LIST.x),
    k: new PreGyoState(KANAS_LIST.k, new PreGyoState(KANAS_LIST.g)),
    s: new PreGyoState(KANAS_LIST.s, new PreGyoState(KANAS_LIST.z)),
    t: new PreGyoState(KANAS_LIST.t, new AcceptableState({ char: 'っ', note: '小っ' }, KANAS_LIST.d)),
    n: new PreGyoState(KANAS_LIST.n),
    h: new PreGyoState(KANAS_LIST.h, new PreGyoState(KANAS_LIST.b, KANAS_LIST.p)),
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
