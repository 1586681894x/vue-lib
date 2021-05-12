import axios from "axios";
import modules from '@/api';
import _ from 'lodash';
import store from '@/store'
import { Notification, MessageBox, Message } from 'element-ui';

const TIPS = _.debounce((opt)=>{
    Message(opt)
},400)

const ajax = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 100000
})

const msgMap = {
    '401':"用户未授权，请联系管理员！",
    '403':'拒绝访问',
    '404':'请求地址出错',
    '408':'请求超时',
    '500':'服务器内部错误',
    '501':'服务未实现',
    '502':'网关错误',
    '503':'服务不可用',
    '504':'网关超时',
    '505':'HTTP版本不受支持',
}


ajax.interceptors.request.use(
    (config) => {
        return config
    },
    (error) => {
        return Promise.reject(error);
    }
);

ajax.interceptors.response.use(
    (response) => {
        // 未设置状态码则默认成功状态
        let res = response.data.code !== void 0 ? response.data : {data:response.data,code:200,success:true};
        let msg = res.message;
        if (res.code === '401') {
            MessageBox.confirm(
                '登录状态已过期，您可以继续留在该页面，或者重新登录',
                '系统提示',
                {
                    confirmButtonText: '重新登录',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            ).then(() => {
                store.dispatch('LogOut').then(() => {
                    window.location.reload() // 为了重新实例化vue-router对象 避免bug
                })
            })
            return;
        }else if (!res.success) {
            TIPS({ message: msg, type: 'error' })
            return Promise.reject(res)
        } else {
            return res;
        }
    },
    (error) => {
        let status = error.response.status, msg = msgMap[status];
        if(msg){
            TIPS({ message: msg, type: 'error' })
        }else{
            console.log("ajax error ：", error);
        }
    }
);


export default ajax;

// ajaxbox
export function ApiBox(prefix){
    this.prefix = prefix;
    //
    this.getConf = function(opt = {}){
        opt.url = this.prefix + opt.url;
        opt.method = opt.method || 'post';
        // 特殊处理：extend
        if(['post'].indexOf(opt.method)>-1 && opt.data){
            opt.data = new FormData().setForm(opt.data);
            opt.headers = {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"}
        }
        //
        return opt;
    }

    // -查询所以列表
    this.listAll = (query = {}) => {
        return ajax(this.getConf({url:'/listAllJson',data:query}))
    }
    // -查询列表
    this.list = (query = {}) => {
        if(query.pageNum){// TODO 特殊处理
            query.page = query.pageNum;
            query.rows = query.pageSize;
        }
        return ajax(this.getConf({url:'/listJson',data:_.omit(query,['pageNum','pageSize'])}))
    }
    // -查询详细
    this.info = (id)=>{
        return ajax(this.getConf({url:'/showJson',method:'get',params:{id:id}}))
    }
    // -新增
    this.add = (data)=>{
        return ajax(this.getConf({url:'/saveJson',data:data}))
    }
    // -修改
    this.edit = (data)=>{
        return ajax(this.getConf({url:'/updateJson',data:data}))
    }
    // -删除
    this.del = (id)=>{
        return ajax(this.getConf({url:'/deleteJson',data:{id:id}}))
    }
}


// api
export function Api(name,param,options){
    let option = options || this.options || (this.options = {});
    let request = _.get(modules,name);
    if(!request){
        console.warn(`API:${name} not found!`)
        return;
    }
    //
    return new Promise((res,rej)=>{
        option.loading = true;
        request(param).then((response)=>{
            if(response === void 0){
                return;
            }
            //
            option.loading = false;
            let result = response;
            option.onComplete && option.onComplete(result);
            option.dictPrefix && result.data && _.setDict(option.dictPrefix,result.data);
            option.data = result.entity || result.rows;
            option.total =  result.pageNo ? result.total : 0;
            _.delay(()=>{ res(option) });
        },(e)=>{
            option.loading = false;
            rej(e);
        })
    })
}

