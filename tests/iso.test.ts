import { FlatTree, MobileSituation, TreeBuilder, Node, initial_fen } from '../src'
import { match_idea, IsoSituation } from './src'

it('iso', () => {
  let fen = '2r5/3Qnk1p/8/4B2b/Pp2p3/1P2P3/5PPP/3R2K1 w - - 3 32'

  let root = TreeBuilder.apply(MobileSituation.from_fen(fen), 'd1d6'.split(' '))

  fen = root.children[0].fen


  let i = match_idea(IsoSituation.from_fen(fen), MobileSituation.from_fen(fen), [['R', 'f']])
  console.log(i)

})

it.only('2', () => {

  let fen = '2r5/3Qnk1p/3R4/4B2b/Pp2p3/1P2P3/5PPP/6K1 b KQkq'

  let i = match_idea(IsoSituation.from_fen(fen), MobileSituation.from_fen(fen), [['r', 'f']])
  console.log(i)
})
