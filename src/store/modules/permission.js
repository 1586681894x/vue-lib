import { constantRoutes } from '@/router'
import Layout from '@/layout/index'
import AppContent from '@/layout/components/AppContent'

const permission = {
  state: {
    routes: [],
    addRoutes: []
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes
      state.routes = constantRoutes.concat(routes)
    }
  },
  actions: {
    // 生成路由
    GenerateRoutes({ commit }) {
      return new Promise(resolve => {
          // 向后端请求路由数据
          const accessedRoutes = filterAsyncRouter(_.routers);
          accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
          commit('SET_ROUTES', accessedRoutes)
          resolve(accessedRoutes)
      })
    }
  }
}

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap) {
  return asyncRouterMap.filter(route => {
    // if(route.component=='undefined'){
    //   console.log(route);
    //   return false;
    // }
    if (route.component) {
      // Layout组件特殊处理
      if (route.component === 'Layout') {
        route.component = Layout
      } else if(route.component === 'Content'){
        route.component = AppContent;
      } else{
        route.component = loadView(route.component)
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children)
    }
    //
    return route.component
  })
}

export const loadView = (view) => { // 路由懒加载
  return (resolve) =>  require([`@/views${view}`], resolve)
}

export default permission
