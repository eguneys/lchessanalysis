import { MobileSituation } from './situation'
import { Fen } from './fen'
import { UCI, isOd } from './replay'

export class Replay {


  static game_move_while_valid = (moves: Array<UCI>, fen: Fen): [MobileSituation, Array<[MobileSituation, UCI]>] => {
    function make(situation: MobileSituation, moves: Array<UCI>): Array<[MobileSituation, UCI]> {
      if (moves.length === 0) {
        return []
      }
      let [uci, ...rest] = moves

      if (isOd(uci)) {
        let _new_game = situation.od(uci)

        if (_new_game) {
          let [new_game] = _new_game
          return [[new_game, uci], ...make(new_game, rest)]
        }
      }
      return []
    }

    let init = MobileSituation.from_fen(fen)

    return [init, make(init, moves)]
  }

}
