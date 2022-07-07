export const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
export const ranks = ['1', '2', '3', '4', '5', '6', '7', '8']

export const colors = ['w', 'b']
export const roles = ['r', 'q', 'b', 'n', 'p', 'k']

export const poss = files.flatMap(file => ranks.map(rank => file + rank))

export const ranks_high = ranks.slice(0).reverse()
export const poss_sorted = ranks.flatMap(rank => files.map(file => file + rank))
export const poss_high_first = ranks_high.flatMap(rank  => files.map(file => file + rank))

export type File = string
export type Rank = string
export type Pos = string
export type Color = string
export type Role = string
export type Piece = string
export type Piese = string

export type Pieses = Array<Piese>


export const piece_fen = (piece: Piece) => piece[0] === 'w' ? piece[1].upperCase() : piece[1]
