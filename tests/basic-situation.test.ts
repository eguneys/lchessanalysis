import { MobileSituation } from '../src'


it.skip('should mobile_situation', () => {

  let situation = MobileSituation.from_fen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')

  expect(situation.ods.length).toBe(20)
})
