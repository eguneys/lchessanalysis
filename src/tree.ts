import { Pos } from './types'
import { MobileSituation } from './situation'
import { Replay } from './replay2'
import { uci_split, UCI, UciChar, uci_char } from './replay'
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

export type Comment = string

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

  static breadfirst = (root: Node, visit: (path: Path, _: Node) => boolean) => {
    let queue: Array<[Path, Node]> = [['', root]]

    while (queue.length > 0) {
      let [path, node] = queue.shift()!

      if (visit(path, node)) {
        break
      }

      for (let i = 0; i < node.children.length; i++) {
        queue.push([path + node.children[i].id, node.children[i]])
      }
    }
  }

  get clone(): Node {

    let children = this.children.map(_ => _.clone)

    return new Node(this.id,
      this.fen,
      children,
      this.uci,
      this.comment)
  }

  get child_paths(): Array<Path> {
    let res = this.children.flatMap(_ => _.child_paths)
    if (res.length === 0) {
      return [this.id]
    }
    return res.map(_ => `${this.id}${_}`)
  }

  get lines(): Array<Array<Node>> {
    return this.child_paths.map(_ => this.node_list(_))
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


  map_comments(f: (_: Node) => Comment | undefined): Node {
    let children = this.children.map(_ => _.map_comments(f))
    let comment = f(this)

    return new Node(this.id,
                    this.fen,
                    children,
                    this.uci,
                    comment)
  }

  merge_node(node: Node, path: Path) {
    const new_path: Path = `${path}${node.id}`,
      existing = this.node_at_path_or_undefined(new_path)

    return this.update_at(path, (parent: Node) => {
      if (existing) {
        let new_comment = existing.comment
        if (!new_comment) {
          new_comment = node.comment
        } else {
          if (node.comment) {
            new_comment += ' ' + node.comment

          }
        }

        let new_node = new Node(
          existing.id,
          existing.fen,
          existing.children,
          existing.uci,
          new_comment
        )
        parent.children.splice(parent.children.indexOf(existing), 1, new_node)
      } else {
        parent.children.push(node)
      }
    }) ? new_path : undefined
  }

  delete_children(path: Path) {
    this.update_at(path, parent => {
      parent.children.splice(0, parent.children.length)
    })
  }

  delete_after(path: Path, node: Path) {
    this.update_at(path, parent => {
      parent.children.splice(parent.children.findIndex(_ => _.id === node), 1)
    })
  }


  add_node(node: Node, path: Path) {
    const new_path: Path = `${path}${node.id}`,
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

  static make_root = (fen: Fen, comment?: Comment) => {
    return new Node('', fen, [], undefined, comment)
  }

  static make_branch = (fen: Fen, uci: UCI, comment?: Comment) => {
    return new Node(uci_char(uci), fen, [], uci, comment)
  }

  constructor(readonly id: UciChar | '',
              readonly fen: Fen,
              readonly children: Array<Node>,
              readonly uci?: UCI,
              readonly comment?: Comment) {}

}

export type FlatDoc = [{ fen: Fen }, Array<[Path, { fen: Fen, uci: UCI, comment?: Comment }]>]

export class FlatTree {

  static write_root = (root: Node) => {
    return {
      fen: root.fen,
      comment: root.comment
    }
  }

  static read_root = (_: { fen: Fen, comment?: Comment }) => {
    return Node.make_root(_.fen, _.comment)
  }

  static write_node = (node: Node) => {
    return {
      fen: node.fen,
      uci: node.uci!,
      comment: node.comment
    }
  }

  static read_node = (doc: { fen: Fen, uci: UCI, comment?: Comment }) => {
    return Node.make_branch(doc.fen, doc.uci, doc.comment)
  }

  static read = (docs: FlatDoc) => {
    let [_root, rest] = docs
    rest.sort((a, b) => size(a[0]) - size(b[0]))

    let root = FlatTree.read_root(_root)
    rest.forEach(([path, doc]) => root.add_node(FlatTree.read_node(doc), init(path)))

    return root
  }

  static apply = (root: Node): FlatDoc => {

    function traverse(node: Node, parentPath: Path | ''): Array<[Path, { fen: Fen, uci: UCI, comment?: Comment }]> {
      let path = `${parentPath}${node.id}`

      return [...node.children.flatMap(_ => traverse(_, path)), [path, FlatTree.write_node(node)]]
    }

    return [
      FlatTree.write_root(root),
      root.children.flatMap(_ => traverse(_, ''))
    ]
  }

}

export class TreeBuilder {


  static uci_convert = (_merge_root: Node, _path: Path, root: Node, map: Map<Pos, Pos>) => {

    let merge_root = _merge_root.clone

    const uci_convert = (uci: UCI): UCI => {
      let [od, _] = uci_split(uci)

      let [o, d] = [od.slice(0, 2), od.slice(2, 4)] as [Pos, Pos]

      let new_o = map.get(o) || o
      let new_d = map.get(d) || d

      return `${new_o}${new_d}${_ ?? ''}` as UCI

    }
    
    let fail = root.lines.find(line => {
      let path = _path
      let fen = merge_root.node_at_path_or_undefined(_path)!.fen
      let fail = line.find(node => {
        if (node.uci) {
          let new_uci = uci_convert(node.uci)
          let new_id = uci_char(new_uci)

          let new_sit = MobileSituation.from_fen(fen).od(new_uci as any)

          if (!new_sit) {
            return true
          }
          fen = new_sit[0].fen

          let new_comment = node.comment

          let new_node = new Node(new_id, fen, [], new_uci, new_comment)

          merge_root.merge_node(new_node, path)
          path = path + new_id

          return false
        }
      })
      return fail
    })


    if (!fail) {
      return merge_root
    }
  }


  static apply = (game: MobileSituation, moves: Array<UCI>) => {


    let [init, games] = Replay.game_move_while_valid(moves, game.fen)

    let root = Node.make_root(init.fen)

    const make_branch = (g: MobileSituation, m: UCI) => {
      return Node.make_branch(g.fen, m)
    }

    if (games.length > 0) {
      let [[g, m], ...rest] = games.reverse()
      let node = rest.reduce((node, [g, m]) => {
        let new_branch = make_branch(g, m)
        new_branch.add_node(node, '')
        return new_branch
      }, make_branch(g, m))
      root.add_node(node, '')
    }


    return root
  }


}
