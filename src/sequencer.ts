import { MobileSituation } from './situation'


export class Sequencer {

  static from_fen = (fen: string) => {
    return new Sequencer(MobileSituation.from_fen(fen))
  }


  constructor(readonly situation: MobileSituation) {}

}
