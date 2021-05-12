import './tool/index' // tool
import './permission' // permission control
import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import './assets/styles/element-variables.scss'
import '@/assets/styles/index.scss' // global css
import '@/assets/styles/ruoyi.scss' // ruoyi css
import '@/assets/styles/imagePreview.scss' // imagePreview css

import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import Element from 'element-ui'
import Cookies from 'js-cookie'
import GlobalCM from './components/Global/index'
import permission from './directive/permission'
import duplicate from './directive/duplicate'
import tableHeight from './directive/attrs/tableHeight'

Vue.use(GlobalCM)
Vue.use(permission)
Vue.use(duplicate)
Vue.use(tableHeight)

Vue.use(Element, {
    size: Cookies.get('size') || 'medium' // set element-ui default size
})

Vue.config.silent = false;
Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
