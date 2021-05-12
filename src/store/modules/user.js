import { getToken, setToken, setExpiresIn, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    uid:'',
    name: '',
    avatar: '',
    roles: [],
    role:'',
    permissions: []
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_EXPIRES_IN: (state, time) => {
      state.expires_in = time
    },
    SET_UID: (state, uid) => {
        state.uid = uid
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    }
  },

  actions: {
    // 登录
    Login({ commit, state }, userInfo) {
      let param = {
          username:userInfo.username.trim(),
          password:userInfo.password,
          captcha:userInfo.code
      };
      //
      return new Promise((resolve, reject) => {
        _.getApi('login.login',param,{
          onComplete:(response) => {
            let data = response.data;
            let res = {access_token:data.token,expires_in:360000};
            setToken(res.access_token)
            commit('SET_TOKEN', res.access_token)
            setExpiresIn(res.expires_in)
            commit('SET_EXPIRES_IN', res.expires_in)
            resolve()
          }
        })
        .catch((e) => {
            reject(e);
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        _.getApi('login.info',state.token,{
          onComplete:res=> {
              const data = res.data;
              _.routers = _.permissionsConvert(data.menu);
              const user = data;
              const avatar = _.isNil(user.avatar) ? require("@/assets/image/profile.jpg") : process.env.VUE_APP_BASE_API + user.avatar;
              if (data.roleName) {
                  commit('SET_ROLES', [data.roleName])
                  commit('SET_PERMISSIONS', _.routers)
              } else {
                  commit('SET_ROLES', ['ROLE_DEFAULT'])
              }
              commit('SET_UID', data.userid)
              commit('SET_NAME', data.username)
              commit('SET_AVATAR', avatar)
              resolve(res)
          }
        }).catch(error => {
            //reject(error)
            throw Error(error)
        })
      })
    },

    // 刷新token
    RefreshToken({commit, state}) {
      return new Promise((resolve, reject) => {
        _.getApi('login.refreshToken').then(res => {
          setExpiresIn(res.data)
          commit('SET_EXPIRES_IN', res.data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        _.getApi('login.logout').then(({data}) => {
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            commit('SET_PERMISSIONS', [])
            removeToken()
            resolve()
        }).catch(error => {
            reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        removeToken()
        commit('SET_TOKEN', '')
        resolve()
      })
    }
  }
}

export default user
