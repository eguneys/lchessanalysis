export type GMap<A extends string, B> = Record<A, B>

export const g_filter = <A extends string, B>(fs: GMap<A, B>, fn: (key: A, value: B) => boolean): Array<A> => {
  let _res = []
  for (let key in fs) {
    if (fn(key, fs[key])) {
      _res.push(key)
    }
  }
  return _res
}

export const g_find = <A extends string, B>(fs: GMap<A, B>, fn: (key: A, value: B) => boolean): A | undefined => {
  for (let key in fs) {
    if (fn(key, fs[key])) {
      return key
    }
  }
}

export const g_map = <A extends string, B, C>(fs: GMap<A, B>, fn: (key: A, value: B) => C): GMap<A, C> => {
  let res: any = {}
  for (let key in fs) {
    let _res = fn(key, fs[key])
    if (_res) {
      res[key] = _res
    }
  }
  return res
}

export type FMap<A extends string> = Record<A, A>
export type SMap<A extends string> = Record<A, A | undefined>
export type AsMap<A extends string> = Record<A, Array<A>>
export type AAsMap<A extends string> = Record<A, AsMap<A>>

export const gen_fmap = <A extends string>(fs: Readonly<Array<A>>): FMap<A> => {
  let res: any = {}
  fs.forEach(_ => res[_] = _)
  return res
}
