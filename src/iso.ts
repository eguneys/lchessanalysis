import { poss } from './types'
import { obj_map } from './util'

/*

(b -> q) -> B <- Q
       |____^

['b', 'q', 'B'],
['q', 'B'],
['Q', 'B']

*/

export type Object = string
export type Arrow = Array<Object>
export type Idea = Array<Arrow>



export function match_idea(iso: IsoSituation, sit: MobileSituation, i: Idea) {

  let { turn } = sit
  let opposite = turn === 'w' ? 'b' : 'w'

  let symbols = [...new Set(i.flat())]

  let _is = {}
  
  symbols.forEach(_ => {
    let is_up = _.toUpperCase() === _

    let color = is_up ? opposite : turn
    let piece = color + _.toLowerCase()

    _is[_] = poss.filter(p => sit.board.on(p) === piece)
  })


  let res = []


  function step(ctx) {
  }


  return _is
}
