import { Pieses, Piese } from './types'


export class Board {

  static from_pieses = (_pieses: Pieses) => {
    return new Board(new Map(_pieses.map(_ => {
      let [piece, pos] = _.split('@')

      return [pos, piece]
    })))
  }

  get pieses() {
    return [...this._pieses].map(_ => _.reverse().join('@'))
  }

  in(_: Piese) {
    let [piece, pos] = _.split('@')
    this._pieses.set(pos, piece)
  }

  constructor(readonly _pieses: Map<Pos, Piece>) {}
}
