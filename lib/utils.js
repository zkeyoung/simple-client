function isString(value) {
    return typeof value === 'string';
}

function isNumber(value) {
    return typeof value === 'number';
}

function isObject(value) {
    return Object.prototype.toString.call(value) === '[object Object]';
}

function isFunction(value) {
    return typeof value === 'function';
}

function isBoolean(value) {
    return typeof value === 'boolean';
}

function exist(value) {
    return value != null;
}

function isHttpProtocol(value) {
    return value == 'http:';
}

function isMapValue(map, value) {
    for (let m in map) {
        if (map.hasOwnProperty(m) && map[m] === value) {
            return true;
        }
    }
    return false;
}

function isEmpty(value) {
    if (!exist(value)) { return true; }
    if (Array.isArray(value) || isObject(value) || isString(value)) {
        for (let ele in value) {
            if (value.hasOwnProperty(ele)) {
                return false;
            } 
        }
        return true;
    } else {
        return false;
    }
}

/**
 * 合并对象，其他属性覆盖相同名称覆盖
 * @param  {...object} args 
 * @returns
 */
function merge(...args) {
    let result = {};
    args.forEach(object => {
        if (!isObject(object)) return;
        for (let key in object) {
            if (!object.hasOwnProperty(key)) continue;
            if (!isObject(object[key]) || !exist(result[key])) {
                result[key] = object[key];
                continue;
            }
            result[key] = merge(result[key], object[key]);
        }
    });
    return result;
}

module.exports = {
    isString,
    isNumber,
    exist,
    isEmpty,
    isHttpProtocol,
    isObject,
    isFunction,
    isMapValue,
    isBoolean,
    merge,
};