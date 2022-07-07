export const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
export const ranks = ['1', '2', '3', '4', '5', '6', '7', '8']

export const colors = ['w', 'b']
export const roles = ['r', 'q', 'b', 'n', 'p', 'k']

export const poss = files.map(file => ranks.map(rank => file + rank))


export type File = string
export type Rank = string
export type Pos = string
export type Color = string
export type Role = string
export type Piece = string
export type Piese = string

export type Pieses = Array<Piese>
