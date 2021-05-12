const fs = require('fs')
const path = require('path')
const Mock = require('mockjs')
const JSON5 = require('json5')

// 读取json文件
function getJsonFile(filePath) {
    // 读取指定json文件
    const json = fs.readFileSync(path.resolve(__dirname,filePath),'utf-8');
    // 解析并返回
    return JSON5.parse(json)
}

function createUrl(app){
    return (url,type)=>{
        // app /manage/system/info
        app.get(`/dev-api${url}`,function(rep,res){
            //Mock.mock(getJsonFile(url))
            let path = url.replace(/\/manage\/system/,'.');// 替换默认请求前缀 /manage/system/
            if('mock' === type){
                res.json(Mock.mock(getJsonFile( path + '.mock')));
            }else{
                res.json(getJsonFile(path + '.json'));
            }
        })
    }
}


// 返回一个函数
module.exports = function(app){
    if(process.env.MOCK == 'true') {
        let cr = createUrl(app);
        //
        //cr('/manage/system/info');
    }
}
