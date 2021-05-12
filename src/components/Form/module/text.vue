<template>
  <el-form-item :class="`form_text ${opt.clz}`" :label="opt.text" size="mini">
    <div class="text" v-html="opt._value"></div>
  </el-form-item>
</template>

<script>

export default {
    name: "FormText",
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
          clz:'',
          _value:''
        }
      }
    },
    created(){
      _.extend(this.opt,this.column)
      this.column.$this = this;
      //
      let options = this.column.options;
      if(typeof options === 'string'){
        this.getLabel = (val,callback)=>{
          callback(this.getTxt(options,val)?.k)
        }
      }else if(options){
        this.getLabel = options
      }
    },
    methods:{
      setOpt(conf){
        Object.assign(this.opt,conf);
        conf.value !== void 0 && (this.setValue(conf.value));
      },
      setValue(val){// 值直接放到当前组件里
        this.getLabel(val,(data)=>{
          this.opt._value = data;
        })
      },
      getLabel(val,callback){
        callback(val)
      }
    }
}
</script>
