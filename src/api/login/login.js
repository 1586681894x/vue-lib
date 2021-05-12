import request from '@/utils/request'

// 登录方法
export function login(param) {
    return request({
        headers:{
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        method: 'post',
        url: '/manage/login',
        data: new FormData().setForm(param)
    })
}

// 刷新方法
export function refreshToken() {
    return request({
        url: '/auth/token/refresh',
        method: 'post'
    })
}

// 获取用户详细信息
export function info() {
    return request({
        url: '/manage/system/info',
        method: 'get'
    })
}

// 退出方法
export function logout() {
    return request({
        url: '/manage/logout',
        method: 'post'
    })
}

// 获取路由
export const routers = () => {
    return request({
        url: '/system/menu/getRouters',
        method: 'get'
    })
}
