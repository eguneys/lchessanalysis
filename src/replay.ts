import { MobileSituation } from './situation'
import { poss, files, promotables, Promotable, Pos, File } from './types'
import { a_map } from './util'

export type Fen = string
export type ODP = string

export type Path = string

export class Node {

  static from_uci = (uci: string, comment?: string) => {
    return new Node([],
                    uci_char(uci),
                    uci, 
                    comment)
  }

  get flat() {
    return `{${[this.uci, this.comment].join(' ')}}`
  }

  add_node(node: Node) {
    this.children.push(node)
  }

  constructor(readonly children: Array<Node>,
              readonly path: Path,
              readonly uci: string,
              readonly comment?: string) {}
}

function node_arr(path: Path, root: Node): Array<string> {
  return [
    [path, root.flat].join('_separator_'),
    ...root.children.flatMap(node => node_arr(path + node.path, node))
  ]
}

function find_path(node: Node, path: Path): Node {
  if (path === node.path) {
    return node
  }
  let [head, rest] = [path.slice(0, 2), path.slice(2)]
  let rest2 = rest.slice(0, 2)

  return find_path(node.children.find(_ => _.path === rest2)!, rest)
}

function follow_path(node: Node, path: Path, acc: Array<Node>): Array<Node> {
  if (path === '') {
    return [...acc, node]
  }
  let [head, rest] = [path.slice(0, 2), path.slice(2)]
  return follow_path(node.children.find(_ => _.path === head)!, rest, [...acc, node])
}

export class Replay {


  static from_fen = (fen: Fen, ucis: string) => {

    let [head, rest] = [ucis.slice(0, 4), ucis.slice(4)]

    let root = Node.from_uci(head)

    let _ = new Replay(MobileSituation.from_fen(fen), root)
    if (rest) {
      _.play_ucis(root.path, rest)
    }
    return _
  }

  follow_path(path: Path) {
    return follow_path(this.root, path, [])
  }

  find_path(path: Path) {
    return find_path(this.root, path)
  }

  move(path: Path, uci: string, _: { comment?: string } = {}) {
    let node = Node.from_uci(uci, _.comment)

    let root = find_path(this.root, path)
    root.add_node(node)
    return path + node.path
  }

  play_ucis(path: Path, ucis: string) {
    ucis.split(' ').reduce((path, uci) => this.move(path, uci), path)
  }

  get replay() {
    return [this.situation.fen, node_arr(this.root.path, this.root).join('\n')].join('\n\n')
  }


  constructor(readonly situation: MobileSituation, readonly root: Node) {}

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

