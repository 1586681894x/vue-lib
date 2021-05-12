<template>
  <el-table-column label="审核状态" width="130" v-bind="{...column}" >
    <template slot-scope="scope">
      <div :class="getStatus3(scope.row)" >
        <span :class="`dot ${getClz(scope.row)}`" ></span>
        <span class="dot_box">{{getText(scope.row)}}</span>
        <i class="dot_tips el-icon-warning" v-show="getStatus3(scope.row)" @click="column.onClick($event,scope.row)"></i>
      </div>
    </template>
  </el-table-column>
</template>

<script>
  let clzMap = {'0':'default','1':'info','2':'success','3':'danger'}//0-未提交，1-已提交，2-审核通过，3-审核拒绝

  export default  {
    name:  'ColumnAuditStatus',
    props:{
      column:{
        type:Object
      }
    },
    methods:{
      getStatus3(row){
        let { column } = this;
        return row[column.prop] == 3 ? 'color_danger' : ''
      },
      getClz(row){
        let { column } = this;
        return clzMap[row[column.prop]+''];
      },
      getText(row){
        let { column } = this;
        return this.getTxt('biz_audit_status',row[column.prop]);
      }
    }
  }
</script>
