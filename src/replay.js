import { MobileSituation } from './situation';
import { poss, files, promotables } from './types';
import { arr_map } from './util';
function data_flat(data) {
    return `{${[data.uci, data.comment].join(' ')}}`;
}
function node_arr(path, moves) {
    if (!moves) {
        return [];
    }
    else {
        return Object.keys(moves).flatMap(move => {
            if (move === 'data') {
                return [path, data_flat(moves[move])].join('___');
            }
            let _path = path + move;
            return node_arr(_path, moves[move]);
        });
    }
}
function find_path(node, path) {
    if (path === '') {
        return node;
    }
    let [head, rest] = [path.slice(0, 2), path.slice(2)];
    return find_path(node[head], rest);
}
function follow_path(node, path, acc) {
    if (path === '') {
        return [...acc, node];
    }
    let [head, rest] = [path.slice(0, 2), path.slice(2)];
    return follow_path(node[head], rest, [...acc, node]);
}
export class Replay {
    constructor(situation, _moves) {
        this.situation = situation;
        this._moves = _moves;
    }
    follow_path(path) {
        return follow_path(this._moves, path, []);
    }
    path(path) {
        return find_path(this._moves, path);
    }
    remove(path) {
        let [_path, move] = [path.slice(0, -2), path.slice(-2)];
        let node = find_path(this._moves, path);
        delete node[uci_char(move)];
    }
    move(path, move, data = {}) {
        var _a;
        let node = find_path(this._moves, path);
        node[_a = uci_char(move)] || (node[_a] = {});
        node[uci_char(move)].data = {
            uci: move,
            ...data
        };
    }
    data(path, data) {
        let node = find_path(this._moves, path);
        if (data) {
            node.data = data;
        }
        return node.data;
    }
    play_ucis(ucis) {
        ucis.split(' ').reduce((root, uci) => {
            let _ = uci_char(uci);
            this.move(root, uci);
            return root + _;
        }, '');
    }
    get replay() {
        return [this.situation.fen, node_arr('', this._moves).join('\n')].join('\n\n');
    }
    get moves() {
    }
}
Replay.from_fen = (fen) => {
    return new Replay(MobileSituation.from_fen(fen), {});
};
const charShift = 35;
const voidChar = String.fromCharCode(33); // '!', skip 34 \"
const pos_hash = (pos) => poss.indexOf(pos) + 1;
const pos2charMap = arr_map(poss, pos => String.fromCharCode(pos_hash(pos) + charShift));
const pos_to2char = (pos) => pos2charMap[pos] || voidChar;
const promotion2charMap = (() => {
    let res = {};
    promotables.map((role, i) => {
        files.map((file, i_file) => {
            let key = role + file;
            let _res = String.fromCharCode(charShift + Object.keys(pos2charMap).length + i * 8 + i_file - 1);
            res[key] = _res;
        });
    });
    return res;
})();
const pos_to2char_p = (file, role) => promotion2charMap[role + file] || voidChar;
export const uci_char = (odp) => {
    let [od, p] = odp.split('=');
    let [o, d] = [od.slice(0, 2), od.slice(2)];
    if (p) {
        return pos_to2char(o) + pos_to2char_p(d[0], p);
    }
    else {
        return pos_to2char(o) + pos_to2char(d);
    }
};
