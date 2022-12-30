import { DuckBoardFen } from './fen'
import { Role, Color, Side, Rank, File } from './types'
import { Pieses, Piese, Piece, Pos } from './types'
import { poss_high_first } from './types'
import { piese_split, piece_fen } from './types'
import { files, ranks, roles } from './types'

export const files_from_side: Record<Side, Array<File>> = {
  'k': files.slice(0).reverse(),
  'q': files.slice(0),
}

export class DuckBoard {

  //static get empty() { return new Board(new Map()) }

  static from_fen = (fen: DuckBoardFen) => {
    let duck: Pos
    let res: Array<[Pos, Piece]> = fen.split('/').flatMap((rank, i_rank) => {
      let res: Array<[Pos, Piece]> = []
      let i_file = 0
      rank.split('').forEach(char => {
        if (char === 'd') {
          let pos: Pos = `${files[i_file]}${ranks[7-i_rank]}`
          duck = pos
          i_file++;
          return
        }
        let i_role = roles.indexOf(char.toLowerCase() as any)
        if (i_role > -1) {
          let role: Role = roles[i_role]
          let color: Color = char.toLowerCase() === char ? 'b' : 'w'
          let piece: Piece = `${color}${role}`
          let pos: Pos = `${files[i_file]}${ranks[7-i_rank]}`
          res.push([pos, piece])
          i_file++
        } else {
          i_file+= parseInt(char) 
        }
      })
      return res
    })

    return new DuckBoard(new Map(res), duck!)
  }

  /*
  static from_pieses = (_pieses: Pieses) => {
    return new Board(new Map(_pieses.map(_ => {
      let [piece, pos] = piese_split(_)

      return [pos, piece]
    })))
  }
 */

  get fen() {
    return poss_high_first
    .reduce(([out, rank, file, spaces], pos: Pos) => {

      let piece = this._pieses.get(pos)
      if (!piece) {
        if (this.duck === pos) {
          out += (spaces || '') + 'd'
          spaces = undefined
        } else {
          spaces = (spaces || 0) + 1
        }
      } else {
        out += (spaces || '') + piece_fen(piece)
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

      return [out, rank, file, spaces] as [string, number, number, number | undefined]
    }, ['', 8, 1, undefined] as [string, number, number, number | undefined])[0]

  }

  get pieses() {
    return [...this._pieses].map(_ => `${_[1]}@${_[0]}`)
  }

  in(_: Piese) {
    let [piece, pos] = piese_split(_)
    return this.in_piece(piece, pos)
  }

  in_piece(_: Piece, pos: Pos) {
    this._pieses.set(pos, _)
    return this
  }

  out(_: Pos) {
    this._pieses.delete(_)
    return this
  }

  on(pos: Pos) {
    return this._pieses.get(pos)
  }

  on_duck(pos: Pos) {
    return this._duck === pos
  }

  get duck() {
    return this._duck
  }

  set duck(pos: Pos) {
    this._duck = pos
  }

  rook_file_at_side(rank: Rank, side: Side) {
    return files_from_side[side].find(file => {
      let pos: Pos = `${file}${rank}`
      if (this._pieses.get(pos)?.[1] === 'r') {
        return true
      }
    })
  }

  get poss() {
    return [...this._pieses.keys()]
  }

  get clone() {
    return new DuckBoard(new Map(this._pieses), this.duck)
  }

  _duck: Pos
  constructor(readonly _pieses: Map<Pos, Piece>, duck: Pos) { this._duck = duck }
}
