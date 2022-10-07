import { ods, uci_char } from '../src';
import { Replay } from '../src';
import { initial_fen } from '../src';
it('should play moves', () => {
    let replay = Replay.from_fen(initial_fen);
    replay.play_ucis('e2e4 d7d5 e4d5 f7f6');
    expect(replay.replay).toBe(initial_fen.slice(0, -11) + '\n\nEG\nEGB@\nEGB@G@\nEGB@G@RQ');
});
it('should replay', () => {
    let replay = Replay.from_fen('8/8/8/8/8/8/8/8 w - - 0 1');
    expect(replay.replay).toBe('8/8/8/8/8/8/8/8 w\n\n');
    replay.move('', 'e2e4');
    expect(replay.replay).toBe('8/8/8/8/8/8/8/8 w\n\nEG');
    replay.move('EG', 'd7d5', { comment: 'hello' });
    expect(replay.replay).toBe('8/8/8/8/8/8/8/8 w\n\nEG\nEGB@\nEGB@___{hello}');
});
it('should uci char', () => {
    let all_pairs = ods.map(_ => uci_char(_));
    expect(uci_char('e2e4')).toBe('EG');
    expect(new Set(all_pairs).size).toBe(ods.length);
    expect(all_pairs.find(_ => _ === String.fromCharCode(33))).toBeUndefined();
    expect(uci_char('a1b1')).toBe('$,');
    expect(uci_char('a1a2')).toBe('$%');
    expect(uci_char('h7h8')).toBe('bc');
    expect(uci_char('b7b8=q')).toBe('2c');
    expect(uci_char('b7c8=q')).toBe('2d');
    expect(uci_char('b7c8=n')).toBe('2l');
    expect(uci_char('b7b8=r')).toBe('2s');
});
