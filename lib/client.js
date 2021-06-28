const http = require('http');
const https = require('https');
const URL = require('url').URL;
const utils = require('./utils');

exports.request = request;

/**
 * 发送一个请求
 * @param {string} method - 请求方法
 * @param {string} url 请求地址
 * @param {object} option
 * @param {object} option.query url参数
 * @param {object} option.body 请求体
 * @param {number} option.timeout
 * @param {string} option.encoding 默认utf8
 * @param {boolean} option.keepAlive
 * @param {number} option.keepAliveTimeout
 * @param {object} log
 * @param {boolean} logOn 开启日志
 */
function request(method, url, option = {}, callback) {
    if (utils.isFunction(option)) {
        [callback, option] = [option, {}];
    }
    const data =  Buffer.isBuffer(option.body) ? option.body : Buffer.from(JSON.stringify(option.body) || '');

    const LOG_ON = typeof FULL_LOG === 'boolean' || option.logOn;
    let log, seq; 
    if (LOG_ON) {
        log = option.log || console;
        seq = Math.random() * 1000 | 0;
        log.info(`[${seq}]request:${method} ${url} with query ${JSON.stringify(option.query) || ''} and body ${data}`);
    }

    const urlInfo = new URL(url);

    if (!utils.isEmpty(option.query)) {
        const searchParams = option.query;
        for (let key in searchParams) {
            if (!searchParams.hasOwnProperty(key)) continue;
            urlInfo.searchParams.set(key, searchParams[key]);
        }
    }

    // default https
    let httpClient = https, defaltPort = 443;
    // default timeout 5s
    let defaultTimeout = 5 * 1000;
    // default headers
    let defaultHeaders = {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
    };
    // default encoding
    let defaultEncoding = 'utf8';
    // default keepAlive
    let defaultKeepAlive = false;

    // http
    if (utils.isHttpProtocol(urlInfo.protocol)) {
        httpClient = http, defaltPort = 80;
    }

    const port = utils.isEmpty(urlInfo.port) ? defaltPort : urlInfo.port;
    const path = urlInfo.pathname + urlInfo.search;
    const headers = utils.merge(defaultHeaders, option.headers);
    const timeout = utils.isNumber(option.timeout) ? option.timeout : defaultTimeout;
    const encoding = utils.isString(option.encoding) ? option.encoding : defaultEncoding;
    const keepAlive = utils.isBoolean(option.keepAlive) ? option.keepAlive : defaultKeepAlive;
    const keepAliveTimeout = utils.isNumber(option.keepAliveTimeout) ? keepAliveTimeout : undefined;
    const raw = utils.isBoolean(option.raw) ? option.raw : false;
    const agent = new httpClient.Agent({
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
                data: recive
            };
            try {
                if (!raw) result.data = JSON.parse(result.data.toString(encoding));
            } catch (err) {}
            if (LOG_ON) {
                log.info(`[${seq}]response:${JSON.stringify(result)}`);
            }
            return callback(null, result);
        });
    });
    request.on('timeout', () => {
        request.destroy();
    });
    request.on('error', error => {
        return callback(error, null);
    });
    request.write(data);
    request.end();
}