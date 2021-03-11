const http = require('http');
const https = require('https');
const querystring = require('querystring');
const URL = require('url').URL;
const utils = require('./utils');

exports.request = request;

/**
 * 发送一个请求
 * @param {string} method - 请求方法
 * @param {string} url 请求地址
 * @param {object} option
 * @param {object} option.data 请求体
 * @param {number} option.timeout
 * @param {string} option.encoding 默认utf8
 * @param {boolean} option.keepAlive
 * @param {number} option.keepAliveTimeout
 */
function request(method, url, option = {}, callback) {
    if (utils.isFunction(option)) {
        [callback, option] = [option, {}];
    }

    const urlInfo = new URL(url);

    if (method === 'GET' && !utils.isEmpty(option.data)) {
        const searchParams = option.data;
        for (let key in searchParams) {
            if (!searchParams.hasOwnProperty(key)) continue;
            urlInfo.searchParams.set(key, searchParams[key]);
        }
        option.data = undefined;
    }

    const dataString = JSON.stringify(option.data) || '';

    // default https
    let httpClient = https, defaltPort = 443;
    // default timeout 5s
    let defaultTimeout = 5 * 1000;
    // default headers
    let defaultHeaders = {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(dataString)
    };
    // default encoding
    let defaultEncoding = 'utf8';
    // default keepAlive
    let defaultKeepAlive = false;

    // http
    if (utils.isHttpProtocol) {
        httpClient = http, defaltPort = 80;
    }

    const port = utils.isEmpty(urlInfo.port) ? defaltPort : urlInfo.port;
    const path = urlInfo.pathname + urlInfo.search;
    const headers = utils.merge(defaultHeaders, option.headers);
    const timeout = utils.isNumber(option.timeout) ? option.timeout : defaultTimeout;
    const encoding = utils.isString(option.encoding) ? option.encoding : defaultEncoding;
    const keepAlive = utils.isBoolean(option.keepAlive) ? option.keepAlive : defaultKeepAlive;
    const keepAliveTimeout = utils.isNumber(option.keepAliveTimeout) ? keepAliveTimeout : undefined;
    const agent = new http.Agent({
        keepAlive: keepAlive,
        timeout: option.keepAliveTimeout,
    });
    const reqOption = {
        hostname: urlInfo.hostname,
        port: port,
        path: path,
        method: method,
        headers: headers,
        timeout: timeout,
        agent: agent,
    };
    const request = httpClient.request(reqOption, (reponse) => {
        let recive = Buffer.alloc(0);
        reponse.on('data', (chunk) => {
            recive = Buffer.concat([recive, chunk], recive.length + chunk.length);
        });
        reponse.on('end', () => {
            let result = {
                statusCode: reponse.statusCode,
                statusMessage: reponse.statusMessage,
                data: recive.toString(encoding)
            };
            try {
                let jsonData = JSON.parse(result.data);
                result.data = jsonData;
            } catch (err) {}
            return callback(null, result);
        });
    });
    request.on('timeout', () => {
        request.destroy();
    });
    request.on('error', error => {
        return callback(error, null);
    });
    request.write(dataString);
    request.end();
}