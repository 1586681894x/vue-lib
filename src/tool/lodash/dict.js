import request from '@/utils/request'
//
let loadDict = (type)=>{
    return new Promise((resolve)=>{
        if('role' === type){
            _.getApi('role.list','',{
                onComplete:(res)=>{
                    resolve(res.rows.map((v)=>{return {k:v.name,v:v.id}}));
                }
            })
        }else if('dept' === type){
            _.getApi('dept.list','',{
                onComplete:(res)=>{
                    resolve(res.rows.map((v)=>{return {k:v.name,v:v.id}}));
                }
            })
        }else{
            console.warn(`Not find dict ( ${type} ) ! `)
            // request({ url: '/system/dict/data/type/' + type, method: 'get' }).then((res)=>{
            //     if(res.data){
            //         cacheResult.set(type,res.data.map((v)=>{return {k:v.dictLabel,v:v.dictValue}}));
            //         resolve(cacheResult.get(type));
            //     }
            // })
        }
    })
}
let cacheResult = (()=>{
    let map = {
        '_user_type':[{k:'操作员',v:'0'},{k:'管理员',v:'1'}],
        '_dept_status':[{k:'有效',v:'valid'},{k:'无效',v:'invalid'}],
        '_menu_type':[{k:'目录',v:'MENU'},{k:'菜单',v:'URL'},{k:'按钮',v:'FUNCTION'}],
        '_member_children':[{k:'无',v:'0'},{k:'一个',v:'1'},{k:'二个',v:'2'},{k:'三个',v:'3'},{k:'三个以上',v:'4'}],
        '_member_education':[{"k":"小学","v":"0"},{"k":"中学","v":"1"},{"k":"大专","v":"2"},{"k":"本科","v":"3"},{"k":"硕士","v":"4"},{"k":"博士","v":"5"},{"k":"其他","v":"6"}],
        '_member_income':[{"k":"3000以下","v":"0"},{"k":"3000-5000(含)","v":"1"},{"k":"5000-10000(含)","v":"2"},{"k":"10000-20000(含)","v":"3"},{"k":"20000-50000","v":"4"},{"k":"50000以上","v":"5"}],
        '_member_rent':[{k:'租房',v:'0'},{k:'自有',v:'1'},{k:'其他',v:'2'}],
        '_member_enterprise_type':[{"k":"个体","v":"0"},{"k":"企业","v":"1"}],
        //
        '_show_status':[{k:'显示',v:'0'},{k:'隐藏',v:'1'}],
        '_disable_status':[{k:'启用',v:'1'},{k:'停用',v:'0'}],
        '_yes_status':[{k:'是',v:'yes'},{k:'否',v:'no'}],
        '_ok_status':[{k:'是',v:'1'},{k:'否',v:'0'}]
    }
    //
    return {
        getValue(type,id){
            let item = (map[type]||[]).filter((v)=>{return v.v == id})
            return item.length>0 ? item[0]['k'] : "";
        },
        get(type){
            return map[type];
        },
        set(type,result){
            map[type] = result;
        },
        select(type,value,fun) {
            let list = cacheResult.get(type);
            let callback = (res)=>{
                if(_.isNil(value)){
                    return fun(res)
                }else{
                    return fun(_.find(res,{v:value}));
                }
            }
            //
            if(!list){
                loadDict(type).then((data)=>{
                    callback(data)
                })
            } else {
                return callback(list)
            }
        }
    }
})()

// getTxt(['xxx','xxx'])
// getTxt('xxx','id',(label)=>{})
export function getTxt(arr,o1,o2){
    //console.log(arr,o1,o2);
    if(typeof o1 == 'function'){
        o2 = o1;
        o1 = null;
    }
    o2 || (o2 = (val)=>{return val});
    //
    let isInit = typeof arr === 'object';
    if(isInit){
        arr.forEach((type)=>{
            let options = this.options || (this.options = {})
            cacheResult.select(type,null,(list)=>{
                Object.assign(options,{[type]:list})
            })
        })
    }else{
        return cacheResult.select(arr,o1,o2);
    }
}

// data : { allType:{key:text} }
export function setDict(prefix,data){
    _.keys(data).forEach((dataKey)=>{
        let item = data[dataKey];
        if(item && /^all/.test(dataKey)){
            let dictName = dataKey.replace(/^all/,prefix)//.replace(/[A-Z]/g,(r)=>{ return `_${r.toLowerCase()}` });
            if(cacheResult.get(dictName)){
                return;
            }
            //
            let dict = _.keys(item).map((key)=>{
                return {
                    k:item[key],
                    v:key
                }
            })
            cacheResult.set(dictName,dict);
        }
    })
}
