import { MobileSituation } from './situation'
import { Path, UCI, Comment } from './replay'

export class NodeRootBase {

  get fen() {
    return this.situation.fen
  }

  constructor(readonly situation: MobileSituation,
              readonly children: Array<Node>) {

              }
}

export class Node extends NodeRootBase {

  constructor(situation: MobileSituation,
              children: Array<Node>,
              readonly path: Path,
              readonly uci: UCI,
              readonly comment?: Comment) { super(situation, children) }
}

export class Root extends NodeRootBase {



}
