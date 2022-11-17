import { MobileSituation } from '../src'
import { gen_const } from '../src'


it('gen_idea', () => {

  let i = gen_const([
    ['r', 'f', 'f2', 'K']
  ])

  i(MobileSituation.from_fen('2r5/3Qnk1p/8/4B2b/Pp2p3/1P2P3/5PPP/3R2K1 w - - 3 32'))

})
