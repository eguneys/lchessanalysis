import { match_idea, MobileSituation, IsoSituation } from '../src';
import { puzzles_csv } from './_fixtures';
const s_fen = fen => MobileSituation.from_fen(fen);
function playMoves(situation, moves) {
    let move = moves.shift();
    if (move) {
        return playMoves(situation.od(move)[0], moves);
    }
    return situation;
}
let puzzles = puzzles_csv.split('\n').map(_ => {
    let [id, fen, moves, , , , , tags, link] = _.split(',');
    return {
        id,
        fen,
        moves,
        tags,
        link
    };
});
const play_one_move_match = (i, _) => {
    let { fen, moves } = _;
    let [move0, ..._moves] = moves.split(' ');
    let s = MobileSituation.from_fen(fen).od(move0)[0];
    let iso = IsoSituation.from_fen(s.fen);
    return match_idea(iso, s, i);
};
const match_fen = (i, fen) => {
    let s = MobileSituation.from_fen(fen);
    let iso = IsoSituation.from_fen(s.fen);
    return match_idea(iso, s, i);
};
const moves_for_match_fen = (i, fen) => {
    let _ = match_fen(i, fen);
    return _.map(_ => _[i[0][0]] + _[i[0][1]]);
};
let skips = [
    [['r', 'K']],
    [['q', 'K']]
];
const match_story = (zeroes, ones, fen) => {
    return zeroes.flatMap(zero => {
        let moves = moves_for_match_fen(zero, fen);
        return moves.filter(move => {
            let fen1 = playMoves(s_fen(fen), [move]).fen;
            return skips.filter(skip => moves_for_match_fen(skip, fen1).length > 0).length === 0;
        }).flatMap(move => {
            let fen1 = playMoves(s_fen(fen), [move]).fen;
            return ones.flatMap(one => {
                let moves2 = moves_for_match_fen(one, fen1);
                return moves2.filter(move => {
                    let _fen1 = playMoves(s_fen(fen1), [move]).fen;
                    return skips.filter(skip => moves_for_match_fen(skip, _fen1).length > 0).length === 0;
                }).map(move2 => {
                    let fen2 = playMoves(s_fen(fen1), [move2]).fen;
                    return [move, move2, ...match_story(zeroes, ones, fen2)];
                });
            });
        });
    });
};
it.only('seek ideas2', () => {
    let p = {
        "id": "00Rdf",
        "fen": "2kr4/p1pr1pp1/1p4p1/1PP1P3/3B1PP1/PQ2Pn1P/2KRR3/5q2 w - - 1 30",
        "moves": "c5b6 d7d4 e3d4 f3d4 c2b2 d4b3",
        "tags": "advantage exposedKing fork long middlegame",
        "link": "https://lichess.org/1DyqIpsd#59"
    };
    let fen = p.fen, move0 = p.moves.split(' ')[0];
    let fen1 = playMoves(MobileSituation.from_fen(fen), [move0]).fen;
    let zeroes = [
        ['r', 'B'],
        ['R', 'B'],
        ['R', 'R2'],
        ['q', 'R2', 'R'],
        ['R', 'K'],
        ['n', 'B', 'Q'],
        ['n', 'B', 'K'],
        ['P', 'B'],
    ];
    let _ = match_fen(zeroes, fen1);
    console.log(_);
});
it('seek ideas', () => {
    let p = {
        "id": "00Rdf",
        "fen": "2kr4/p1pr1pp1/1p4p1/1PP1P3/3B1PP1/PQ2Pn1P/2KRR3/5q2 w - - 1 30",
        "moves": "c5b6 d7d4 e3d4 f3d4 c2b2 d4b3",
        "tags": "advantage exposedKing fork long middlegame",
        "link": "https://lichess.org/1DyqIpsd#59"
    };
    let fen = p.fen, move0 = p.moves.split(' ')[0];
    let fen1 = playMoves(MobileSituation.from_fen(fen), [move0]).fen;
    let n0 = [['n', 'f0', 'K'], ['n', 'f0', 'Q']];
    let r0 = [['r', 'B']];
    let p1_r0 = [['p', 'R']];
    let p1_n0 = [['p', 'N']];
    let n0_p1_r0 = n0;
    let r1_r0 = [['r', 'R']];
    let q0_p1_r0 = [['q', 'R', 'K']];
    let q0_r1_n0_p1_r0 = q0_p1_r0;
    let r1_qX = [['r', 'Q']];
    let k1_f0 = [['k', 'f0']];
    let zeroes = [n0, r0, n0_p1_r0, q0_p1_r0];
    let ones = [p1_n0, k1_f0, p1_r0, r1_r0, r1_qX];
    let n_ = match_fen(n0, fen1);
    //console.log(n_)
    let s_ = match_story(zeroes, ones, fen1);
    console.log(s_);
});
it('match unique', () => {
    let t4 = test('r5k1/p4pp1/6qp/1p6/5R2/3r1Q2/PbPB2PP/7K w - - 0 30', [
        ['q', 'f0'],
        ['q', 'f1']
    ]);
    console.log(t4);
});
it('should iso', () => {
    test('rn2kb1r/ppp1pppp/5n1q/3p2b1/3P4/1N2Q3/PPPBPPPP/RN2KB1R w KQkq - 3 3', [
        ['b', 'q', 'B'],
        ['q', 'B'],
        ['Q', 'B']
    ]);
    test('r1b2rk1/pp3ppp/3q4/3N4/3n1B1R/1Q1B1Nn1/PP3PPP/3R2K1 w - - 0 17', [
        ['b', 'f', 'K'],
        ['r', 'b', 'N']
    ]);
    test('5r2/1p1bppkp/p2p2p1/q1rP2Q1/8/3P1N1P/PP3PP1/1R3RK1 w - - 1 18', [
        ['Q', 'R', 'p', 'q'],
        ['p', 'f', 'Q'],
        ['p', 'f', 'R'],
        ['n', 'q']
    ]);
    let t4 = test('r5k1/p4pp1/6qp/1p6/5R2/3r1Q2/PbPB2PP/7K w - - 0 30', [
        ['q', 'R', 'K'],
        ['q', 'R2'],
        ['p', 'R2']
    ]);
    console.log(t4);
});
function test(fen, i) {
    let s = MobileSituation.from_fen(fen);
    let iso = IsoSituation.from_fen(fen);
    return match_idea(iso, s, i);
}
