import { MobileSituation } from '../src'

it('knight move', () => {

  let situation = MobileSituation.from_fen('8/8/8/8/8/8/5P2/8 w - - 0 1')

  expect(situation.ods.length).toBe(2)
})

it.only('should mobile_situation', () => {

  let situation = MobileSituation.from_fen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')

  expect(situation.ods.length).toBe(20)
})
