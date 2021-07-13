/**
 * Merge deep right from ramda
 * @see https://github.com/ramda/ramda
 */
export function mergeDeepRight(lObj: any, rObj: any) {
  return mergeDeepWithKey(
    function (k: any, lVal: any, rVal: any) {
      return rVal;
    },
    lObj,
    rObj
  );
}

function mergeDeepWithKey(fn: any, lObj: any, rObj: any) {
  return mergeWithKey(
    function (k: any, lVal: any, rVal: any) {
      if (_isObject(lVal) && _isObject(rVal)) {
        return mergeDeepWithKey(fn, lVal, rVal);
      } else {
        return fn(k, lVal, rVal);
      }
    },
    lObj,
    rObj
  );
}

function _isObject(x: any) {
  return Object.prototype.toString.call(x) === '[object Object]';
}

function mergeWithKey(fn: any, l: any, r: any) {
  const result: any = {};
  let k;

  for (k in l) {
    if (_has(k, l)) {
      result[k] = _has(k, r) ? fn(k, l[k], r[k]) : l[k];
    }
  }

  for (k in r) {
    if (_has(k, r) && !_has(k, result)) {
      result[k] = r[k];
    }
  }

  return result;
}

function _has(prop: any, obj: any) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
