<template>
  <el-form-item class="form_switch fl-middle" :prop="opt.name" v-if="!opt.hide" size="mini">
    <el-switch
      style="display: block"
      v-model="data[opt.name]"
      :active-text="opt.text"
      :inactive-text="opt.text2"
      v-bind="opt.props">
    </el-switch>
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
        text2:'',
        prop:'',
        props:{
          type:'text',
          disabled:false
        },
        hide:false,
      }
    }
  },
  created(){
    this.column.$this = this;
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
      this.data[this.opt.name] = val != 0;
    },
    //
    onChange(){},
    onBlur(){},
    onKeyup(){}
  }
}
</script>

<style scoped>
  .form_switch{height:37px;}
</style>
