import { Board } from '../src'


it('should drop pieces', async () => {

  let board = Board.from_pieses([])


  board.in('wr@a1')
  board.in('bq@a2')

  expect(board.pieses)
  .toStrictEqual(['wr@a1', 'bq@a2'])
})

