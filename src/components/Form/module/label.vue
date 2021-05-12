<template>
  <el-form-item v-if="column.searchButton" class="fl-right" size="mini">
    <el-button type="primary" icon="el-icon-search" size="mini" @click="column.searchButton.listQuery">搜索</el-button>
    <el-button size="mini" @click="column.searchButton.listReset"><span class="iconfont iconzhongzhi"/> 重置</el-button>
  </el-form-item>
  <el-form-item v-else class="row_blink" size="mini" style="width: 0;overflow: hidden;">
    <el-select value=""></el-select>
  </el-form-item>
</template>

<script>

export default {
    name: "FormRowBlink",
    props: {
        column: {
          type:[Object,Array],
          default:{}
        }
    }
}
</script>
