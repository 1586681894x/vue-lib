<template>
  <el-form-item class="form_checkbox" :label="opt.text" :prop="opt.prop" v-if="!opt.hide" size="mini">
    <el-checkbox-group v-model="data[opt.name]"
                       size="mini"
                       v-bind="opt.props"
                       @change="(val)=>{ onChange(data,column) }">
      <el-checkbox
        v-for="option in opt.options"
        :key="option[opt.optionsValue]"
        :label="option[opt.optionsValue]"
        :disabled="option.disabled"
      >
        {{option[opt.optionsLabel]+''}}
      </el-checkbox>
    </el-checkbox-group>
  </el-form-item>
</template>

<script>
let Log = ()=>{};

export default {
  name: "FormCheckbox",
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
          disabled:false
        },
        hide:false,
        placeholder:'',
        hasNull:false,
        options:[],
        optionsLabel:'k',
        optionsValue:'v'
      }
    }
  },
  created(){
    _.extend(this.opt,this.column);
    this.column.$this = this;
    this.onChange = this.column.onChange||Log;
    this.initColumn();
  },
  methods:{
    initColumn(){
      let column = this.column;
      let optionFn = column.options;
      let optionValue = (list)=>{
        this.opt.options = list;
        //
        let nowValue = this.data[column.name] || column.value;
        if(_.isNil(nowValue) && list.length){
          column.value = list[0][this.opt.optionsValue]; // TODO ：select自动默认第一个
        }else{
          //
        }
        this.setValue(nowValue);
      }
      //
      if(typeof optionFn === 'string'){// 自加载
        this.getTxt(optionFn,(data)=>{
          optionValue(data||[]);
        })
      }else if(typeof optionFn === 'function'){
        optionFn((data)=>{ optionValue(data) })
      }else{
        optionValue(optionFn);
      }
    },
    setOpt(conf){
      Object.assign(this.opt,conf);
      conf.value !== void 0 && (this.setValue(conf.value));
    },
    setValue(val){
      this.$set(this.data,this.opt.name,val || [])
    },
    //
    onChange(){},
    onBlur(){},
    onKeyup(){}
  }
}
</script>

<style scoped>
  .form_checkbox{text-align: left;}
</style>
