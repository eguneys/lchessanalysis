import { UCI, UciChar, uci_char } from './replay'
import { Fen } from './fen'


export type Path = string

export const size = (path: Path): number => path.length / 2
export const head = (path: Path): Path => path.slice(0, 2)
export const tail = (path: Path): Path | '' => path.slice(2)
export const init = (path: Path): Path => path.slice(0, -2)
export const last = (path: Path): Path | '' => path.slice(-2)
export const contains = (p1: Path, p2: Path) => p1.startsWith(p2)

export const fromNodes = (nodes: Array<Node>): Path => {
  let path = ''
  for (const i in nodes) path += nodes[i].id
  return path
}

export class Node {

  static collect = (from: Node, pick: (_: Node) => Node | undefined): Array<Node> => {
    let nodes = [from]
    let n = from,
      c

    while ((c = pick(n))) {
      nodes.push(c)
      n = c
    }
    return nodes
  }

  child_by_id = (id: UciChar) => {
    return this.children.find(child => child.id === id)
  }

  node_list(path: Path) {
    return Node.collect(this, (node: Node) => {
      const id = head(path)
      if (id === '') return undefined;
      path = tail(path)
      return node.child_by_id(id)
    })
  }


  add_node(node: Node, path: Path) {
    const new_path = path + node.id,
      existing = this.node_at_path_or_undefined(new_path)

    if (existing) {
      return new_path
    }

    return this.update_at(path, (parent: Node) => {
      parent.children.push(node)
    }) ? new_path : undefined
  }

  update_at(path: Path, update: (node: Node) => void) {
    let node = this.node_at_path_or_undefined(path)
    if (node) {
      update(node)
      return node
    }
    return undefined
  }

  node_at_path_or_undefined(path: Path | ''): Node | undefined {
    if (path === '') return this
    const child = this.child_by_id(head(path))
    return child ? child.node_at_path_or_undefined(tail(path)) : undefined
  }

  static make_root = (fen: Fen) => {
    return new Node('', fen, [], undefined)
  }

  static make_branch = (fen: Fen, uci: UCI) => {
    return new Node(uci_char(uci), fen, [], uci)
  }

  constructor(readonly id: UciChar | '',
              readonly fen: Fen,
              readonly children: Array<Node>,
              readonly uci?: UCI) {}

}
