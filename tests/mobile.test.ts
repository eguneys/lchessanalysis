import { MobileRay, Board } from '../src'

it ('should capture_ray', () => {

  let board = Board.from_pieses(['wr@f2', 'bk@c2'])
  let mr = new MobileRay(board)

  expect(mr.capture_ray('f2')['c2'].slice(1)).toStrictEqual(['wr', 'bk'])

})


it ('should mobile_pawn', () => {

  let board = Board.from_pieses(['wp@f2'])
  let mr = new MobileRay(board)

  expect(mr.mobile_pawn('f2')['f4']).toBeDefined()

})

it('should mobile_ray', () => {

  let board = Board.from_pieses(['wr@f2'])
  let mr = new MobileRay(board)

  expect(mr.mobile_ray('f2')['e2']).toBeDefined()

  board.in('bk@f7')

  expect(mr.mobile_ray('f2')['e2']).toBeDefined()

  expect(mr.mobile_ray('f2')['f8']).toBeUndefined()

})
