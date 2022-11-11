import { ods, uci_char } from '../src'
import { MobileSituation, Replay } from '../src'
import { initial_fen } from '../src'

it('should play moves', () => {

  let replay = Replay.from_ucis('e2e4')

  replay.play_ucis(replay.root.path, 'd7d5 e4d5 f7f6')

  expect(replay.replay).toBe(['EG_separator_{e2e4 }',
                             'EGB@_separator_{d7d5 }',
                             'EGB@G@_separator_{e4d5 }',
                             'EGB@G@RQ_separator_{f7f6 }'].join('\n'))

  expect(Replay.from_replay(replay.replay).replay).toBe(replay.replay)
})

it('should replay', () => {


  let replay = Replay.from_ucis('e2e4')

  expect(replay.replay).toBe('EG_separator_{e2e4 }')

  replay.move('EG', 'd7d5', { comment: 'hello' })

  expect(replay.replay).toBe('EG_separator_{e2e4 }\nEGB@_separator_{d7d5 hello}')

})

