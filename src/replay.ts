import { MobileSituation } from './situation'
import { od_split, OD, poss, files, promotables, Promotable, Pos, File } from './types'
import { a_map } from './util'


export const uci_split = (uci: UCI): [OD, Promotable | undefined] => {
  return uci.split('=') as [OD, Promotable | undefined]
}

export type Comment = string
export type NodeFlat = `{${UCI} ${Comment}}`


export const anode_split = <A extends string, B extends string>(_: Anoded<A, B>): [A, B] => _.split('__anode__') as [A, B] 
export const anode_a = <A extends string, B extends string>(_: [A, B]): Anoded<A, B> => _.join('__anode__') as Anoded<A, B>

const __anoded = Symbol('anoded')
export type Anoded<A, B> = string & { [__anoded]: true }
export const _anoded = <A, B>(_: string): Anoded<A, B> => _ as Anoded<A, B>




export const newline_split = <A extends string>(_: Newlined<A>): Array<A> => _.split('\n') as Array<A>
export const newline_a = <A>(_: Array<A>): Newlined<A> => _.join('\n') as Newlined<A>

const __newlined = Symbol('newlined')
export type Newlined<A> = string & { [__newlined]: true }
export const _newlined = <A>(_: string): Newlined<A> => _ as Newlined<A>




export const spaced_split = <A extends string>(_: Spaced<A>): Array<A> => _.split(' ') as Array<A>
export const spaced_a = <A>(_: Array<A>): Spaced<A> => _.join(' ') as Spaced<A>

const __spaced = Symbol('spaced')
export type Spaced<A> = string & { [__spaced]: true }
export const _spaced = <A>(_: string): Spaced<A> => _ as Spaced<A>

export type _S_ODP = Spaced<ODorP>
export type S_UCI = _S_ODP

export type ODP = `${OD}=${Promotable}`

export type ODorP = OD | ODP
export type UCI = ODorP

const __path = Symbol('path')
export type Path = string & { [__path]: true }

export const path_join = (a: Path, b: Path): Path => `${a}${b}` as Path
export const path_split = (a: Path): [Path, Path | ''] => [a.slice(0, 2) as Path, a.slice(2) as Path | '']
export const heads_path = (a: Path): Path | '' => a.slice(0, -2) as Path | ''




const __node = Symbol('node')
export type NodeExport = string & { [__node]: true }

export class Node {

  static from_uci = (uci: UCI, comment?: string) => {
    return new Node([],
                    uci_char(uci),
                    uci, 
                    comment)
  }

  static from_node_flat = (flat: NodeFlat) => {
    let [_, uci, comment] = flat.match(/\{([^\s]*) ([^\}]*)\}/)!

    return Node.from_uci(uci as UCI, comment)
  }

  get flat() {
    return `{${[this.uci, this.comment].join(' ')}}`
  }

  add_node(node: Node) {
    if (this.children.find(_ => _.path === node.path)) {
      return
    }
    this.children.push(node)
  }

  constructor(readonly children: Array<Node>,
              readonly path: Path,
              readonly uci: UCI,
              readonly comment?: string) {}
}

function node_arr(path: Path, root: Node): Array<Anoded<Path, NodeFlat>> {
  return [
    anode_a([path, root.flat]),
    ...root.children.flatMap(node => node_arr(path_join(path, node.path), node))
  ]
}

function find_path(node: Node, path: Path): Node | undefined {
  if (path === node.path) {
    return node
  }
  let [head, rest] = path_split(path)
  if (rest === '') {
    return undefined
  }
  let [rest2] = path_split(rest)
  let child = node.children.find(_ => _.path === rest2)
  if (child) {
    return find_path(child, rest)
  }
}

function follow_path(node: Node, path: Path, acc: Array<Node>): Array<Node> {
  if (path === node.path) {
    return [...acc, node]
  }
  let [head, rest] = path_split(path)
  if (rest === '') {
    return []
  }
  let [rest2] = path_split(rest)
  return follow_path(node.children.find(_ => _.path === rest2)!, rest, [...acc, node])
}

export class Replay {

  static from_replay = (replay: Newlined<Anoded<Path, NodeFlat>>) => {

    let [head, ...rest] = newline_split(replay)

    let [path, flat] = anode_split(head)
    let root = Node.from_node_flat(flat)

    rest.forEach(_ => {
      let [path, flat] = anode_split(_)
      let _head_path = heads_path(path)
      if (!_head_path) {
        return
      }
      let child = find_path(root, _head_path)
      if (!child) {
        return
      }
      child.add_node(Node.from_node_flat(flat))
    })
   
    return new Replay(root)
  }

  static from_ucis = (ucis: S_UCI) => {

    let [head, ..._rest] = spaced_split(ucis)
    let rest = spaced_a(_rest)

    let root = Node.from_uci(head)

    let _ = new Replay(root)
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

  move(path: Path, uci: UCI, _: { comment?: string } = {}) {
    let node = Node.from_uci(uci, _.comment)

    let root = find_path(this.root, path)
    if (!root) {
      return undefined
    }
    root.add_node(node)
    return path_join(path, node.path)
  }

  play_ucis(path: Path, ucis: S_UCI) {
    return spaced_split<UCI>(ucis).reduce<Path | undefined>((path, uci) => path && this.move(path, uci), path)
  }

  get replay(): Newlined<Anoded<Path, NodeFlat>> {
    return newline_a(node_arr(this.root.path, this.root))
  }


  constructor(readonly root: Node) {}

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

export const uci_char = (odp: UCI): Path => {
  let [od, p] = uci_split(odp)
  let [o, d]: [Pos, Pos] = od_split(od)
  if (p) {
    return pos_to2char(o) + pos_to2char_p(d[0] as File, p as Promotable) as Path
  } else {
    return pos_to2char(o) + pos_to2char(d) as Path
  }
}

