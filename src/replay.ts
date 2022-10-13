import { MobileSituation } from './situation'
import { poss, files, promotables, Promotable, Pos, File } from './types'
import { a_map } from './util'

export type Fen = string
export type ODP = string

export type Path = string

export type NodeData = {
  uci?: string,
  comment?: string
}

export type Node = {
  [k: ODP]: Node
} & {
  data?: NodeData,
}

function data_flat(data: NodeData) {
  return `{${[data.uci, data.comment].join(' ')}}`
}

function node_arr(path: Path, moves: Node): Array<string> {
  if (!moves) {
    return []
  } else {
    return Object.keys(moves).flatMap(move => {
      if (move === 'data') {
        return [path, data_flat(moves[move]!)].join('___')
      }
      let _path = path + move
      return node_arr(_path, moves[move])
    })
  }
}

function find_path(node: Node, path: Path): Node {
  if (path === '') {
    return node
  }
  let [head, rest] = [path.slice(0, 2), path.slice(2)]

  return find_path(node[head], rest)
}

function follow_path(node: Node, path: Path, acc: Array<Node>): Array<Node> {
  if (path === '') {
    return [...acc, node]
  }
  let [head, rest] = [path.slice(0, 2), path.slice(2)]
  return follow_path(node[head], rest, [...acc, node])
}

export class Replay {


  static from_fen = (fen: Fen) => {
    return new Replay(MobileSituation.from_fen(fen), {})
  }

  follow_path(path: Path) {
    return follow_path(this._moves, path, [])
  }

  path(path: Path) {
    return find_path(this._moves, path)
  }

  remove(path: Path) {
    let [_path, move] = [path.slice(0, -2), path.slice(-2)]
    let node = find_path(this._moves, path)
    delete node[uci_char(move)]
  }

  move(path: Path, move: ODP, data: NodeData = {}) {
    let node = find_path(this._moves, path)
    
    node[uci_char(move)] ||= {}
    node[uci_char(move)].data = {
      uci: move,
      ...data
    }
  }

  data(path: Path, data: NodeData) {

    let node = find_path(this._moves, path)
    if (data) { 
      node.data = data
    }
    return node.data
  }

  play_ucis(ucis: string) {
    ucis.split(' ').reduce((root, uci) => {
      let _ = uci_char(uci)

      this.move(root, uci)
      return root + _
    }, '')
  }

  get replay() {
    return [this.situation.fen, node_arr('', this._moves).join('\n')].join('\n\n')
  }


  get moves() {
    return []
  }


  constructor(readonly situation: MobileSituation, readonly _moves: Node) {}

}


export type UciChar = string

const charShift = 35
const voidChar = String.fromCharCode(33) // '!', skip 34 \"

const pos_hash = (pos: Pos) => poss.indexOf(pos) + 1
const pos2charMap = a_map(poss, pos => String.fromCharCode(pos_hash(pos) + charShift))

const pos_to2char = (pos: Pos) => pos2charMap[pos] || voidChar

const promotion2charMap = (() => {
  let res: any = {}

  promotables.map((role, i) => {
    files.map((file, i_file) => {
      let key = role + file
      let _res = String.fromCharCode(charShift + Object.keys(pos2charMap).length + i * 8 + i_file - 1)
      res[key] = _res
    })
  })
  return res
})()

const pos_to2char_p = (file: File, role: Promotable) => promotion2charMap[role+file] || voidChar

export const uci_char = (odp: ODP) => {
  let [od, p] = odp.split('=')
  let [o, d]: [Pos, Pos] = [od.slice(0, 2), od.slice(2)]
  if (p) {
    return pos_to2char(o) + pos_to2char_p(d[0] as File, p as Promotable)
  } else {
    return pos_to2char(o) + pos_to2char(d)
  }
}

