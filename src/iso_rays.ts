import { bishop, queen, rook, knight, king } from './types'
import { white_push, black_push, white_capture, black_capture } from './types'
import { Board } from './board'
import { arr_map2, arr_map, obj_map } from './util'


import { ray_route, pawn_push, pawn_capture, turn_base, castled_king_rook_file }  from './rays'


export type OD = string

export class IsoRay {

  capture_ray(o: O) {
    let on_p = this._board.on(o)
    if (on_p) {
      let [color, role] = on_p.split('')
      let d_is = ray_route[role]?.[o]
      if (d_is) {
        if (Array.isArray(d_is)) {
          return arr_map(d_is, d => this.capture(o, d))
        }
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
  }



  capture_pawn(o: O) {
    let on_p = this._board.on(o)
    if (on_p) {
      let [piece, pos] = on_p.split('@')
      let [color, role] = piece.split('')

      if (role === 'p') {

        let d_is = pawn_capture[color][o]

        return obj_map(d_is, (d, is) => {
          return this.capture(o, d)
        })
      }
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
      let d_is = ray_route[role]?.[o]
      if (d_is) {
        if (Array.isArray(d_is)) {
          return arr_map(d_is, d => this.mobile(o, d))
        }
        return obj_map(d_is, (d, is) => {
          let block = is.find(_ => this.board.on(_))

          if (!block) {
            return this.mobile(o, d)
          }
        })
      }
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

      board.out(o)
      board.out(d)
      board.in_piece(on_o, d)

      return [board, on_o, on_d]
    }
  }

  mobile(o: Pos, d: Pos) {

    let { board } = this

    let on_o = board.on(o),
      on_d = board.on(d)

    if (o !== d && !!on_o && !on_d) {
      board.out(o)
      board.in_piece(on_o, d)

      return [board, on_o]
    }
  }


  castle(o: Pos) {
    return arr_map2(['k', 'q'], side => {
      let on_piece = this._board.on(o)
      if (on_piece) {
        let [color, role] = on_piece.split('')
        if (role === 'k') {
          let castles_sign = color === 'w' ? side.toUpperCase() : side

          if (!this.castles[castles_sign]) {
            return undefined
          }


          let [kdf, rdf] = castled_king_rook_file[side]
          let rof = this._board.rook_file_at_side(color, side)
          let base = turn_base[color]
          let d = kdf + base
          let ko = o
          let ro = (rof + base)
          let kd = d
          let rd = (rdf + base)


          let { board } = this

          board.out(ko)
          board.out(ro)
          board.in_piece(color+'k', kd)
          board.in_piece(color+'r', rd)
          return [kd, [board, side]]
        }
      }
    })
  }

  get castles() {
    let res = {}

    let _ = this._castles.split('')

    _.forEach(_ => res[_] = true)

    return res
  }




  get board() {
    return this._board.clone
  }
  constructor(readonly _board: Board, readonly _castles: Castles) {}
}

