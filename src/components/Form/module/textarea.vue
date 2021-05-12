<template>
  <el-form-item :class="opt.clz" :label="opt.text" :prop="opt.name" size="mini">
    <el-input v-model="data[opt.name]" :placeholder="opt.props.disabled?'':opt.placeholder"  size="mini"
              type="textarea"
              v-bind="opt.props"
              @blur="onBlur(data,column)"
              @change="onChange(data,column)"/>
  </el-form-item>
</template>

<script>
let Log = ()=>{};

export default {
  name: "FormInput",
  props: {
    column: {
      type:[Object,Array],
      default:{}
    },
    data:{
      type:[Object,Array],
      default:{}
    }
  },
  data(){
    return {
      opt:{
        name:'',
        text:'',
        prop:'',
        props:{
          disabled:false,
          rows:2
        },
        placeholder:'',
      }
    }
  },
  created(){
    this.column.$this = this;
    this.onChange = this.column.onChange||Log;
    this.onBlur = _.debounce(this.column.onBlur||Log,600)
    this.initColumn();
  },
  methods:{
    initColumn(){
      _.extend(this.opt,this.column)
    },
    setOpt(conf){
      Object.assign(this.opt,conf);
      conf.value !== void 0 && (this.setValue(conf.value));
    },
    setValue(val){
      this.data[this.opt.name] = val;
    },
    //
    onChange(){},
    onBlur(){},
  }
}
</script>

<style scoped>
</style>
