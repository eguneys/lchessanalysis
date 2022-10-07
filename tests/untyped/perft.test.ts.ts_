import { MobileSituation } from '../src'

function perft(situation: MobileSituation, depth: number) {
  if (depth > 0) {
    situation.ods.fold((p, move) =>
      p + perft(situation.od(move)[0], depth - 1), 0)
  } else {
    return 1
  }
}

function playMoves(situation: MobileSituation, moves: Array<OD>) {
  let move = moves.shift()

  if (move) {
    return playMoves(situation.od(move)[0], moves)
  } else {
    return situation
  }
}

function runOne() {
  let situation = MobileSituation.from_fen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')

  return playMoves(situation, [
    'e2e4',
    'd7d5',
    'e4d5',
    'd8d5',
    'b1c3',
    'd5a5',
    'd2d4',
    'c7c6',
    'g1f3',
    'c8g4',
    'c1f4',
    'e7e6',
    'h2h3',
    'g4f3',
    'd1f3',
    'f8b4',
    'f1e2',
    'b8d7',
    'a2a3',
    'e8c8',
    'a3b4',
    'a5a1',
    'e1d2',
    'a1h1',
    'f3c6',
    'b7c6',
    'e2a6'
  ])
}

let nb = 100
let iterations = 10
const run = () => {
  for (let i = 0; i < nb; i++) { runOne() }
}

it.skip('should playing a game', () => {
  runOne()


  if (nb * iterations > 1) {
    console.log('warming up')
    run()
  }

  console.log('running tests')
  let durations = []
  for (let i = 0; i < iterations; i++) {
    let start = Date.now()
    run()
    let duration = Date.now() - start
    console.log(`${nb} games in ${duration} ms`)
    durations.push(duration)
  }

  let nbGames = iterations * nb
  let moveMicros = (1000 * durations.reduce((a, b) => a + b)) / nbGames
  console.log(`Average = ${moveMicros} microseconds per game`)
  console.log(`${1000000/moveMicros} games per second`)
})

it('should calculate standard chess perfts', () => {
})
