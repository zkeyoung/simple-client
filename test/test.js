const httpClient = require('../index');

httpClient.get('https://www.baidu.com/').then(data => {
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