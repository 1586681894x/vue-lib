<template>
  <div class="cm_pdf fl-center" v-show="previewUrlShow">
    <CMPdf ref="$pdf"/>
    <div class="pdf_mask" @click="show()">
      <i class="pdf_close el-icon-close" />
    </div>
  </div>
</template>

<script>

  export default  {
    name:  'PreviewPdf',
    data(){
      return {
        previewTitle:'',
        previewUrlShow:false
      }
    },
    methods:{
      show(url,title){
        this.previewTitle = title;
        this.previewUrlShow = Boolean(url);
        this.$nextTick(()=>{
          this.$refs.$pdf.show(url);
        })
      }
    }
  }
</script>

<style>
  .cm_pdf{
    width: 100%;
    height: 100%;
    position:fixed;
    top:0;
    bottom:0;
    z-index: 10010;
  }
  .cm_pdf .pdf_close{
    position: absolute;
    right: 0;
    top: 0;
    color: white;
    font-size: 2rem;
    cursor:pointer;
    transition:transform .4s;
  }
  .cm_pdf .pdf_close:hover{
    transform:rotateZ(90deg);
  }
  .cm_pdf .pdf_mask{
    width: 100%;
    height: 100%;
    background-color:rgba(0,0,0,.8);
  }
  .cm_pdf .pdf_view{
    width: 90%;
    height: 90%;
    position: absolute;
    top:5%;
    left:5%;
  }
</style>
