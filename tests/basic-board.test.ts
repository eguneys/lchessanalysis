import { Board } from '../src'


it('should drop pieces', async () => {

  let board = Board.from_pieses([])


  board.in('wr@a1')
  board.in('bq@a2')

  expect(board.pieses)
  .toStrictEqual(['wr@a1', 'bq@a2'])


  board.out('a1')

  expect(board.pieses.length).toBe(1)

  board.in('wp@c2')

  expect(board.fen).toBe('8/8/8/8/8/8/q1P5/8')


  expect(Board.from_fen(board.fen).fen).toBe(board.fen)
})
