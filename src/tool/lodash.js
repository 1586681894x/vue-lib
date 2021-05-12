import Vue from 'vue'
import _ from 'lodash'
import Rules from './lodash/rules'
import { getTxt,setDict } from './lodash/dict'
import './extend';
import './message';
import { Api } from '@/utils/request'

Vue.prototype._ = _;

_.getRules = Rules.get;
_.getTxt = getTxt;
_.setDict = setDict;
_.getUid = ()=>{ return (((1+Math.random())*0x10000000)|0).toString(16) }
_.getApi = Api;

// lodash extend
_.isRole = function(name){
  let res = false, state = _.$store.getters;
  if('bank'===name && state.roles?.indexOf('bank_user')>-1){
    res = true;
  }else if('channel'===name && state.roles?.indexOf('channel_user')>-1){
    res = true;
  }
  return res;
}

// motion
_.motionNumber = (data,name,value)=>{
  if(data[name] == value){return;}
  //
  window.TweenLite.to(data,.4,{
    [name]:value,
    ease:Power0.easeNone,
    startAt:{
      [name]:0
    }
  })
}

_.mapDeep = (arr,callback)=>{
    arr.map((v)=>{
        callback(v)
        if(v.children){
            _.mapDeep(v.children,callback)
        }
    })
}


/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 * @param {*} rootId 根Id 默认 0
 */
_.handleTree = function(data, id, parentId, children, rootId){
    id = id || 'id'
    parentId = parentId || 'parentId'
    children = children || 'children'
    rootId = rootId || Math.min.apply(Math, data.map(item => { return item[parentId] })) || 0
    //对源数据深度克隆
    const cloneData = JSON.parse(JSON.stringify(data))
    //循环所有项
    const treeData = cloneData.filter(father => {
        let branchArr = cloneData.filter(child => {
            //返回每一项的子级数组
            return father[id] === child[parentId]
        });
        branchArr.length > 0 ? father.children = branchArr : '';
        //返回第一层
        return father[parentId] === rootId;
    });
    return treeData != '' ? treeData : data;
}

//
function convert(v){
    v.value || (v.value = '');
    v.showMode || (v.showMode = '1');
    v.path || (v.path = '');
    if(v.path.indexOf('/')>-1){
        return {
            name: v.path.replace(/\//g,'_'),
            path: v.path==='Layout' ? v.name : v.path,
            redirect:v.showMode === '1' ? v.value : '',
            component:v.path,
            hidden:v.showState == '1',
            meta:{
                title:v.name,
                icon:v.icon
            }
        }
    }else{
        return {
            name: v.path + v.id,
            path: v.name,
            redirect:'',
            component:v.path,
            hidden:v.showState == '1',
            meta:{
                title:v.name,
                icon:v.icon
            }
        }
    }
}
function convertList(arr){
    return arr.map((v)=>{
        let one = convert(v);
        if(v.children?.length){
            one.children = convertList(v.children)
        }
        return one;
    })
}
_.permissionsConvert = (arr)=>{
    return convertList(arr)
    //return []
}
