import Vue from 'vue'
import _ from 'lodash'
import { Api } from '@/utils/request'
import { download } from '@/utils/request'
import { checkPermi } from "@/utils/permission";
//图片预览工具
import ImagePreview from "@/utils/imagePreview.js";

// ----------- common function --------------
Vue.prototype.download = download;
Vue.prototype.checkPermi = checkPermi
Vue.prototype.imagePreview = new ImagePreview('.img_preview', {ratio: 0.8, scale: { min: 1, max: 9, ratio: 0.5 }});
Vue.prototype.getTxt = function(...args){ return _.getTxt.call(this,...args) };
Vue.prototype.api = Api;

// format
Vue.prototype.format = {
    dict:function(name,dictKey){
        let key = `_${name}`;
        return (row)=>{
            let val = row[name];
            if(_.isNil(row[key]) && !_.isNil(val)){
                row[key] = _.getTxt(dictKey,val+'')?.k;
            }
            return row[key];
        }
    },
    money:function(name){
        return (row)=>{
            return Number(row[name]).formatMoney()
        }
    },
    time:function(name = 'createTime',format = 'yyyy-MM-DD'){
        return (row)=>{
            return row[name] ? new Date(row[name].replace(/\-/g,'/')).format(format) : '';
        }
    }
}

// action
Vue.prototype.actions = function(action){// params 默认动作
  let params = this.$route.params;
  Object.keys(params).forEach((key)=>{
    if(key.indexOf('on')!=0){ return }
    //
    if(action[key]){
      let value = decodeURI(decodeURIComponent(params[key]));
      if(/\{.*\}/.test(value)){
        action[key](_.attempt(JSON.parse.bind(null, value)));
      }else{
        action[key](value);
      }
    }
    //
    delete params[key];
  })
}

