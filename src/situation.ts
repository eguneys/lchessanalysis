import { Board } from './board'
import { MobileRay } from './rays'
import { arr_map, obj_map, obj2_arr } from './util'


export function d_or(d_ors: Array<any>) {
  let res = {}

  d_ors.forEach(d_or => Object.keys(d_or).forEach(key => {
    res[key] = d_or[key]
  }))

  return res
}


export class MobileSituation {

  static from_fen = (fen: string) => {
    let [pieses, turn] = fen.split(' ')

    let board = Board.from_fen(pieses)
    return new MobileSituation(turn, board)
  }

  mobile_situation(o: O) {

    let on_p = this.board.on(o)
    if (!on_p) {
      return undefined
    }

    let [color, role] = on_p
    if (color !== this.turn) {
      return undefined
    }

    let d_mobile = d_or([
      this.rays.mobile_ray(o),
      this.rays.mobile_pawn(o),
      this.rays.capture_ray(o),
      this.rays.capture_pawn(o),
      this.rays.castle(o, 'k'),
      this.rays.castle(o, 'q')
    ].filter(Boolean))



    if (Object.keys(d_mobile).length > 0) {
      return obj_map(d_mobile, (d, mobile) => {
        let [board] = mobile
        mobile[0] = this.opposite(board)
        return mobile
      })
    }
  }

  opposite(board: Board) {
    let opposite = this.turn === 'w' ? 'b' : 'w'
    return new MobileSituation(opposite, board)
  }

  same(board: Board) {
    return new MobileSituation(this.turn, board)
  }

  with_board(fn: (_: Board) => void) {
    return this.same(fn(this.board))
  }

  get allowed_mobiles() {
    if (!this._c_mobiles) {
      this._c_mobiles = arr_map(this.board.poss, o => this.mobile_situation(o))
    }
    return this._c_mobiles
  }

  get ods() {
    return Object.keys(this.allowed_mobiles)
    .flatMap(o => Object.keys(this.allowed_mobiles[o]).map(d => o + d))
  }

  od(od: OD) {
    let [o, d] = [od.slice(0, 2), od.slice(2)]
    return this.allowed_mobiles[o][d]
  }

  o_ds(o: Pos) {
    return this.ods.filter(od => od.slice(0, 2) === o)
  }

  get board() {
    return this._board.clone
  }

  constructor(readonly turn: Color, readonly _board: Board) {
    this.rays = new MobileRay(_board)
  }
}
