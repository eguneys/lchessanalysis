import { Color } from './types'
const __boardfen = Symbol('boardfen')
export type BoardFen = string & { [__boardfen]: true }
const __castlesfen = Symbol('castlesfen')
export type CastlesFen = string & { [__castlesfen]: true }

export type Fen = `${BoardFen} ${Color} ${CastlesFen}`

export function fen_split(fen: Fen): [BoardFen, Color, CastlesFen] {
  return fen.split(' ') as [BoardFen, Color, CastlesFen]
}

export const initial_fen: Fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq' as Fen
