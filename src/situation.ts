import { Board } from './board'
import { MobileRay } from './rays'

export class MobileSituation {


  static from_fen = (fen: string) => {
    let [pieses, turn] = fen.split(' ')

    let board = Board.from_fen(pieses)
    return new MobileSituation(turn, board)
  }

  mobile_situation(od: OD) {
    let res = this.rays.mobile_ray(od) ||
      this.rays.mobile_pawn(od) ||
      this.rays.capture_ray(od) ||
      this.rays.capture_pawn(od)

    if (res) {
      this.turn = this.turn === 'w' ? 'b' : 'w'
      return res
    }
  }

  turn: Color

  constructor(turn: Color, readonly board: Board) {
    this.turn = turn
    this.rays = new MobileRay(board)
  }
}
