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
    let _res: any

    for (let i = 0; i < 8; i++) {
      _res = idea.map(arrow => {
        let p2_map = new Map()
        let [role] = arrow
        let c_c = constraint(situation, symbol_role(role))
        for (let i = 0; i < arrow.length - 1; i++) {
          let f = p_map.get(arrow[i])!
            let f2 = p_map.get(arrow[i+1])!
            let _f2 = c_c(f)

          let _f2_intersect = intersect(f2, _f2.flat())

          let _f = f.filter((f, i) => intersect(f2, _f2[i]).length > 0)
          _f = intersect(_f, p_map.get(arrow[i]))

          p_map.set(arrow[i], _f)
          p_map.set(arrow[i+1], _f2_intersect)
          p2_map.set(arrow[i+1], c_c(_f).map(_ => intersect(_, _f2_intersect)))
        }

        return p2_map
      })
    }

    const merge1 = (a: Array<Pos>, aa: Array<Array<Pos>>) =>
    a.flatMap((pos, i) => aa[i].map(pos2 => [pos, pos2]))

    const merge2 = (aa: Array<Array<Pos>>, bb: Array<Array<Pos>>) =>
    aa.flatMap(a => bb.filter(b => b[0] === a[a.length - 1]).map(b => [...a, b[1]]))

    let __ = idea.map((arrow, i) => {
      let p2_map = _res[i]

      let n = p_map.get(arrow[0])!

      let merge1s = []
      for (let i = 1; i < arrow.length; i++) {
        merge1s.push(merge1(n, p2_map.get(arrow[i])))
        n = remove_duplicates(p2_map.get(arrow[i]).flat())
      }

      return merge1s.reduce(merge2)
    })

    let res = idea.reduce<any>(([arrow_acc, aacc], arrow2, i) => {

      let is: Array<number> = []
      for (let i = 0; i < arrow2.length; i++) {
        if (!arrow_acc.includes(arrow2[i])) {
          is.push(i)
        }
      }

      let arrow_acc2 = [...arrow_acc, ...is.map(i => arrow2[i])]

      let aacc2 = aacc.flatMap((acc: any) => {
        let aacc2 = filter3(arrow_acc, acc, arrow2, __[i])
        return aacc2.map(acc2 => {
          return [...acc, ...is.map(i => acc2[i])]
        })
      })

      return [arrow_acc2, aacc2]
    }, [[], [[]]])

    function filter3(arrow: Arrow, a: Array<Pos>, arrow2: Arrow, bb: Array<Array<Pos>>) {
      return bb.filter(b => {
        for (let i = 0; i < arrow2.length; i++) {
          let ai = arrow.findIndex(_ => _ === arrow2[i])
          if (ai > -1) {
            if (b[i] !== a[ai]) {
              return false
            }
          }
        }
        return true
      })
    }

    return res[1]
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

function symbol_role(symbol: string) {
  return symbol[0].toLowerCase() as Role
}

function remove_duplicates(a: Array<Pos>) {
  return [...new Set(a)]
}
