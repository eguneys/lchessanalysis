import { Board } from './board'
import { MobileRay } from './rays'
import { obj_map } from './util'


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
    let d_mobile = d_or([
      this.rays.mobile_ray(o),
      this.rays.mobile_pawn(o),
      this.rays.capture_ray(o),
      this.rays.capture_pawn(o)
    ].filter(Boolean))

    return obj_map(d_mobile, (d, mobile) => {
      let [board] = mobile
      mobile[0] = this.opposite(board)
      return mobile
    })
  }

  opposite(board: Board) {
    let opposite = this.turn === 'w' ? 'b' : 'w'
    return new MobileSituation(opposite, board)
  }

  constructor(readonly turn: Color, readonly board: Board) {
    this.rays = new MobileRay(board)
  }
}
