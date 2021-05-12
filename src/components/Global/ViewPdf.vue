<template>
  <div class="pdf_view">
    <iframe class="fancybox-iframe"
            width="100%"
            height="100%"
            frameborder="no"
            border="0"
            allowfullscreen="allowfullscreen"
            allow="autoplay; fullscreen"
            :src="pdfsrc"
            scrolling="auto">
    </iframe>
  </div>
</template>

<script>
  export default {
    name: "PreviewPdf",
    data(){
      return {
        pdfsrc:''
      }
    },
    methods: {
      show(url){
        this.pdfsrc = url;
      }
    }
  }

</script>
