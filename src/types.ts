import { g_map, g_find, gen_fmap, FMap, SMap, AAsMap } from './util'

export const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const
export const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'] as const

export const colors = ['w', 'b'] as const
export const roles = ['r', 'q', 'b', 'n', 'p', 'k'] as const
export const promotables = ['q', 'n', 'r', 'b'] as const

export type File = typeof files[number]
export type Rank = typeof ranks[number]
export type Color = typeof colors[number]
export type Role = typeof roles[number]
export type Promotable = typeof promotables[number]

export const poss = files.flatMap(file => ranks.map(rank => file + rank))
export const pieces = colors.flatMap(color => roles.map(role => color + role))

export const pieses = pieces.flatMap(piece => poss.map(pos => [piece, pos].join('@')))

export const ranks_high = ranks.slice(0).reverse()
export const poss_sorted = ranks.flatMap(rank => files.map(file => file + rank))
export const poss_high_first = ranks_high.flatMap(rank  => files.map(file => file + rank))

export const ods = poss.flatMap(pos => poss.map(_pos => pos + _pos))

export type Pos = string
export type Piece = string
export type Piese = string
export type Pieses = Array<Piese>

export const f_file: FMap<File> = gen_fmap(files)
export const f_rank: FMap<Rank> = gen_fmap(ranks)

export const right: SMap<File> = { 'a': 'b', 'b': 'c', 'c': 'd', 'd': 'e', 'e': 'f', 'f': 'g', 'g': 'h', 'h': undefined}
export const left: SMap<File> = { 'h': 'g', 'g': 'f', 'f': 'e', 'e': 'd', 'd': 'c', 'c': 'b', 'b': 'a', 'a': undefined}

export const up: SMap<Rank> = { '1': '2', '2': '3', '3': '4', '4': '5', '5': '6', '6': '7', '7': '8', '8': undefined}
export const down: SMap<Rank> = { '8': '7', '7': '6', '6': '5', '5': '4', '4': '3', '3': '2', '2': '1', '1': undefined}

export function make_right2<A extends string>(files: FMap<A>, right: SMap<A>) {
  return g_map(files, file => {
    let i: A | undefined = right[file]
    if (i) {
      i = right[i]
      if (i) {
        return i
      }
    }
  })
}

export const right2: SMap<File> = make_right2(f_file, right)
export const left2: SMap<File> = make_right2(f_file, left)
export const up2: SMap<Rank> = make_right2(f_rank, up)
export const down2: SMap<Rank> = make_right2(f_rank, down)

export function make_righter<A extends string>(files: FMap<A>, right: SMap<A>) {

  return g_map(files, file => {
    let _res: any = {}

    let i: A | undefined = file
    let acc = []
    while ((i = right[i])) {
      _res[i] = acc.slice(0)
      acc.push(i)
    }
    return _res
  })
}

export const righter: AAsMap<File> = make_righter(f_file, right)
export const lefter: AAsMap<File> = make_righter(f_file, left)
export const upper: AAsMap<Rank> = make_righter(f_rank, up)
export const downer: AAsMap<Rank> = make_righter(f_rank, down)

export const f_poss: FMap<Pos> = gen_fmap(poss)

export type FileRank = [File, Rank]

export const pos_split = (pos: Pos): FileRank => pos.split('') as FileRank

export function make_king_side(righter: AAsMap<File>) {
  let res = {}

  return g_map(f_poss, pos => {
    let [file, rank] = pos_split(pos)

    let _res: any = {}

    let _righter = righter[file]

    g_map(_righter, (_right, _right_value) => {
      let n = _right_value.map(f => f + rank)
      _res[_right+rank] = n
    })
    return _res
  })
}
export const king_side: AAsMap<Pos> = make_king_side(righter)
export const queen_side: AAsMap<Pos> = make_king_side(lefter)

export function make_forward(upper: AAsMap<Rank>) {
  return g_map(f_poss, pos => {
    let [file, rank] = pos_split(pos)

    let _res: any = {}

    let _upper = upper[rank]

    g_map(_upper, (_up, _up_value) => {
      let n = _up_value.map(r => file + r)
      _res[file+_up] = n
    })

    return _res
  })
}


export const forward: AAsMap<Pos> = make_forward(upper)
export const backward: AAsMap<Pos> = make_forward(downer)

function zip_pos<A extends string, B extends string>(a: Array<A>, b: Array<B>) {
  return a.map((_a, i) => _a + b[i])
}

export function make_fwd_que(upper: AAsMap<Rank>, lefter: AAsMap<File>) {
  return g_map(f_poss, pos => {

    let [file, rank] = pos_split(pos)

    let _res: any = {}

    let _upper = upper[rank]
    let _lefter = lefter[file]

    g_map(_upper, (_up, _up_value) => {
      let _left = g_find(_lefter, (_left, _left_value) => _lefter[_left].length === _upper[_up].length)

      if (_left) {

        let n = zip_pos(_lefter[_left], _upper[_up])

        _res[_left + _up] = n
      }
    })

    return _res
  })
}


export const fwd_que: AAsMap<Pos> = make_fwd_que(upper, lefter)
export const fwd_kng: AAsMap<Pos> = make_fwd_que(upper, righter)
export const bck_que: AAsMap<Pos> = make_fwd_que(downer, lefter)
export const bck_kng: AAsMap<Pos> = make_fwd_que(downer, righter)


export function make_fwd2_que(up2: SMap<Rank>, left: SMap<File>) {
  return g_map(f_poss, pos => {
    let [file, rank] = pos_split(pos)

    return g_find(f_poss, _pos => {
      let [_file, _rank] = pos_split(_pos)

      return (left[file] === _file && up2[rank] === _rank)
    })
  })
}


export const fwd2_que: SMap<Pos> = make_fwd2_que(up2, left)
export const fwd2_kng: SMap<Pos> = make_fwd2_que(up2, right)
export const fwd_que2: SMap<Pos> = make_fwd2_que(up, left2)
export const fwd_kng2: SMap<Pos> = make_fwd2_que(up, right2) 

export const bck2_que: SMap<Pos> = make_fwd2_que(down2, left)
export const bck2_kng: SMap<Pos> = make_fwd2_que(down2, right)
export const bck_que2: SMap<Pos> = make_fwd2_que(down, left2)
export const bck_kng2: SMap<Pos> = make_fwd2_que(down, right2) 


export function make_fwdn(forward: SMap<Pos>, n: number) {
  return g_map(f_poss, pos => {
    let _pos = 
      g_find(forward[pos], 
             _ => forward[pos][_].length === n)
    if (_pos) {
      return { [_pos]: (forward[pos][_pos] }
    }
  })
}
/*

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




*/


export const piece_fen = (piece: Piece) => piece[0] === 'w' ? piece[1].toUpperCase() : piece[1]
