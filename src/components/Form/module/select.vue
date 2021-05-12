<template>
  <el-form-item :label="opt.text" :prop="opt.name" v-if="!opt.hide" size="mini">
    <el-select v-model="data[opt.name]" style="width: 100%;"  size="mini"
               :placeholder="opt.props.disabled?'':opt.placeholder"
               v-bind="opt.props"
               :clearable="true"
               @change="setValueMap"
    >
      <el-option label="请选择..." v-if="opt.hasNull"></el-option>
      <el-option v-for="option in opt.options"
         :key="option[opt.optionsValue]"
         :label="option[opt.optionsLabel]"
         :value="option[opt.optionsValue]+''"
      />
    </el-select>
  </el-form-item>
</template>

<script>
import { ColumnOptions } from '../formAC'

let Log = ()=>{};
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
  name: "FormSelect",
  props: props,
  data(){
    return {
      opt: {
          name:'',
          text:'',
          prop:'',
          props:{
              disabled:false
          },
          hide:false,
          placeholder:'',
          hasNull:false,
          options:[],
          optionsLabel:'k',
          optionsValue:'v',
          formatter:(val)=>{
              if(this.opt.props.multiple){
                return val || [];
              }else{
                return val + '';
              }
          }
      }
    }
  },
  created(){
      ColumnOptions(this);
      this.column.$this = this;
      this.onChange = this.opt.onChange||Log;
      this.onOptions = _.debounce(this.opt.onOptions||Log,400)
  },
  methods:{
    setOpt(conf){
      Object.assign(this.opt,conf);
      conf.value !== void 0 && (this.setValue(conf.value));
    },
    setValue(val = ''){
      this.data[this.opt.name] = this.opt.formatter(val);
    },
    setValueMap(val){
      let opt = this.opt, values = opt.props.multiple ? val : [val];
      this.opt.onChange && this.onChange(val);
      this.opt.onOptions && this.onOptions(opt.options.filter((v)=>{
          return values.indexOf(v.dictValue+'')>-1
      }),this.data)
    }
  }
}
</script>

<style scoped>
</style>
