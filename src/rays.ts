import { bishop, queen, rook, knight, king } from './types'
import { white_push, black_push } from './types'
import { Board } from './board'

export const obj_map = (obj: any, fn: any) => {
  let res = {}
  Object.keys(obj).forEach(key => {
    let _res = fn(key, obj[key])
    if (_res) {
      res[key] = _res
    }
  })
  return res
}

export type OD = string

export class MobileRay {


  capture_ray(o: O) {
    let on_p = this._board.on(o)
    if (on_p) {
      let [color, role] = on_p.split('')
      let d_is = ray_route[role][o]
      return obj_map(d_is, (d, is) => {
        if (is) {
          let block = is.find(_ => this._board.on(_))

          if (!block) {
            return this.capture(o, d)
          }
        }
      })
    }
  }




  mobile_pawn(o: O) {
    let on_p = this._board.on(o)
    if (on_p) {
      let [piece, pos] = on_p.split('@')
      let [color, role] = piece.split('')

      if (role === 'p') {

        let d_is = pawn_push[color][o]

        return obj_map(d_is, (d, is) => {
          if (is) {
            let block = is.find(_ => this._board.on(_))

            if (!block) {
              return this.mobile(o, d)
            }
          }
        })
      }
    }
  }


  mobile_ray(o: Pos) {
    let on_piece = this._board.on(o)
    if (on_piece) {
      let [color, role] = on_piece.split('')
      let d_is = ray_route[role][o]
      return obj_map(d_is, (d, is) => {
        let block = is.find(_ => this.board.on(_))

        if (!block) {
          return this.mobile(o, d)
        }
      })
    }
  }

  capture(o: Pos, d: Pos) {
    let { board } = this
    let on_o = board.on(o),
      on_d = board.on(d)

    if (o !== d && !!on_o && !!on_d) {
      let [on_d_piece] = on_d.split('@')
      let [on_d_color] = on_d_piece.split('')
      let [on_o_piece] = on_o.split('@')
      let [on_o_color] = on_o_piece.split('')

      if (on_o_color !== on_d_color) {
        board.out(o)
        board.out(d)
        board.in_piece(on_o, d)

        return [on_o, on_d, board]
      }
    }
  }

  mobile(o: Pos, d: Pos) {
    let { board } = this
    let on_o = board.on(o),
      on_d = board.on(d)

    if (o !== d && !!on_o && !on_d) {
      board.out(o)
      board.in_piece(on_o, d)
      return [on_o, board]
    }
  }

  get board() {
    return this._board.clone
  }

  constructor(readonly _board: Board) {}
}

export const ray_route = {
  b: bishop,
  q: queen,
  r: rook,
  n: knight,
  k: king
}

export const pawn_push = {
  w: white_push,
  b: black_push
}
