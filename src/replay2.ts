import { Fen } from './fen'
import { UciChar, Path, UCI, Comment } from './replay'

export class Node {

  constructor(readonly fen: Fen,
              readonly children: Array<Branch>) { }
}

export class Branch extends Node {

  constructor(id: UciChar,
    fen: Fen,
    children: Array<Branch>,
    readonly uci: UCI,
    readonly comment?: Comment) { super(fen, children) }
}

export class Root extends Node {



}
