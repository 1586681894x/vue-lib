<template>
  <el-form-item class="upload_img fl-center" label-width="0" v-if="!opt.hide" size="mini">
    <el-upload ref="upload" :class="{hide:uploadIconHide}" action="#" list-type="picture-card" size="mini"
       :limit="opt.limit"
       :show-file-list="uploadIconHide"
       :on-preview="onPreview"
       :before-upload="onBefore"
       :on-remove="onRemove"
       :on-change="()=>{ this.licenseFirstImgShow = true }"
       :http-request="upload"
       :file-list="fileList"
       v-bind="opt.props">
      <div slot="default">
        <i v-if="!opt.loading" class="el-icon-upload" />
        <i v-else class="el-icon-loading" />
      </div>
      <div :class="`${column.rules ? 'upload_require':''} el-upload__tip`" slot="tip">{{opt.text}}</div>
    </el-upload>
  </el-form-item>
</template>

<script>

export default {
    name: "FormUpload",
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
  data(){window.zz = this;
    return {
      uploadIconHide:false,
      fileList:[],
      //
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
      // fileList 变化引起过度效果
      if(this.fileList.length){
        this.uploadIconHide = Boolean(val);
        this.fileList[0] = _.extend(this.fileList[0],{url:val});
        return;
      }
      //
      Object.assign(this,{
        uploadIconHide: Boolean(val),
        fileList:val ? [{url:val}] : []
      })

    },
    resetValue(){// upload 特有
      this.setValue(this.column.value);
    },
    onPreview(){
      this.DialogPreview(this.fileList[0]['url'],this.opt.text||'');
    },
    onBefore(file){
      let opt = this.opt;
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
      const formData = new FormData();
      formData.append("file", param.file);
      this.opt.loading = true;
      this.api('uploadFile',formData).then(response => {
        this.opt.loading = false;
        this.setValue(response.data);
      }).catch(response => {
        this.opt.loading = false;
        this.msgError("上传失败");
      });
    }
  }
}
</script>
