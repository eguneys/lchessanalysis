export const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
export const ranks = ['1', '2', '3', '4', '5', '6', '7', '8']

export const colors = ['w', 'b']
export const roles = ['r', 'q', 'b', 'n', 'p', 'k']

export const poss = files.flatMap(file => ranks.map(rank => file + rank))
export const pieces = colors.flatMap(color => roles.map(role => color + role))

export const pieses = pieces.flatMap(piece => poss.map(pos => [piece, pos].join('@')))

export const ranks_high = ranks.slice(0).reverse()
export const poss_sorted = ranks.flatMap(rank => files.map(file => file + rank))
export const poss_high_first = ranks_high.flatMap(rank  => files.map(file => file + rank))

export const ods = poss.flatMap(pos => poss.map(_pos => pos + _pos))

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

export function make_right2(files: Array<A>, right: any) {
  let res = {}

  files.forEach(file => {
    let i = right[file]
    if (i) {
      i= right[i]

      if (i) {
        res[file] = i
      }
    }
  })
  return res
}

export const right2 = make_right2(files, right)
export const left2 = make_right2(files, left)
export const up2 = make_right2(ranks, up)
export const down2 = make_right2(ranks, down)

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
export function make_fwd_que(upper: any, lefter: any) {
  let res = {}

  poss.forEach(pos => {
    let [file, rank] = pos.split('')
    let _res = {}

    let _upper = upper[rank]
    let _lefter = lefter[file]

    Object.keys(_upper).map(_up => {
      let _left = Object.keys(_lefter).find(_left =>
        _lefter[_left].length === 
        _upper[_up].length)
      if (_left) {

        let n = zip_pos(_lefter[_left], _upper[_up])

        _res[_left + _up] = n
      }
    })
    res[pos] = _res
  })

  return res
}

export const fwd_que = make_fwd_que(upper, lefter)
export const fwd_kng = make_fwd_que(upper, righter)
export const bck_que = make_fwd_que(downer, lefter)
export const bck_kng = make_fwd_que(downer, righter)

export function make_fwd2_que(up2: any, left: any) {
  let res = {}

  poss.forEach(pos => {
    let [file, rank] = pos.split('')
    poss.forEach(_pos => {
    let [_file, _rank] = _pos.split('')

      if (left[file] === _file && up2[rank] === _rank) {
        res[pos] = _pos
      }
    })
  })

  return res
}

export const fwd2_que = make_fwd2_que(up2, left)
export const fwd2_kng = make_fwd2_que(up2, right)
export const fwd_que2 = make_fwd2_que(up, left2)
export const fwd_kng2 = make_fwd2_que(up, right2) 

export const bck2_que = make_fwd2_que(down2, left)
export const bck2_kng = make_fwd2_que(down2, right)
export const bck_que2 = make_fwd2_que(down, left2)
export const bck_kng2 = make_fwd2_que(down, right2) 


export function make_fwdn(forward: any, n: number) {
  let res = {}

  poss.forEach(pos => {
    let _pos = Object.keys(forward[pos]).find(_ => forward[pos][_].length === n)

    if (_pos) {

      res[pos] = { [_pos]: forward[pos][_pos] }
    }
  })

  return res 
}

export const make_fwd2 = (forward: any) => make_fwdn(forward, 1)
export const make_fwd1 = (forward: any) => make_fwdn(forward, 0)

export const fwd2 = make_fwd2(forward)
export const bck2 = make_fwd2(backward)

export const fwd1 = make_fwd1(forward)
export const bck1 = make_fwd1(backward)
export const fwd_que1 = make_fwd1(fwd_que)
export const fwd_kng1 = make_fwd1(fwd_kng)
export const bck_que1 = make_fwd1(bck_que)
export const bck_kng1 = make_fwd1(bck_kng)
export const king_side1 = make_fwd1(king_side)
export const queen_side1 = make_fwd1(queen_side)

export function xy_or(ors: Array<any>) {
  let res = {}

  poss.forEach(pos => {
    let _res = []
    poss.forEach(_pos => {
      if (ors.map(_ => _[pos] === _pos).find(Boolean)) {
        _res.push(_pos)
      }
    })
    if (_res.length > 0) {
      res[pos] = _res
    }
  })
  return res
}

export const knight = xy_or([fwd2_que, fwd2_kng, bck2_que, bck2_kng, fwd_que2, fwd_kng2, bck_que2, bck_kng2])


export function xyn_or(ors: Array<any>) {
  let res = {}

  poss.forEach(pos => {
    let _res = {}
    poss.forEach(_pos => {
      ors.forEach(_ => {
        if (_[pos]?.[_pos]) {
          _res[_pos] = _[pos][_pos]
        }
      })
    })
    res[pos] = _res
  })
  return res
}

export const king_fwd = xyn_or([fwd1, fwd_que1, fwd_kng1])
export const king_bck = xyn_or([bck1, bck_que1, bck_kng1])
export const king_lat = xyn_or([queen_side1, king_side1])

export const bishop = xyn_or([fwd_que, fwd_kng, bck_que, bck_kng])
export const rook = xyn_or([forward, backward, queen_side, king_side])
export const king = xyn_or([king_fwd, king_bck, king_lat])
export const queen = xyn_or([bishop, rook])

export const white_home = (pos: Pos) => pos.split('')[1] === '2'
export const black_home = (pos: Pos) => pos.split('')[1] === '7'

export const white_base_dif = (pos: Pos) => pos.split('')[1] !== '1'
export const black_base_dif = (pos: Pos) => pos.split('')[1] !== '8'

export function xy_xfilter(fwd2: any, white_home: any) {
  let res = {}
  poss.forEach(pos => {
    if (white_home(pos) && fwd2[pos]) {
      res[pos] = fwd2[pos]
    }
  })
  return res
}

export const white_push2 = xy_xfilter(fwd2, white_home)
export const black_push2 = xy_xfilter(bck2, black_home)

export const white_push1 = xy_xfilter(fwd1, white_base_dif)
export const black_push1 = xy_xfilter(bck1, black_base_dif)

export const white_push = xyn_or([white_push2, white_push1])
export const black_push = xyn_or([black_push2, black_push1])


export const white_capture = xy_xfilter(xyn_or([fwd_kng1, fwd_que1]), white_base_dif)
export const black_capture = xy_xfilter(xyn_or([bck_kng1, bck_que1]), black_base_dif)





