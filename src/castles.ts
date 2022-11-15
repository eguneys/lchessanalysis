import { CastlesFen } from './fen'
export const castles = ['k', 'q', 'K', 'Q'] as const

export class Castles {

  static from_fen = (fen: CastlesFen) => {
    let K = fen.match('K') !== null
    let Q = fen.match('Q') !== null
    let k = fen.match('k') !== null
    let q = fen.match('q') !== null

    return new Castles(K, Q, k, q) 
  }

  get(_castles: typeof castles[number]) {
    switch (_castles) {
      case 'k': return this.k
      case 'q': return this.q
      case 'K': return this.K
      case 'Q': return this.Q
    }
  }

  get fen() {
    let res = ''
    if (this.K) { res += 'K' }
    if (this.Q) { res += 'Q' }
    if (this.k) { res += 'k' }
    if (this.q) { res += 'q' }
    return res
  }

  constructor(
    readonly K: boolean,
    readonly Q: boolean,
    readonly k: boolean,
    readonly q: boolean) {}
}
