import { Board } from './board';
import { MobileRay } from './rays';
import { arr_map, obj_map } from './util';
export function d_or(d_ors) {
    let res = {};
    d_ors.forEach(d_or => Object.keys(d_or).forEach(key => {
        res[key] = d_or[key];
    }));
    return res;
}
export class MobileSituation {
    constructor(turn, _board, _castles) {
        this.turn = turn;
        this._board = _board;
        this._castles = _castles;
        this.rays = new MobileRay(_board, _castles);
    }
    mobile_situation(o) {
        let on_p = this.board.on(o);
        if (!on_p) {
            return undefined;
        }
        let [color, role] = on_p;
        if (color !== this.turn) {
            return undefined;
        }
        let d_mobile = d_or([
            this.rays.mobile_ray(o),
            this.rays.mobile_pawn(o),
            this.rays.capture_ray(o),
            this.rays.capture_pawn(o),
            this.rays.castle(o)
        ].filter(Boolean));
        if (Object.keys(d_mobile).length > 0) {
            return obj_map(d_mobile, (d, mobile) => {
                let [board] = mobile;
                mobile[0] = this.opposite(board);
                return mobile;
            });
        }
    }
    opposite(board) {
        let opposite = this.turn === 'w' ? 'b' : 'w';
        return new MobileSituation(opposite, board, this._castles);
    }
    same(board) {
        return new MobileSituation(this.turn, board, this._castles);
    }
    with_board(fn) {
        return this.same(fn(this.board));
    }
    get allowed_mobiles() {
        if (!this._c_mobiles) {
            this._c_mobiles = arr_map(this.board.poss, o => this.mobile_situation(o));
        }
        return this._c_mobiles;
    }
    get ods() {
        return Object.keys(this.allowed_mobiles)
            .flatMap(o => Object.keys(this.allowed_mobiles[o]).map(d => o + d));
    }
    od(od) {
        let [o, d] = [od.slice(0, 2), od.slice(2)];
        return this.allowed_mobiles[o][d];
    }
    o_ds(o) {
        return this.ods.filter(od => od.slice(0, 2) === o);
    }
    get board() {
        return this._board.clone;
    }
    get fen() {
        return [this._board.fen, this.turn, this._castles].join(' ');
    }
}
MobileSituation.from_fen = (fen) => {
    let [pieses, turn, castles] = fen.split(' ');
    let board = Board.from_fen(pieses);
    return new MobileSituation(turn, board, castles);
};
