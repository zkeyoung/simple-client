## simple-client
simple client for http request

## 环境
* node: 10.18.0
* npm: 6.13.4

## 安装
```bash
$ npm install simple-client
```

## 快速开始
```js
const simpleClient = require('simple-client');
simpleClient.get('https://www.baidu.com/').then(data => {
    // data => { statusCode, statusMessage, data }
    console.log(data);
}).catch(error => {
    console.log(error);
});
```
## API
* simpleClient.get(url, option)
* simpleClient.post(url, option)
* simpleClient.put(url, option)
* simpleClient.patch(url, option)
* simpleClient.delete(url, option)

## 参数说明
```js
/*
 * @param {object} option.data 请求体
 * @param {number} option.timeout 请求超时时间
 * @param {string} option.encoding 响应data编码默认utf8
 * @param {boolean} option.keepAlive
 * @param {number} option.keepAliveTimeout 
 * /
```

## 尾言
如果对您有帮助，请给个star。^_^

## License
[MIT](LICENSE)