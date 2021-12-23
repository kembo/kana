const ClsToken = { SLSH: "slashed", BSLSH: "bslashed", MINI: "mini", ING: "inputting" };
const Allow: { readonly [Q in Quadrant]: { readonly [R in Rotaion]: (t: string) => string } } = {
    1: { ClockWise: t => `←\n${t}`, CounterClockWise: t => `↑${t}` },
    2: { ClockWise: t => `${t}↑`, CounterClockWise: t => `→\n${t}` },
    3: { ClockWise: t => `${t}\n→`, CounterClockWise: t => `${t}↓` },
    4: { ClockWise: t => `↓${t}`, CounterClockWise: t => `${t}\n←` },
};


type Tuple4<T> = readonly [T, T, T, T];
const _BASE_T4: Tuple4<null> = [null, null, null, null];
/**
 * 長さ 4 のタプルを生成する関数
 * @param fn インデックスから要素を生成する関数
 */
function createTuple4<T>(fn: (index: number) => T): Tuple4<T>;
/**
 * 長さ 4 のタプルを生成する関数
 * @param obj タプルに格納するオブジェクト(※コピーはされない)
 */
function createTuple4<T>(obj: T): Tuple4<T>;
function createTuple4<T>(fn: ((index: number) => T) | T): Tuple4<T> {
    if (fn instanceof Function) {
        return _BASE_T4.map((_, i) => fn(i));
    }
    return [fn, fn, fn, fn];
}


type DialCell = { td: HTMLTableCellElement, div: HTMLDivElement };
type DialLine = Tuple4<DialCell>;
/** 入力ダイヤルに表示する DOM のセット */
type DialTableData = Tuple4<DialLine>;
const D_SIZE = 4;

/**
 * `index` 番目の HTML 要素を探すか、無ければ追加する関数
 * @param parent 親となる要素
 * @param tagName HTMLタグ名
 * @param index
 * @param clsName ※クラス名は検索条件ではない
 * @returns 発見／追加した要素
 */
function getOrCreateElement<K extends keyof HTMLElementTagNameMap>(
    parent: HTMLElement, tagName: K, index: number = 0, clsName?: string | string[]
): HTMLElementTagNameMap[K] {
    const collection = parent.getElementsByTagName(tagName);
    let newElem = collection[index];
    while (collection.length <= index) {
        newElem = document.createElement(tagName);
        parent.append(newElem);
    }
    if (clsName) {
        if (typeof clsName === 'string') { newElem.classList.add(clsName); }
        else { newElem.classList.add(...clsName); }
    }
    return newElem;
}


function slashSwitchCell(cell: DialCell, slash: boolean, on: boolean) {
    const clsList = cell.td.classList;
    const token = slash ? ClsToken.SLSH : ClsToken.BSLSH;
    if (on) { clsList.add(token); }
    else { clsList.remove(token); }
}
function qToV(q: number): { x: 0 | 1, y: 0 | 1 } {
    const x = q & 2 ? 0 : 1;
    return { x: x, y: (q & 1) ^ x ? 0 : 1 };
}


class DialTable {
    readonly data: DialTableData;

    /**
     * @param planeTable 予め用意した `<table>` の `HTMLElement`
     */
    constructor(planeTable: HTMLTableElement) {
        const tbody = getOrCreateElement(planeTable, "tbody");
        const trList = createTuple4(i => getOrCreateElement(tbody, "tr", i));
        this.data = trList.map((tr, i) => createTuple4(j => {
            const e = getOrCreateElement(tr, "td", j);
            if (i == D_SIZE / 2) { e.classList.add("b-top"); }
            if (j == D_SIZE / 2) { e.classList.add("b-left"); }
            return { td: e, div: getOrCreateElement(e, "div", 0, "content") };
        }));
        this.slashOn();
        this.resetText();
    }

