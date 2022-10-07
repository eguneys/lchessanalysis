export const arr_map2 = (arr: Array<any>, fn: any) => {
  let res = {}
  arr.forEach(key => {
    let _res = fn(key)
    if (_res) {
      res[_res[0]] = _res[1]
    }
  })
  return res
}



export const arr_map = (arr: Array<any>, fn: any) => {
  let res = {}
  arr.forEach(key => {
    let _res = fn(key)
    if (_res) {
      res[key] = _res
    }
  })
  return res
}

export const obj_map = (obj: any, fn: any) => {
  let res = {}
  Object.keys(obj).forEach(key => {
    let _res = fn(key, obj[key])
    if (_res) {
      res[key] = _res
    }
  })
  return res
}


