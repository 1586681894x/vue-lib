<template>
  <el-form-item :label="opt.text" :prop="opt.name" v-if="!opt.hide" size="mini">
    <el-upload class="upload_file"
               action="#"
               :show-file-list="false"
               :before-upload="onBefore"
               :on-preview="onPreview"
               :http-request="upload" v-bind="opt.props">
      <div v-if="data[opt.name]" class="img_box" style="" :style="`background-image:url(${root + data[opt.name]})`">
        <div class="fl-center"><i class="iconfont iconxiugai"/></div>
      </div>
      <el-button v-else :disabled="opt.props.disabled" type="primary" plain icon="el-icon-upload" circle size="mini" ></el-button>
    </el-upload>
    <span v-if="data[opt.name]" @click="onPreview" class="color_link">查看</span>
  </el-form-item>
</template>

<script>

    export default {
        name: "FormFile",
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
            console.log(process.env)
            return {
                root:process.env.VUE_APP_ROOT,
                opt:{
                    name:'',
                    text:'',
                    prop:'',
                    fileSize:3, // M
                    limit:1,
                    loading:false,
                    props:{
                        accept:'',
                        disabled:false
                    }
                }
            }
        },
        created(){
            this.initColumn();
            this.column.$this = this;
        },
        mounted(){
            //
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
                this.data[this.column.name] = val;
            },
            resetValue(){
                this.setValue(this.column.value);
            },
            onPreview(){
                this.DialogPreview(this.root + this.data[this.opt.name],this.opt.text||'');
            },
            onBefore(file){
                let opt = this.opt;
                if(opt.props.disabled){
                  return false;
                }
                //
                opt.fileSize || (opt.fileSize = 2);
                const isOk = file.size / 1024 / 1024 < opt.fileSize;
                if(file.size<1){
                    this.msgWarning(`上传文件过小！`);
                    return false;
                }else if (!isOk) {
                    this.msgWarning(`上传文件大小不能超过${opt.fileSize}MB!`);
                }
                return isOk;
            },
            onRemove(){
                this.setValue('');
            },
            upload(param){
                this.opt.loading = true;
                this.api('config.updateFile',param.file).then(res => {
                    let item = res.data[0] || {accessThumbnailUrl:'',accessUrl:''};
                    this.opt.loading = false;
                    this.setValue(item.accessUrl);
                }).catch(response => {
                    this.opt.loading = false;
                    this.msgError("上传失败");
                });
            }
        }
    }
</script>

<style lang="scss">
  .upload_file{
    display: inline-block;
    margin-right: 1rem;

    >.el-upload{
      width:2.5rem;
      height:2.5rem;
    }

    .img_box{
      width:100%;
      height:100%;
      background-size: cover;
    }
  }
</style>
