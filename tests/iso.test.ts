import { match_idea, Idea, MobileSituation, IsoSituation } from '../src'

it('should iso', () => {

  const i: Idea = [
    ['b', 'q', 'B'],
    ['q', 'B'],
    ['Q', 'B']
  ]


  const i2: Idea = [
    ['r', 'b', 'Q'],
    ['b', 'f', 'K']
  ]

  let fen = 'rn2kb1r/ppp1pppp/5n1q/3p2b1/3P4/1N2Q3/PPPBPPPP/RN2KB1R w KQkq - 3 3'
  let s = MobileSituation.from_fen(fen)
  let iso = IsoSituation.from_fen(fen)


  console.log(match_idea(iso, s, i))

})
