<template>
  <el-form-item :label="opt.text" :prop="opt.name" v-if="!opt.hide" size="mini">
    <el-date-picker clearable size="mini" style="width:100%" unlink-panels
            v-model="data[opt.name]"
            :type="opt.props.type"
            :value-format="opt.format"
            :placeholder="opt.placeholder"
            :picker-options="opt.options"
            :range-separator="opt.rangeSeparator"
            :start-placeholder="opt.startPlaceholder"
            :end-placeholder="opt.endPlaceholder"
            v-bind="opt.props"
            @blur="onBlur(data,column)"
            @change="onChange(data,column)"
    >
    </el-date-picker>
  </el-form-item>
</template>

<script>
let Log = ()=>{};

export default {
  name: "FormDate",
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
        hide:false,
        props:{
          type:'date'
        },
        placeholder:'',
        rangeSeparator:'至',
        startPlaceholder:'开始日期',
        endPlaceholder:'结束日期',
        format:"yyyy-MM-dd",
        options:{

        }
      }
    }
  },
  created(){
    this.initColumn();
    this.column.$this = this;
    this.onChange = this.column.onChange||Log;
    this.onBlur = _.debounce(this.column.onBlur||Log,600)
  },
  methods:{
    initColumn(){
      // 默认值
      if(!this.column.format){
        this.column.format = (this.column.props||{}).type == 'datetime' ? 'yyyy-MM-dd HH:mm:ss' : "yyyy-MM-dd";
      }
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
