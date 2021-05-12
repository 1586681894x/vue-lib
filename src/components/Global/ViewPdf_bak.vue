<template>
  <!--<el-dialog :visible.sync="previewUrlShow" :title="previewTitle"><CMPdf ref="$pdf"/></el-dialog>-->
  <div>
      <div v-if="pdfsrc" class="pdf">
        <pdf :src="pdfsrc" :page="pdfPage" @num-pages="pdfPageCount = $event" @page-loaded="pdfPage = $event"
             style="display: inline-block; width: 100%; height: 80%;"></pdf>
      </div>
      <div v-else style="min-height: 200px; display: grid; align-items: center; text-align: center;">
        <div>
          <span style="color: #999999;">正在努力加载中 ...</span>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <div style="margin-bottom: 15px; text-align: right">
          <el-button type="text" size="small" @click.stop="previousPdfPage">上一页</el-button>
          <el-button type="text" size="small" @click.stop="nextPdfPage">下一页</el-button>
          <span style="font-size: 12px; margin-left: 15px;">当前第{{pdfPage}}页 / 共{{pdfPageCount}}页</span>
        </div>
      </div>
  </div>
</template>

<script>
  import pdf from 'vue-pdf/src/vuePdfSss';

  export default {
    name: "PreviewPdf",
    components:{
      pdf
    },
    data() {
      return {
        pdfsrc:null,
        pdfPage:1,
        pdfPageCount:0
      }
    },
    activated(){
      // let url = this.props.url;
      // this.pdfsrc = url ? pdf.createLoadingTask({ url: url, CMapReaderFactory }) : null
    },
    methods: {
      show(url){
        this.pdfPage = 1;
        this.pdfsrc = url ? pdf.createLoadingTask({ url: url }) : null
      },
      //PDF改变页数
      previousPdfPage(){
        var p = this.pdfPage
        p = p>1?p-1:this.pdfPageCount
        this.pdfPage = p
      },
      nextPdfPage(){
        var p = this.pdfPage
        p = p<this.pdfPageCount?p+1:1
        this.pdfPage = p
      }
    }
  }

</script>

<style scoped>
  .pdf {
    overflow-y: scroll;
    max-height: 500px;
  }
</style>
