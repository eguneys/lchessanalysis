import { MobileSituation } from './situation';
export declare class Sequencer {
    readonly situation: MobileSituation;
    static from_fen: (fen: string) => Sequencer;
    constructor(situation: MobileSituation);
}
