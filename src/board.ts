import { Pieses, Piese } from './types'
import { poss_high_first } from './types'
import { piece_fen } from './types'
import { files, ranks, roles } from './types'

export class Board {

  static from_fen = (fen: string) => {
    let res = fen.split('/').flatMap((rank, i_rank) => {
      let res = []
      let i_file = 0
      rank.split('').forEach(char => {
        let i_role = roles.indexOf(char.toLowerCase())
        if (i_role > -1) {
          let role = roles[i_role]
          let color = char.toLowerCase() === char ? 'b' : 'w'
          let piece = color + role
          let pos = files[i_file] + ranks[7-i_rank]
          res.push([pos, piece])
          i_file++
        } else {
          i_file+= parseInt(char) 
        }
      })
      return res
    })

    return new Board(new Map(res))
  }

  static from_pieses = (_pieses: Pieses) => {
    return new Board(new Map(_pieses.map(_ => {
      let [piece, pos] = _.split('@')

      return [pos, piece]
    })))
  }

  get fen() {
    return poss_high_first.reduce(([out, rank, file, spaces], pos) => {

      let piese = this._pieses.get(pos)
      if (!piese) {
        spaces = (spaces || 0) + 1
      } else {
        out += (spaces || '') + piece_fen(piese.split('@')[0])
        spaces = undefined
      }

      if (file === 8) {
        rank--;
        file = 1
        out += (spaces || '') + (rank > 0 ? '/' : '')
        spaces = undefined
      } else {
        file++;
      }

      return [out, rank, file, spaces]
    }, ['', 8, 1])[0]

  }

  get pieses() {
    return [...this._pieses].map(_ => _.reverse().join('@'))
  }

  in(_: Piese) {
    let [piece, pos] = _.split('@')
    this._pieses.set(pos, piece)
  }

  out(_: Pos) {
    this._pieses.delete(_)
  }

  constructor(readonly _pieses: Map<Pos, Piece>) {}
}
