<template>
  <el-form-item :label="opt.text" :prop="opt.name" v-if="!opt.hide" size="mini">
    <treeselect v-model="data[opt.name]" size="mini"
        :options="opt.options"
        :show-count="true"
        :placeholder="opt.props.disabled?'':opt.placeholder"
        v-bind="opt.props"
        />
  </el-form-item>
</template>

<script>
    import { ColumnOptions } from '../formAC'
    import Treeselect from "@riophae/vue-treeselect";
    import "@riophae/vue-treeselect/dist/vue-treeselect.css";

    let Log = ()=>{};

    export default {
        name: "FormTreeselect",
        components:{
            Treeselect
        },
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
                    options:[],
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
            ColumnOptions(this);
            this.column.$this = this;
        },
        methods:{
            setOpt(conf){
                Object.assign(this.opt,conf);
                conf.value !== void 0 && (this.setValue(conf.value));
            },
            setValue(val){
                this.data[this.opt.name] = this.opt.formatter(val);
            }
        }
    }
</script>

<style scoped>
  .vue-treeselect input{
    height:28px;
  }
</style>
