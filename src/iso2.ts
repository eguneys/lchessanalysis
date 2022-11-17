import { poss, Pos, Role } from './types'
import { MobileSituation as Situation } from './situation'
import { isRayRole, ray_route, night_route } from './rays'
import { g_filter } from './util'

/*
// r f f2 K
// K f2


r [e2]
f [a1 a2]

r r f  [e2] [[e3, e4, e5]]
r f f2 [e3, e4] [[e5, e6], [e7]]
r f2 K

K K f2
*/

export type Arrow = Array<string>
export type Idea = Array<Arrow>

export function gen_const(idea: Idea) {

  let symbols = [...new Set(idea.flat())]

  return (situation: Situation) => {
    let c_single = constraint_single(situation)

    let p_map = new Map(symbols.map(_ => [_, c_single(_)]))

    for (let i = 0; i < 3; i++) {
      idea.map(arrow => {
        let [role] = arrow
        let c_c = constraint(situation, role as Role)
        for (let i = 0; i < arrow.length - 1; i++) {
          let f = p_map.get(arrow[i])!
            let f2 = p_map.get(arrow[i+1])!
            let _f2 = c_c(f)
          let _f2_intersect = intersect(f2, _f2.flat())

          let _f = f.filter((f, i) => intersect(f2, _f2[i]).length > 0)

          p_map.set(arrow[i], _f)
          p_map.set(arrow[i+1], _f2_intersect)
        }
      })
    }

    console.log(p_map)
    return p_map
  }
}


export function constraint_single(situation: Situation) {
  let { opposite, turn, board } = situation

  return (a: string): Array<Pos> => {
    let _ = a[0]
    let is_up = _.toUpperCase() === _

    let color = is_up ? opposite : turn
    let piece = `${color}${_.toLowerCase()}`
    if (_ === 'f') {
      return poss
    } else {
      return poss.filter(p => board.on(p) === piece)
    }
  }

}

export function constraint(situation: Situation, role: Role) {
  let { board } = situation
  return (aa: Array<Pos>): Array<Array<Pos>> =>
    aa.map(a => {
      if (isRayRole(role)) {
        let d_is = ray_route[role][a]
        if (d_is) {
          return g_filter(d_is, (d, is) => {
            if (is) {
              let block = is.find(_ => board.on(_))
              return !block
            }
            return false
          })
        }
      } else if (role === 'n') {
        let d_is = night_route[role][a]
        if (d_is) {
          return d_is
        }
      }
      return []
    })
}


function intersect(a: Array<Pos>, b: Array<Pos>) {
  return a.filter(_ => b.includes(_))
}
