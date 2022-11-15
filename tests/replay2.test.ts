import { Replay, initial_fen } from '../src'


it('replay from position', () => {

  let fen = "8/rnbqkbnr/pppppppp/8/8/PPPPPPPP/RNBQKBNR/8 w - - 0 1"
  //let moves = "d4 d5 Nf4 Nf5 g4 g5 gxf5 exf5"
  let moves = "d3d4 d6d5 g2f4 g7f5 g3g4 g6g5 g4f5 e6f5".split(' ')

  let [init, games] = Replay.game_move_while_valid(moves, fen)

  expect(games.length).toBe(8)


})


it('bongcloud', () => {
  let [init, games] = Replay.game_move_while_valid(['e2e4', 'e7e5', 'e1e2'], initial_fen)

  expect(init.fen).toBe("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq")
  expect(games.map(_ => _[0].fen)).toStrictEqual([
    "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq",
    "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq",
    "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPPKPPP/RNBQ1BNR b KQkq"])
})
