import ajax , { ApiBox } from '@/utils/request';
import moment from 'moment';

class Api extends ApiBox{
    // 获取验证码
    code() {
        return ajax({
            url: '/jcaptcha.jpg',
            method: 'get'
        })
    }
    // 用户密码重置
    updatePwd(data) {
        return ajax({
            url: '/manage/system/changePassword',
            method: 'post',
            data: new FormData().setForm(data)
        })
    }
    // 文件上传
    updateFile(file) {
        const data = new FormData();
        data.append("uploadFile", file);
        data.append("fileName", file.name);
        data.append("timestamp", moment().format('YYYY-MM-DD hh:mm:ss'));
        return ajax({
            url: '/ofile/upload',
            method: 'post',
            data: data
        })
    }
}

export default new Api(`/manage/system/user`);
