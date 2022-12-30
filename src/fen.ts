import { Color } from './types'
export type DuckBoardFen = string
export type BoardFen = string
export type CastlesFen = string

export type Fen = `${BoardFen} ${Color} ${CastlesFen}`
export type DuckFen = `${DuckBoardFen} ${Color} ${CastlesFen}`

export function fen_split(fen: Fen): [BoardFen, Color, CastlesFen] {
  return fen.split(' ') as [BoardFen, Color, CastlesFen]
}

export const initial_fen: Fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq' as Fen
export const empty_fen: Fen = '8/8/8/8/8/8/8/8 w - - 0 1' as Fen
