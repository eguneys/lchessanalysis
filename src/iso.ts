// @ts-nocheck
import { poss } from './types'
import { IsoSituation } from './iso_situation'
import { MobileSituation } from './situation'

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

const obj_diff_symbols = obj => {
  return Object.keys(obj).every(_ => Object.keys(obj).every(__ => _ === __ || obj[_][0] !== obj[__][0]))
}


export function match_idea(iso: IsoSituation, sit: MobileSituation, i: Idea) {

  let { turn } = sit
  let opposite = turn === 'w' ? 'b' : 'w'

  let symbols = [...new Set(i.flat())]

  let _is = {}
  
  symbols.forEach(__ => {
    let _ = __[0]

    let is_up = _.toUpperCase() === _

    let color = is_up ? opposite : turn
    let piece = color + _.toLowerCase()

    if (_ === 'f') {
      _is[__] = poss
    } else {
      _is[__] = poss.filter(p => sit.board.on(p) === piece)
    }
  })

  function step(__i: Idea, ctx = {}) {
    let _i = __i.slice(0)
    if (_i.length === 0) {
      return ctx
    }
    let a = _i.pop()

    let [_, f] = a

    ctx[_] ||= _is[_].slice(0)
    ctx[f] ||= _is[f].slice(0)

    let k
    if (a.length === 3) {
      [,, k] = a
      ctx[k] ||= _is[k].slice(0)
    }

    let solutions = ctx[_].flatMap(o => {
      let _res = ctx[f].filter(d => iso.o_ds(o).includes(o+d))

      if (k) {
        return _res.flatMap(d => {
          let [iso2]  = iso.od(o+d)

          return ctx[k].filter(dd => iso2.o_ds(d).includes(d+dd))
          .map(dd => ({ ...ctx, [_]: [o], [f]: [d], [k]: [dd] }))
        })
      } else {
        return _res.map(d => ({ ...ctx, [_]: [o], [f]: [d] }))
      }
    })
    return solutions.flatMap(_ctx => step(_i, _ctx)).filter(_ctx => obj_diff_symbols(_ctx))
  }

  return step(i)
}








