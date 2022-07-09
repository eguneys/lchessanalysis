import { left, lefter, right, righter, king_side, queen_side, forward, backward } from '../src'


it('should find right', async () => {

  expect(righter['a']['h']).toStrictEqual(['b', 'c', 'd', 'e', 'f', 'g'])
  expect(lefter['h']['a']).toStrictEqual(['b', 'c', 'd', 'e', 'f', 'g'].reverse())

  expect(king_side['g4']['h4']).toStrictEqual([])
  expect(queen_side['h4']['g4']).toStrictEqual([])


  expect(forward['g4']['g8']).toStrictEqual(['g5', 'g6', 'g7'])
})
