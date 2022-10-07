import { poss_high_first } from './types';
import { piece_fen } from './types';
import { files, ranks, roles } from './types';
export const files_from_side = {
    'q': files,
    'k': files.slice(0).reverse()
};
export class Board {
    constructor(_pieses) {
        this._pieses = _pieses;
    }
    static get empty() { return new Board(new Map()); }
    get fen() {
        return poss_high_first.reduce(([out, rank, file, spaces], pos) => {
            let piese = this._pieses.get(pos);
            if (!piese) {
                spaces = (spaces || 0) + 1;
            }
            else {
                out += (spaces || '') + piece_fen(piese.split('@')[0]);
                spaces = undefined;
            }
            if (file === 8) {
                rank--;
                file = 1;
                out += (spaces || '') + (rank > 0 ? '/' : '');
                spaces = undefined;
            }
            else {
                file++;
            }
            return [out, rank, file, spaces];
        }, ['', 8, 1])[0];
    }
    get pieses() {
        return [...this._pieses].map(_ => _.reverse().join('@'));
    }
    in(_) {
        let [piece, pos] = _.split('@');
        return this.in_piece(piece, pos);
    }
    in_piece(_, pos) {
        this._pieses.set(pos, _);
        return this;
    }
    out(_) {
        this._pieses.delete(_);
        return this;
    }
    on(pos) {
        return this._pieses.get(pos);
    }
    rook_file_at_side(rank, side) {
        return files_from_side[side].find(file => {
            let pos = file + rank;
            if (this._pieses.get(pos)?.[1] === 'r') {
                return true;
            }
        });
    }
    get poss() {
        return [...this._pieses.keys()];
    }
    get clone() {
        return new Board(new Map(this._pieses));
    }
}
Board.from_fen = (fen) => {
    let res = fen.split('/').flatMap((rank, i_rank) => {
        let res = [];
        let i_file = 0;
        rank.split('').forEach(char => {
            let i_role = roles.indexOf(char.toLowerCase());
            if (i_role > -1) {
                let role = roles[i_role];
                let color = char.toLowerCase() === char ? 'b' : 'w';
                let piece = color + role;
                let pos = files[i_file] + ranks[7 - i_rank];
                res.push([pos, piece]);
                i_file++;
            }
            else {
                i_file += parseInt(char);
            }
        });
        return res;
    });
    return new Board(new Map(res));
};
Board.from_pieses = (_pieses) => {
    return new Board(new Map(_pieses.map(_ => {
        let [piece, pos] = _.split('@');
        return [pos, piece];
    })));
};
