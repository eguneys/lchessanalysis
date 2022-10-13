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




export const a_map = <A extends string, C>(fs: Array<A>, fn: (key: A) => C): GMap<A, C> => {
  let res: any = {}
  fs.forEach(key => {
    let _res = fn(key)
    if (_res) {
      res[key] = _res
    }
  })
  return res
}


export const a_map2 = <A extends string, B extends string, C>(fs: Readonly<Array<A>>, fn: (key: A) => [B, C] | undefined): GMap<B, C> => {
  let res: any = {}
  fs.forEach(key => {
    let _res = fn(key)
    if (_res) {
      res[_res[0]] = _res[1]
    }
  })
  return res
}


