<template>
  <el-table-column v-bind="{...column}">
    <template slot-scope="scope">
      <span class="link color_link" @click="column.onClick(scope.row)">{{scope.row[column.prop]}}</span>
    </template>
  </el-table-column>
</template>

<script>
  export default  {
    name:  'ColumnLink',
    props:{
      column:{
        type:Object
      }
    }
  }
</script>