    public resetText() {
        for (const row of this.data) {
            for (const cell of row) {
                cell.div.innerText = "";
                cell.td.classList.remove(ClsToken.ING);
            }
        }
    }
    public slashSwitch(on: boolean, part?: Quadrant) {
        if (part === undefined) {
            const d = D_SIZE - 1;
            for (let i = 0; i < D_SIZE; i++) {
                slashSwitchCell(this.data[i][i], false, on);
                slashSwitchCell(this.data[i][d - i], true, on);
            }
        } else {
            let v: Vector2 = qToV(part);
            v = { x: v.x * 2, y: v.y * 2 };
            if (part & 1) {
                slashSwitchCell(this.data[v.y][v.x], false, on);
                slashSwitchCell(this.data[v.y + 1][v.x + 1], false, on);
            } else {
                slashSwitchCell(this.data[v.y + 1][v.x], true, on);
                slashSwitchCell(this.data[v.y][v.x + 1], true, on);
            }
        }
    }
    public slashOn(part?: Quadrant) { this.slashSwitch(true, part); }
    public slashOff(part?: Quadrant) { this.slashSwitch(false, part); }
    public getCell(q: Quadrant, side: Rotaion | null): DialCell {
        const p1 = qToV(q);
        const p2 = qToV(rotQ(q, side));
        return this.data[p1.y * 2 + p2.y][p1.x * 2 + p2.x];
    }
    public displayMessage(pos: Quadrant, side: Rotaion | null, mes?: string, lightUp?: boolean) {
        const target = this.getCell(pos, side);
        if (!mes) {
            mes = "";
        } else {
            target.td.classList.remove(ClsToken.SLSH, ClsToken.BSLSH);
        }
        target.div.innerText = mes;
        if (mes.length > 1) {
            target.div.classList.add(ClsToken.MINI);
        } else {
            target.div.classList.remove(ClsToken.MINI);
        }
        if (lightUp) { target.td.classList.add(ClsToken.ING); }
    }
    public displaySuggest(pos: Quadrant, side: Rotaion, sugg: AcceptableState, lightUp?: boolean) {
        return this.displayMessage(pos, side, Allow[pos][side](sugg.accepted), lightUp);
    }

    public displayByState(state: State | null, mot: Motion | null): string {
        this.resetText();
        this.slashOn();
        if (state === null) { return ""; }
        if (state instanceof WaitingState || mot === null) {
            // デフォルト表示
            for (const q of QList) {
                const state = StartState.FIRST_STEPS[q];
                const gyoes: [Rotaion, FollowingState | null][] = [
                    [ROTATION.Clock, state.clockRot],
                    [ROTATION.Counter, state.counterRot]
                ];
                for (const [r, s] of gyoes) {
                    if (s === null) { continue; }
                    let mes = "";
                    if (s.normalRot instanceof AcceptableState) { mes += s.normalRot.accepted; }
                    if (s.reverseRot instanceof AcceptableState) { mes += s.reverseRot.accepted; }
                    this.displayMessage(q, r, mes);
                }
            }
        } else if (state instanceof TouchedState) {
            // タップ直後
            const gyoes: [Rotaion, FollowingState | null][] = [
                [ROTATION.Clock, state.clockRot],
                [ROTATION.Counter, state.counterRot]
            ];
            for (const [r, s] of gyoes) {
                const q = rotQ(mot.lastPos, r);
                if (s === null) { continue; }
                if (s.normalRot instanceof AcceptableState) {
                    this.displaySuggest(q, r, s.normalRot);
                }
                if (s.reverseRot instanceof AcceptableState) {
                    const rr = rev(r);
                    this.displaySuggest(q, rr, s.reverseRot);
                }
            }
        } else if (state instanceof FollowingState) {
            // 入力中
            const p = mot.lastPos
            for (const r of [ROTATION.Clock, ROTATION.Counter]) {
                const q = rotQ(p, r);
                const s = mot.rot === r
                    ? state.normalRot
                    : state.reverseRot;
                if (s === null) { continue; }
                if (s instanceof AcceptableState) {
                    this.displaySuggest(p, r, s);
                }
                if (s.normalRot instanceof AcceptableState) {
                    this.displaySuggest(q, r, s.normalRot);
                }
                if (s.reverseRot instanceof AcceptableState) {
                    const rr = rev(r);
                    this.displaySuggest(q, rr, s.reverseRot);
                }
            }
            if (state instanceof AcceptableState) {
                this.displayMessage(p, null, state.accepted, true);
                return state.accepted;
            }
        } else {
            assertUnreachable(state);
        }
        return "";
    }
}

