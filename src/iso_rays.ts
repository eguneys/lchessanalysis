import { Castles, castles } from './castles'
import { bishop, queen, rook, knight, king } from './types'
import { white_push, black_push, white_capture, black_capture } from './types'
import { Board } from './board'
import { GMap, g_map, a_map, a_map2 } from './util'
import { GasMap, AsuMap } from './types'
import { Role, Pos, Color, Side, File, Rank } from './types'
import { sides, pos_split, piece_split, piese_split } from './types'

type OD = string

export class IsoRay {


  capture_ray(o: Pos) {
    let on_p = this._board.on(o)
    if (on_p) {
      let [color, role] = piece_split(on_p)
      if (isRayRole(role)) {
        let d_is = ray_route[role][o]
        if (d_is) {
          return g_map(d_is, (d, is) => {
            if (is) {
              let block = is.find(_ => this._board.on(_))

              if (!block) {
                return this.capture(o, d)
              }
            }
          })
        }
      } else if (role === 'n') {
        let d_is = night_route[role][o]
        if (d_is) {
          return a_map(d_is, d => this.capture(o, d))
        }
      }
    }
  }



  capture_pawn(o: Pos): GMap<Pos, [Board] | undefined> | undefined  {
    let on_p = this._board.on(o)
    if (on_p) {
      let [piece, pos, color, role] = piese_split(on_p)

      if (role === 'p') {

        let d_is = pawn_capture[color][o]

        if (d_is) {
          return g_map(d_is, (d, is) => {
            return this.capture(o, d)
          })
        }
      }
    }
  }



  mobile_pawn(o: Pos): GMap<Pos, [Board] | undefined> | undefined {
    let on_p = this._board.on(o)
    if (on_p) {
      let [piece, pos, color, role] = piese_split(on_p)

      if (role === 'p') {

        let d_is = pawn_push[color][o]
        if (d_is) {
          return g_map(d_is, (d, is) => {
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
  }


  mobile_ray(o: Pos): GMap<Pos, [Board] | undefined> | undefined {
    let on_piece = this._board.on(o)
    if (on_piece) {
      let [color, role] = piece_split(on_piece)

      if (isRayRole(role)) {
        let d_is = ray_route[role][o]
        if (d_is) {
          return g_map(d_is, (d, is) => {
            let block = is?.find(_ => this.board.on(_))

            if (!block) {
              return this.mobile(o, d)
            }
          })
        }
      } else if (role === 'n') {
        let d_is = night_route[role][o]
        if (d_is) {
          return a_map(d_is, d => this.mobile(o, d))
        }
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

      //if (on_o_color !== on_d_color) {
        board.out(o)
        board.out(d)
        board.in_piece(on_o, d)

        return [board, on_o, on_d] as any as [Board]
      //}
    }
  }

  mobile(o: Pos, d: Pos) {
    let { board } = this
    let on_o = board.on(o),
      on_d = board.on(d)

    if (o !== d && !!on_o && !on_d) {
      board.out(o)
      board.in_piece(on_o, d)
      return ([board, on_o] as any) as [Board]
    }
  }

  castle(o: Pos): GMap<Pos, [Board]> | undefined {
    return a_map2(sides, (side: Side) => {
      let on_piece = this._board.on(o)
      if (on_piece) {
        let [color, role] = piece_split(on_piece)
        if (role === 'k') {
          let castles_sign = castles_sign_by[side][color]

          if (!this.castles.get(castles_sign)) {
            return undefined
          }

          let base = turn_base[color]

          let [ofile, orank] = pos_split(o)
          let [kdf, rdf] = castled_king_rook_file[side]
          let rof = this._board.rook_file_at_side(base, side)
          if (!rof) {
            return undefined
          }
          let d: Pos = `${kdf}${base}`
          let ko = o
          let ro: Pos = `${rof}${base}`
          let kd = d
          let rd: Pos = `${rdf}${base}`


          let { board } = this

          board.out(ko)
          board.out(ro)
          board.in_piece(color+'k', kd)
          board.in_piece(color+'r', rd)
          return [kd, ([board, side] as any as [Board])]
        }
      }
    })
  }

  get board() {
    return this._board.clone
  }

  constructor(readonly _board: Board, readonly castles: Castles) {}
}

const isRayRole = (_: Role): _ is RayRole => {
  return ray_roles.includes(_ as RayRole)
}

const ray_roles = ['r', 'q', 'b', 'k'] as const
type RayRole = typeof ray_roles[number]

type NightRole = 'n'

const ray_route: Record<RayRole, GasMap> = {
  b: bishop,
  q: queen,
  r: rook,
  k: king
}

const night_route: Record<NightRole, AsuMap> = {
  n: knight
}

const pawn_push = {
  w: white_push,
  b: black_push
}

const pawn_capture = {
  w: white_capture,
  b: black_capture
}

const turn_base: Record<Color, Rank> = {
  w: '1',
  b: '8'
}

const castled_king_rook_file: Record<Side, [File, File]> = {
  'k': ['g', 'f'],
  'q': ['c', 'd']
}


const castles_sign_by: Record<Side, Record<Color, typeof castles[number]>> = {
  'k': { 'w': 'K', 'b': 'k' },
  'q': { 'w': 'Q', 'b': 'q' }
}
