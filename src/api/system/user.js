import ajax , { ApiBox } from '@/utils/request';

class Api extends ApiBox{
    // 详情
    show(data) {
        return ajax({
            url: '/manage/system/user/showJson1',
            method: 'get'
        })
    }
    // 用户密码重置
    updatePwd(data) {
        return ajax({
            url: '/manage/system/user/changePassword',
            method: 'post',
            data: new FormData().setForm(data)
        })
    }
    // 用户头像上传
    uploadAvatar(data) {
        return ajax({
            url: '/system/user/profile/avatar',
            method: 'post',
            data: data
        })
    }
}

export default new Api(`/manage/system/user`);
