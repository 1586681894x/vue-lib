import ajax , { ApiBox } from '@/utils/request';

class Api extends ApiBox{
    // profile
    setting(data){
        return ajax({
            url: '/manage/component/member/memberProfile/updateJson',
            method: 'post',
            data:new FormData().setForm(_.omit(data,['parentId']))
        })
    }

    // contact
    contact(data){
        return ajax({
            url: '/manage/component/member/memberContact/updateJson',
            method: 'post',
            data:new FormData().setForm(_.omit(data,['parentId']))
        })
    }
}

export default new Api(`/manage/component/member/member`);
