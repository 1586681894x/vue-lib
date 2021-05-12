<template>
  <el-form ref="form" :model="form"
           :label-width="labelWidth"
           :inline="inline"
           v-loading="loading"
           v-bind="$attrs"
           :rules="rules">
    <el-row>
      <el-col v-for="column in columns" :span="column.size || size || 8.5">
        <slot v-if="column.template" :name="column.template" :column="column" :row="form" />
        <!-- component -->
        <component
          v-else
          :rules="rules"
          :column="column"
          :data="form"
          :is="`CM${ column.type || 'label' }`"
        />
      </el-col>
    </el-row>
  </el-form>
</template>

<script>

const path = require('path')
const files = require.context('./module', false, /\.vue$/)
const modules = {}
files.keys().forEach(key => {
  const name = path.basename(key, '.vue') // 提取出用 ‘/' 隔开的path的最后一部分,path.basename(p, [ext])。 p要处理的path,ext要过滤的字符
  modules['CM'+name] = files(key).default || files(key)
})

const props = {
    span: {
        type: [Number],
        default: 8
    },
    columns:{
        type: [Array,Object],
        default: []
    },
    // rules:{
    //     type: Object,
    //     default: {}
    // },
    size:{
        default: 8
    },
    labelWidth:{
        type: String,
        default: '8.5vw'
    },
    inline:{
        type: [Boolean],
        default: false
    },
    loading:{
        type: [Boolean],
        default: false
    },
}

export default {
    name: "Form",
    components:modules,
    props: props,
    data() {
        let form = {};
        let rules = this.$attrs.rules || {};
        this.columns.map((v)=>{
          if(v.name){
            _.extend(v,{
                prop:v.prop||v.name,
                placeholder:v.placeholder||`请输入${v.text}`,
                value: v.value || (v.type === 'checkbox' ? [] : v.value )
            })
            form[v.name] = v.value;
          }
        })
        //
        return {
          form:form,
          rules:rules,
          map:{},
        }
    },
    created(){
      window.form = this;
    },
    methods:{
      getData(isNew){
        return _.extend(isNew ? {} : this.map,this.form);
      },
      setColumn(map){
        this.columns.map((v)=>{
          let item = map[v.name];
          if(_.isNil(item)){
            //
          }else if(typeof item === 'object'){
            v.$this.setOpt(item)
          }
        })
        return this;
      },
      setData(map){// {name:{options}}
        if(!map){return;}
        //
        this.map = map;
        this.columns.map((v)=>{
          if(_.isNil(v.name)){return;}
          //
          let item = _.result(map,v.name1||v.name);
          if(_.isNil(item)){
            //
          }else if(_.isObject(item) && !_.isArray(item)){
            v.$this.setOpt(item)
          }else{
            v.$this.setValue(item)
          }
        })
        return this;
      },
      setRules(map){
        this.$refs.form.clearValidate();
        if(typeof map === 'function'){// TS ：数据集form默认值来自"column.value" 。但异步数据加载完之后无默认值则添加部分默认值（select组件）
          Object.assign(this.$refs.form.rules,map(this.form));
        }else{
          Object.assign(this.$refs.form.rules,map);
        }
        return this;
      },
      resetForm(){
        this.$refs.form.resetFields();
        this.columns.map((v)=>{// TODO 做$watch?
          if(['file','select','upload'].indexOf(v.type)>-1){
            v.$this.setValue(v.value)
          }
        })
        return this;
      },
      validate(){
        return new Promise((res,rej)=>{
          this.$refs.form.validate((valid, valData) => {
            if (valid) {
              res(_.extend(this.map,this.form));
            }else{// 提示
              for(let key in valData){
                console.warn((valData[key][0]||{}).message);
                break;
              }
            }
          });
        })
      },
      clearValidate(){
        this.$refs.form.clearValidate();
        return this;
      }
    }
}
</script>


<style lang="scss">

  .form_inline{
    .el-form-item{
      margin-bottom:.6rem;
      display:flex;
      flex-direction: row;
      .el-form-item__label,.el-form-item__content{
        box-sizing:border-box;
        -webkit-overflow-scrolling: touch;
      }
      .el-form-item__label{
        width:auto !important;
        padding:0;
      }
      .el-form-item__content{
        margin-left:0 !important;
        padding:0 10px;
      }
    }

    .el-row .el-col{
      width:auto;
    }
  }

  .form_mini{
      .el-form-item{
          margin-bottom:.6rem;
      }
  }

  .form_text_small .form_text{
    margin-bottom:1rem;
    padding-bottom:0;

    .form_text .el-form-item__content{
      margin-left:0 !important;
    }
  }
</style>
