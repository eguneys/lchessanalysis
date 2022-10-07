export const arr_map2 = (arr, fn) => {
    let res = {};
    arr.forEach(key => {
        let _res = fn(key);
        if (_res) {
            res[_res[0]] = _res[1];
        }
    });
    return res;
};
export const arr_map = (arr, fn) => {
    let res = {};
    arr.forEach(key => {
        let _res = fn(key);
        if (_res) {
            res[key] = _res;
        }
    });
    return res;
};
export const obj_map = (obj, fn) => {
    let res = {};
    Object.keys(obj).forEach(key => {
        let _res = fn(key, obj[key]);
        if (_res) {
            res[key] = _res;
        }
    });
    return res;
};
