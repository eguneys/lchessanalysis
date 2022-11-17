import { UCI } from './replay'
import { Fen, fen_split } from './fen'
import { Castles } from './castles'
import { Board } from './board'
import { MobileRay } from './rays'
import { od_split, Color, Pos, OD } from './types'
import { a_map, g_map, GMap } from './util'

export const opposite: Record<Color, Color> = {
  w: 'b',
  b: 'w'
}

export function d_or<A>(d_ors: Array<GMap<Pos, A> | undefined>): GMap<Pos, A> {
  let res: any = {}

  d_ors.forEach(d_or => d_or && (Object.keys(d_or) as Array<Pos>).forEach(key => {
    if (d_or[key]) {
      res[key] = d_or[key]
    }
  }))

  return res
}

export class MobileSituation {

  static from_fen = (fen: Fen) => {
    let [board_fen, turn, castles_fen] = fen_split(fen)

    let board = Board.from_fen(board_fen)
    let castles = Castles.from_fen(castles_fen)
    return new MobileSituation(turn, board, castles)
  }

  mobile_situation(o: Pos): GMap<Pos, [MobileSituation] | undefined> | undefined {

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
      this.rays.castle(o)
    ].filter(Boolean))

    if (Object.keys(d_mobile).length > 0) {
      return g_map(d_mobile, (d, mobile) => {
        if (mobile) {
          let [board] = mobile
          return [this._opposite(board)]
        }
      })
    }
  }

  get opposite() {
    return opposite[this.turn]
  }

  _opposite(board: Board) {
    return new MobileSituation(opposite[this.turn], board, this._castles)
  }

  same(board: Board) {
    return new MobileSituation(this.turn, board, this._castles)
  }

  with_board(fn: (_: Board) => Board) {
    return this.same(fn(this.board))
  }

  get allowed_mobiles(): GMap<Pos, GMap<Pos, [MobileSituation] | undefined>> {
    return a_map(this.board.poss, o => this.mobile_situation(o))
  }

  get ods() {
    let { allowed_mobiles } = this

    return (Object.keys(allowed_mobiles) as Array<Pos>)
    .flatMap(o => (Object.keys(allowed_mobiles[o]) as Array<Pos>).filter(d => !!allowed_mobiles[o][d]).map(d => `${o}${d}`))
  }

  od(od: OD) {
    let [o, d] = od_split(od)
    return this.allowed_mobiles[o]?.[d]
  }

  o_ds(o: Pos) {
    return this.ods.filter(od => od.slice(0, 2) === o)
  }

  get board() {
    return this._board.clone
  }


  get fen(): Fen {
    return `${this._board.fen} ${this.turn} ${this._castles.fen}`
  }

  rays: MobileRay

  constructor(readonly turn: Color, readonly _board: Board, readonly _castles: Castles) {
    this.rays = new MobileRay(_board, _castles)
  }
}
