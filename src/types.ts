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


export const piece_fen = (piece: Piece) => piece[0] === 'w' ? piece[1].toUpperCase() : piece[1]


export const right = { 'a': 'b', 'b': 'c', 'c': 'd', 'd': 'e', 'e': 'f', 'f': 'g', 'g': 'h'}
export const left = { 'h': 'g', 'g': 'f', 'f': 'e', 'e': 'd', 'd': 'c', 'c': 'b', 'b': 'a'}

export const up = { '1': '2', '2': '3', '3': '4', '4': '5', '5': '6', '6': '7', '7': '8'}
export const down = { '8': '7', '7': '6', '6': '5', '5': '4', '4': '3', '3': '2', '2': '1'}

export function make_righter<A>(files: Array<A>, right: any) {
  let res = {}

  files.forEach(file => {

    let _res = {}

    let i = file
    let acc = []
    while ((i = right[i])) {
      _res[i] = acc.slice(0)
      acc.push(i)
    }

    res[file] = _res
  })
  return res
}

export const righter = make_righter(files, right)
export const lefter = make_righter(files, left)
export const upper = make_righter(ranks, up)
export const downer = make_righter(ranks, down)

export function make_king_side(righter: any) {
  let res = {}

  poss.forEach(pos => {
    let [file, rank] = pos.split('')

    let _res = {}

    let _righter = righter[file]

    Object.keys(_righter).map(_right => {
      let n = _righter[_right].map(f => f + rank)
      _res[_right+rank] = n
    })

    res[pos] = _res
  })

  return res
}

export const king_side = make_king_side(righter)
export const queen_side = make_king_side(lefter)



export function make_forward(upper: any) {
  let res = {}

  poss.forEach(pos => {
    let [file, rank] = pos.split('')

    let _res = {}

    let _upper = upper[rank]

    Object.keys(_upper).map(_up => {
      let n = _upper[_up].map(r => file + r)
      _res[file+_up] = n
    })

    res[pos] = _res
  })

  return res
}


export const forward = make_forward(upper)
export const backward = make_forward(downer)

function zip_pos<A, B>(a: Array<A>, b: Array<B>) {
  return a.map((_a, i) => _a + b[i])
}
export function make_fwd_que() {
  let res = {}

  poss.forEach(pos => {
    let _upper = upper[pos]
    let _lefter = lefter[pos]

    res[pos] = zip_pos(_upper, _lefter)
  })

  return res
}
