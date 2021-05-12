import CMTable from './table'

const path = require('path')
const files = require.context('./columns', false, /\.vue$/)
const modules = {}
files.keys().forEach(key => {
const name = path.basename(key, '.vue') // 提取出用 ‘/' 隔开的path的最后一部分,path.basename(p, [ext])。 p要处理的path,ext要过滤的字符
  modules['Column'+name] = files(key).default || files(key)
})


export default (Vue)=>{
  for(let key in modules){// PS: 把列也暴露出去
    Vue.component(key,modules[key]);
  }
  //
  Vue.component("CMTable",CMTable);
}

