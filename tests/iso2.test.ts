import { MobileSituation } from '../src'
import { gen_const } from '../src'

it.only('six', () => {
  let i = gen_const([
    [ "r_0", "f_0", "f_3", "f_1", "K_1", "f_2" ],
    [ "R_2", "f_3" ]
  ])

  let res = i(MobileSituation.from_fen('2r5/3Qnk1p/8/4B2b/Pp2p3/1P2P3/5PPP/3R2K1 w - - 3 32'))

  console.log(res)
})

it('gen_idea', () => {

  let i = gen_const([
    ['r', 'f', 'f2', 'K'],
    ['K', 'f2'],
    ['B', 'f2']
  ])

  let res
  i(MobileSituation.from_fen('2r5/3Qnk1p/8/4B2b/Pp2p3/1P2P3/5PPP/3R2K1 w - - 3 32'))

  res = i(MobileSituation.from_fen('1r6/7p/1Q3k1n/7b/Pp6/1P6/8/3R2K1 w - - 0 1'))
  // let res = i(MobileSituation.from_fen('1r6/7p/1Q3k1n/7b/Pp6/1Pk5/8/3R2K1 w - - 0 1'))

  console.log(res)
})
