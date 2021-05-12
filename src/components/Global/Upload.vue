<template>
  <div class="table-upload fl-middle">
    <el-upload class="avatar-uploader"
               :disabled="disabled"
               :accept="accept" action="#"
               :show-file-list="false"
               :before-upload="onBefore"
               :on-preview="onShow"
               :http-request="uploadImg(row,name)" >
      <div v-if="row[name]" class="img_box" style="" :style="`background-image:url(${row[name]})`">
        <div v-show="!disabled" class="fl-center"><i class="iconfont iconxiugai"/></div>
      </div>
      <el-button v-else v-show="!disabled" type="primary" plain icon="el-icon-upload" circle size="mini" :loading="options.loading"></el-button>
    </el-upload>
    <span v-if="row[name]" @click="onShow" class="color_link">查看</span>
  </div>
</template>

<script>
  export default  {
    name:  'CMUpload',
    props: {
      disabled:{
        type:Boolean,
        default:false
      },
      accept:{
        type:String,
        default:'.jpg,.jpeg,.png,.JPG,.JPEG'
      },
      name:{
        type:String,
        default:''
      },
      row:{
        type: [Object,Array],
        default: {}
      },
      onEnd:{
        type: [Function],
        default: ()=>{}
      }
    },
    data(){window.upload = this;
      return {
        options:{
          loading:false
        }
      }
    },
    methods:{
      onShow(){
        let {row,name} = this;
        this.DialogPreview(row[name],this.$attrs.title)
      },
      onBefore(file){
        let opt = {fileSize:this.fileSize};
        opt.fileSize || (opt.fileSize = 2);
        const isOk = file.size / 1024 / 1024 < opt.fileSize;
        if(file.size<1){
          this.msgWarning(`上传文件过小！`);
          return false;
        }else if (!isOk) {
          this.msgWarning(`上传文件大小不能超过${opt.fileSize}MB!`);
          return false;
        }
        return true;
      },
      uploadImg(row,name){
        let onEnd = this.onEnd;
        return (param)=>{
          const formData = new FormData();
          formData.append("file", param.file);
          this.getResult(this.api('uploadFile',formData)).then(({data})=>{
            Object.assign(row,{[name]:data});
            onEnd(row);
          }).catch(response => {
            this.msgError("上传失败");
          })
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  .table-upload{
    .img_box{
      width:34px;
      height: 34px;
      margin-right:1rem;
      background-position: center;
      background-size: cover;
      border: 1px solid #D1D2D4;
      position:relative;

      div{
        background: rgba(27, 28, 42, 0.5);
        display:none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;

        i{
          margin-top: 5px;
          color: #fff;
          font-size: 1rem;
          display:inline-block;
        }
      }

      &:hover{
        div{
          display:inline-block;
        }
      }
    }
    .color_link{
      cursor: pointer;
    }
  }
</style>
