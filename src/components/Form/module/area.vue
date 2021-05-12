<template>
  <el-form-item :label="opt.text" v-if="!opt.hide" size="mini">
    <el-cascader
            ref="area"
        style="width: 100%;"
        size="mini"
        :options="options"
        v-model="data[opt.name]"
        @change="addressChange" >
    </el-cascader>
  </el-form-item>
</template>

<script>
import { regionData,CodeToText,TextToCode } from 'element-china-area-data';
import { ColumnOptions } from '../formAC'

let props = {
    column: {
        type:[Object,Array],
        default:{}
    },
    data:{
        type:[Object,Array],
        default:{}
    }
};

export default {
  name: "FormArea",
  props: props,
  data(){
    return {
      options:regionData,
      opt: {
          name:'',
          text:'',
          prop:''
      }
    }
  },
  created(){window.TextToCode = TextToCode;
      ColumnOptions(this);
      this.column.$this = this;
      this.addressChange = _.debounce(this.addressChange,500)
  },
  methods:{
    setOpt(conf){
      Object.assign(this.opt,conf);
      conf.value !== void 0 && (this.setValue(conf.value));
    },
    setValue(val){
      this.data[this.opt.name] = val;
    },
    setText(arr){
        let res = [], item = TextToCode[arr[0]],item2 = {},item3 = {};
        if(item){
            res.push(item.code);
            item2 = item[arr[1]];
            if(item2){
                res.push(item2.code);
                item3 = item2[arr[2]];
                if(item3){
                    res.push(item3.code);
                }
            }
        }
        this.setValue(res);
    },
    addressChange(arr) {
      // console.log(CodeToText[arr[0]], CodeToText[arr[1]], CodeToText[arr[2]]);
      let opt = this.opt;
      if(opt.onOptions){
          opt.onOptions([
              {k:arr[0],v:CodeToText[arr[0]]},
              {k:arr[1],v:CodeToText[arr[1]]},
              {k:arr[2],v:CodeToText[arr[2]]},
          ],this.data)
      }
    }
  }
}
</script>

<style scoped>
</style>
