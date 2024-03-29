import { Fen, fen_split } from './fen'
import { Board } from './board'
import { IsoRay } from './iso_rays'
import { od_split, OD, Color, Pos } from './types'
import { a_map, g_map, GMap } from './util'
import { Castles } from './castles'

const opposite: Record<Color, Color> = {
  w: 'b',
  b: 'w'
}

function d_or<A>(d_ors: Array<GMap<Pos, A> | undefined>): GMap<Pos, A> {
  let res: any = {}

  d_ors.forEach(d_or => d_or && (Object.keys(d_or) as Array<Pos>).forEach(key => {
    res[key] = d_or[key]
  }))

  return res
}

export class IsoSituation {

  static from_fen = (fen: Fen) => {
    let [board_fen, turn, castles_fen] = fen_split(fen)

    let board = Board.from_fen(board_fen)
    let castles = Castles.from_fen(castles_fen)
    return new IsoSituation(turn as Color, board, castles)
  }

  mobile_situation(o: Pos): GMap<Pos, [IsoSituation] | undefined> | undefined {

    let on_p = this.board.on(o)
    if (!on_p) {
      return undefined
    }

    let [color, role] = on_p
    /*
    if (color !== this.turn) {
      return undefined
    }
   */

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
          return [this.opposite(board)]
        }
      })
    }
  }

  opposite(board: Board) {
    return new IsoSituation(opposite[this.turn], board, this._castles)
  }

  same(board: Board) {
    return new IsoSituation(this.turn, board, this._castles)
  }

  with_board(fn: (_: Board) => Board) {
    return this.same(fn(this.board))
  }

  get allowed_mobiles(): GMap<Pos, GMap<Pos, [IsoSituation] | undefined>> {
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


  get fen() {
    return [this._board.fen, this.turn, this._castles].join(' ')
  }

  rays: IsoRay

  constructor(readonly turn: Color, readonly _board: Board, readonly _castles: Castles) {
    this.rays = new IsoRay(_board, _castles)
  }
}
