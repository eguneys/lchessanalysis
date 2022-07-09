import { left, lefter, right, righter, king_side, queen_side, forward, backward, fwd_que, fwd2_que, fwd2_kng, fwd_que2, fwd_kng2, fwd2 } from '../src'

import { knight } from '../src'

it('should knight', () => {
  expect(knight['d4'].slice(0).sort()).toStrictEqual(['c6', 'e2', 'e6', 'c2', 'f3', 'f5', 'b3', 'b5'].sort())
})


it('should find right', () => {

  expect(righter['a']['h']).toStrictEqual(['b', 'c', 'd', 'e', 'f', 'g'])
  expect(lefter['h']['a']).toStrictEqual(['b', 'c', 'd', 'e', 'f', 'g'].reverse())

  expect(king_side['g4']['h4']).toStrictEqual([])
  expect(queen_side['h4']['g4']).toStrictEqual([])


  expect(forward['g4']['g8']).toStrictEqual(['g5', 'g6', 'g7'])

  expect(fwd_que['g4']['c8']).toStrictEqual(['f5', 'e6', 'd7'])

  expect(fwd2_que['c4']).toStrictEqual('b6')
  expect(fwd2_kng['c4']).toStrictEqual('d6')
  expect(fwd_que2['c4']).toStrictEqual('a5')
  expect(fwd_kng2['c4']).toStrictEqual('e5')
})

