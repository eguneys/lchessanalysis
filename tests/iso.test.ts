import { match_idea, Idea, MobileSituation, IsoSituation } from '../src'
import { puzzles_csv } from './_fixtures'


let puzzles = puzzles_csv.split('\n').map(_ => {
  let [id,fen,moves,,,,,tags,link] = _.split(',')
  return {
    id,
    fen,
    moves,
    tags,
    link
  }
})


it.skip('castles bug', () => {
  let fen = '6rk/3R3p/4P2r/1p3p2/p7/P1P5/1P3RpK/4Q3 w - - 1 42'
  let move0 = 'h2g1'

  let _ = MobileSituation.from_fen(fen).od(move0)
  console.log(_[0].fen)
})


it.only('should filter puzzles', () => {


  let i = [
    ['Q', 'R', 'p'],
  ]

  let _ = puzzles.filter(_ => {
    let { fen, moves } = _
    let [move0, ..._moves] = moves.split(' ')

    let s = MobileSituation.from_fen(fen).od(move0)[0]
    let iso = IsoSituation.from_fen(s.fen)
    return match_idea(iso, s, i)[1]
  })


  console.log(_)

})

it('should iso', () => {


  test('rn2kb1r/ppp1pppp/5n1q/3p2b1/3P4/1N2Q3/PPPBPPPP/RN2KB1R w KQkq - 3 3',
       [
         ['b', 'q', 'B'],
         ['q', 'B'],
         ['Q', 'B']
       ])

  test('r1b2rk1/pp3ppp/3q4/3N4/3n1B1R/1Q1B1Nn1/PP3PPP/3R2K1 w - - 0 17',
       [
         ['b', 'f', 'K'],
         ['r', 'b', 'N']
       ])

  test('5r2/1p1bppkp/p2p2p1/q1rP2Q1/8/3P1N1P/PP3PP1/1R3RK1 w - - 1 18',
       [
         ['Q', 'R', 'p', 'q'],
         ['p', 'f', 'Q'],
         ['p', 'f', 'R'],
         ['n', 'q']
       ])

  let t4 = test('r5k1/p4pp1/6qp/1p6/5R2/3r1Q2/PbPB2PP/7K w - - 0 30', [
    ['q', 'R', 'K'],
    ['q', 'R2'],
    ['p', 'R2']
  ])

  console.log(t4)

})

function test(fen, i) {
  let s = MobileSituation.from_fen(fen)
  let iso = IsoSituation.from_fen(fen)
  return match_idea(iso, s, i)
}

