import { FlatTree, MobileSituation, TreeBuilder, Node, initial_fen } from '../src'


it('tree', () => {


  let root = TreeBuilder.apply(MobileSituation.from_fen(initial_fen), 'e2e4 d7d5 g1f3 g7f6'.split(' '))


  expect(FlatTree.apply(root)[1].length).toBe(3)

  expect(FlatTree.apply(FlatTree.read(FlatTree.apply(root)))).toStrictEqual(FlatTree.apply(root))

  console.log(root.lines)
})
