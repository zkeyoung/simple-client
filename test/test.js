const httpClient = require('../index');
global.FULL_LOG=true;
global.LOG = {info: msg => console.log(msg)};
httpClient.get('https://www.baidu.com/').then(data => {
    console.log(data);
}).catch(error => {
    console.log(error);
});

httpClient.get('http://localhost:8080/health', { body: {name: 'zhangsan', age: 18}, query: { app: 'simple-client' } }).then(data => {
    console.log(data);
}).catch(error => {
    console.log(error);
});

/* const data = {
    name: 'zhangsan',
    age: 18
};
const headers = {
    'customize': 'customize'
};
const timeout = 3000; // 3s

httpClient.post('http://localhost:8080/xxxx', { data: data, headers, timeout}).then(data => {
    console.log(data);
}).catch(error => {
    console.log(error);
}); */