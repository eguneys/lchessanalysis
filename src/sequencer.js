import { MobileSituation } from './situation';
export class Sequencer {
    constructor(situation) {
        this.situation = situation;
    }
}
Sequencer.from_fen = (fen) => {
    return new Sequencer(MobileSituation.from_fen(fen));
};
