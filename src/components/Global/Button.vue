<template>
  <el-tooltip :content="opt.text" >
    <el-button type="primary" icon="el-icon-plus" circle size="mini" @click="handleAdd" v-hasPermi="['business:order:add']"></el-button>
  </el-tooltip>
</template>

<script>
  export default  {
    name:  'CMButton',
    data(){
      return {
        opt:{
          text:'新增'
        }
      }
    }
  }
</script>
