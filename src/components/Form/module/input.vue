<template>
  <el-form-item :label="opt.text" :prop="opt.name" v-if="!opt.hide" size="mini">
    <el-input v-model="data[opt.name]" size="mini"
      :type="opt.props.type"
      :name="opt.name"
      :placeholder="opt.props.disabled?'':opt.placeholder"
      v-bind="opt.props"
      @blur="onBlur(data,column)"
      @change="onChange(data,column)"
      @keyup.enter.native="onKeyup(data,column)"
    />
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
                        type:'text',
                        disabled:false
                    },
                    hide:false,
                    placeholder:'',
                    formatter:(v)=>{return v}
                }
            }
        },
        created(){
            _.extend(this.opt,this.column)
            this.column.$this = this;
            this.onBlur = _.debounce(this.column.onBlur||Log,600);
            this.onChange = this.column.onChange||Log;
            this.onKeyup = this.column.onKeyup||Log;
        },
        methods:{
            setOpt(conf){
                Object.assign(this.opt,conf);
                conf.value !== void 0 && (this.setValue(conf.value));
            },
            setValue(val){
                this.data[this.opt.name] = this.opt.formatter(val);
            },
            //
            onChange(){},
            onBlur(){},
            onKeyup(){}
        }
    }
</script>
