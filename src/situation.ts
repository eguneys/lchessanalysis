import { Board } from './board'
import { MobileRay, OD } from './rays'
import { Castles, Color, Pos } from './types'
import { a_map, g_map, GMap } from './util'

export const opposite: Record<Color, Color> = {
  w: 'b',
  b: 'w'
}

export function d_or<A>(d_ors: Array<GMap<Pos, A>>): GMap<Pos, A> {
  let res: any = {}

  d_ors.forEach(d_or => Object.keys(d_or).forEach(key => {
    res[key] = d_or[key]
  }))

  return res
}

export class MobileSituation {

  static from_fen = (fen: string) => {
    let [pieses, turn, castles] = fen.split(' ')

    let board = Board.from_fen(pieses)
    return new MobileSituation(turn as Color, board, castles)
  }

  mobile_situation(o: Pos) {

    let on_p = this.board.on(o)
    if (!on_p) {
      return undefined
    }

    let [color, role] = on_p
    if (color !== this.turn) {
      return undefined
    }

    let d_mobile = d_or([
      this.rays.mobile_ray(o) || {},
      this.rays.mobile_pawn(o) || {},
      this.rays.capture_ray(o) || {},
      this.rays.capture_pawn(o) || {},
      this.rays.castle(o) || {}
    ].filter(Boolean))



    if (Object.keys(d_mobile).length > 0) {
      return g_map(d_mobile, (d, mobile) => {
        let [board] = mobile
        return [this.opposite(board)]
      })
    }
  }

  opposite(board: Board) {
    return new MobileSituation(opposite[this.turn], board, this._castles)
  }

  same(board: Board) {
    return new MobileSituation(this.turn, board, this._castles)
  }

  with_board(fn: (_: Board) => Board) {
    return this.same(fn(this.board))
  }

  get allowed_mobiles() {
    return a_map(this.board.poss, o => this.mobile_situation(o))
  }

  get ods() {
    return Object.keys(this.allowed_mobiles)
    .flatMap(o => Object.keys(this.allowed_mobiles[o]).map(d => o + d))
  }

  od(od: OD) {
    let [o, d] = [od.slice(0, 2), od.slice(2)]
    return this.allowed_mobiles[o]?.[d]
  }

  o_ds(o: Pos) {
    return this.ods.filter(od => od.slice(0, 2) === o)
  }

  get board() {
    return this._board.clone
  }


  get fen() {
    return [this._board.fen, this.turn, this._castles].join(' ')
  }

  rays: MobileRay

  constructor(readonly turn: Color, readonly _board: Board, readonly _castles: Castles) {
    this.rays = new MobileRay(_board, _castles)
  }
}
