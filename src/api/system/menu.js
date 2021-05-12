import ajax , { ApiBox } from '@/utils/request';

class Api extends ApiBox{
    // 获取路由
    routers(){
        return ajax({
            url: '/system/menu/getRouters',
            method: 'get'
        })
    }

    // 权限资源树
    treeByRole(id){
        return ajax({
            url: `/manage/system/role/getAllResourceNode`,
            method: 'get',
            params:{roleId:id}
        })
    }
}

export default new Api(`/manage/system/resource`);

