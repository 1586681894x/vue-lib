import ajax , { ApiBox } from '@/utils/request';

class Api extends ApiBox{
    // cert
    verify(data){
        return ajax({
            url: '/manage/component/member/memberPersonal/verify',
            method: 'post',
            data:new FormData().setForm(data)
        })
    }
}

export default new Api(`/manage/component/member/memberPersonal`);
