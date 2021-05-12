import ajax , { ApiBox } from '@/utils/request';

class Api extends ApiBox{
    listTree(){
        return ajax({
            url:'/manage/module/security/org/listTree'
        })
    }
}

export default new Api(`/manage/module/security/org`);
