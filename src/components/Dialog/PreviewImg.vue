<template>
  <el-dialog :visible.sync="previewUrlShow" :title="previewTitle">
    <img width="100%" :src="previewUrl" alt="">
  </el-dialog>
</template>

<script>
  export default  {
    name:  'PreviewImg1',
    data(){
      return {
        previewTitle:'',
        previewUrl:'',
        previewUrlShow:false
      }
    },
    methods:{
      show(url,title){
        this.previewUrl = url;
        this.previewTitle = title;
        this.previewUrlShow = Boolean(url);
      }
    }
  }
</script>
