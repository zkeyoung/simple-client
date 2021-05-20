const client = require('./lib/client');
const util = require('util');
const utils = require('./lib/utils');
const request = util.promisify(client.request);

module.exports = new SimpleClient();

function SimpleClient() {}

['get', 'post', 'put', 'patch', 'delete'].forEach(method => {
    /**
     * @param {string} url 请求地址
     * @param {object} option
     * @param {object} option.query url参数
     * @param {object} option.data 请求数据体
     * @param {number} option.timeout
     * @param {string} option.encoding 默认utf8 响应数据data
     * @param {object} option.headers
     * @param {boolean} option.keepAlive
     * @param {number} option.keepAliveTimeout
     * @param {object} log
     * @param {boolean} logOn 开启日志
     * @return {Promise} { statusCode: number, statusMessage: string, data: object | stirng }
     */
    SimpleClient.prototype[method] = function (url, option) {
        checkInput(url, option);
        return request(method.toUpperCase(), url, option);
    }
});


function checkInput(url, option = {}) {
    try {
        new URL(url)
    } catch (err) {
        throw new TypeError('url is illegal, expect URL');
    }
    if (!utils.isObject(option)) {
        throw new TypeError('option expect object');
    }

    if (utils.exist(option.timeout)) {
        checkTimeout('timeout', option.timeout);
    }

    if (utils.exist(option.encoding) && !Buffer.isEncoding(option.encoding)) {
        throw new TypeError('encoding is illegal');
    }

    if (utils.exist(option.headers) && !utils.isObject(option.headers)) {
        throw new TypeError('headers expect object');
    }

    if (utils.exist(option.keepAlive) && !utils.isBoolean(option.keepAlive)) {
        throw new TypeError('keepAlive expect boolean');
    }

    if (utils.exist(option.keepAliveTimeout)) {
        checkTimeout('keepAliveTimeout', option.timeout);
    }
}

function checkTimeout(filed, timeout) {
    if (!utils.isNumber(timeout) || timeout < 0) {
        throw new TypeError(`${filed} is illegal, expect number and lt 0s`);
    }
}