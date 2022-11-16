import { MobileSituation } from './situation'
import { od_split, OD, poss, files, promotables, Promotable, Pos, File } from './types'
import { a_map } from './util'


export const uci_split = (uci: UCI): [OD, Promotable | undefined] => {
  return uci.split('=') as [OD, Promotable | undefined]
}


export type ODP = `${OD}=${Promotable}`
export type ODorP = OD | ODP
export type UCI = ODorP

export const isOd = (_: UCI): _ is OD => {
  return _.length === 4
}

export type UciChar = string

const charShift = 35
const voidChar = String.fromCharCode(33) // '!', skip 34 \"

const pos_hash = (pos: Pos) => poss.indexOf(pos) + 1
const pos2charMap = a_map(poss, pos => String.fromCharCode(pos_hash(pos) + charShift))

const pos_to2char = (pos: Pos) => pos2charMap[pos] || voidChar

const promotion2charMap = (() => {
  let res: any = {}

  promotables.map((role, i) => {
    files.map((file, i_file) => {
      let key = role + file
      let _res = String.fromCharCode(charShift + Object.keys(pos2charMap).length + i * 8 + i_file - 1)
      res[key] = _res
    })
  })
  return res
})()

const pos_to2char_p = (file: File, role: Promotable) => promotion2charMap[role+file] || voidChar

export const uci_char = (odp: UCI): UciChar => {
  let [od, p] = uci_split(odp)
  let [o, d]: [Pos, Pos] = od_split(od)
  if (p) {
    return pos_to2char(o) + pos_to2char_p(d[0] as File, p as Promotable)
  } else {
    return pos_to2char(o) + pos_to2char(d)
  }
}

