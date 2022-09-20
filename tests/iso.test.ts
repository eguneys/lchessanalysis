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

const play_one_move_match = (i, _) => {
  let { fen, moves } = _
  let [move0, ..._moves] = moves.split(' ')

  let s = MobileSituation.from_fen(fen).od(move0)[0]
  let iso = IsoSituation.from_fen(s.fen)
  return match_idea(iso, s, i)[0]
}

it.skip('castles bug', () => {
  let fen = '6rk/3R3p/4P2r/1p3p2/p7/P1P5/1P3RpK/4Q3 w - - 1 42'
  let move0 = 'h2g1'

  let _ = MobileSituation.from_fen(fen).od(move0)
  console.log(_[0].fen)
})

it.only('should q K', () => {
  let _ = {
    "id": "019yp",
    "fen": "5r1k/p1q3pp/2p1Q1p1/8/8/5RN1/P1P3P1/6K1 b - - 1 26",
    "moves": "f8f3 e6e8 f3f8 e8f8",
    "tags": "endgame mate mateIn2 short",
    "link": "https://lichess.org/gLC1NwZX/black#52"
  }

  let i = [['q', 'f', 'K']]

  let res = play_one_move_match(i, _)
})

it.skip('should q B', () => {
  let _ = {
    "id": "00Ec4",
    "fen": "2rq1r1k/p5pp/8/1p1BpPb1/2Pp2Q1/P2P2R1/6PP/R5K1 b - - 3 25",
    "moves": "c8c7 g4g5 d8g5 g3g5",
    "tags": "crushing middlegame short",
    "link": "https://lichess.org/HUFGdjKK/black#50"
  }

  let i = [['q', 'B']]


  let res = play_one_move_match(i, _)

})


it('should filter puzzles', () => {


  let i = [
    ['Q', 'R', 'p'],
  ]

  let _ = puzzles.filter(_ => play_one_move_match(i, _))


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

