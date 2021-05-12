<template>
  <div class="app-fixed">
    <div class="app-search">
      <CMForm ref="query" class="head-container fl-one" v-show="showSearch" :columns="queryColumns" />
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
                  type="primary"
                  icon="el-icon-plus"
                  size="mini" >新增</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="listQuery"></right-toolbar>
      </el-row>
    </div>
    <CMTable v-table-height
             :columns="columns"
             :options="table"
             @getList="getList"
             @selection-change="handleSelectionChange"
    >
      <template slot="icontemp">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon" />
        </template>
      </template>
    </CMTable>
  </div>
</template>

<script>
    export default {
        name: "CommonOlog",
        data() {
            this.queryColumns = getQueryColumns(this);
            this.columns = getColumns(this);
            return {
                showSearch:true,
                multipleSelection:[],
                table:{
                    dictPrefix:'common',
                    pageNum: 1,
                    pageSize: 10,
                    total:0,
                    loading:false,
                    data:[],
                }
            };
        },
        created() {
            //this.getTxt(['']);
        },
        mounted(){
            this.getList();
        },
        methods: {
            getList(pagination) {
                let param = _.omit(_.extend(this.table,pagination,this.$refs.query.getData()),['data','loading']);
                this.api('commonOlog.list',param,this.table)
            },
            listQuery() {
                this.table.page = 1;
                this.getList();
            },
            listReset() {
                this.$refs.query.resetForm();
                this.listQuery();
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleAdd(row = {id:0}){
                this.$refs.add.onOpen(row,this.getList)
            },
            handleUpdate(row = {}){
                this.$refs.edit.onOpen(row,this.getList)
            },
            handleMulDelete() {
                let arr = this.multipleSelection, ids = [];
                arr.forEach((v)=>{
                    ids.push(v.id)
                })
                //
                this.msgConfirm({content:`是否确认删除角色?`}).then(()=>{
                    return this.api('role.del',ids.join(','),{});
                }).then(() => {
                    this.getList();
                    this.msgSuccess("删除成功");
                })
            },
            handleDelete(row) {
                this.msgConfirm({content:`是否确认删除角色编号为 " ${row.name} " 的数据项?`}).then(()=>{
                    return this.api('role.del',row.id,{});
                }).then(() => {
                    this.getList();
                    this.msgSuccess("删除成功");
                })
            }
        }
    }

    export function getQueryColumns({listQuery,listReset}){
        return [
            {"name":"search_EQ_system","text":"系统","type":"input",onKeyup:listQuery},
            {"name":"search_LIKE_module","text":"模块","type":"input",onKeyup:listQuery},
            {"name":"search_LIKE_actionName","text":"功能","type":"input",onKeyup:listQuery},
            {"name":"search_EQ_operateResult","text":"结果","type":"select",options:[]},
            {"name":" search_GTE_operateTime","text":"时间","type":"input"},
            {"name":" search_LTE_operateTime","text":"至","type":"input"},
            {"name":"search_LIKE_operateUser","text":"作员","type":"input",onKeyup:listQuery},
            {type:'label',searchButton:{listQuery,listReset},size:16}
        ]
    }

    export function getColumns(){
        return [
            {type:'selection',width:'55',align:'center',selectable:()=>{}},
            {"label":"ID","prop":"id"},
            {"label":"系统","prop":"system"},
            {"label":"模块","prop":"moduleName"},
            {"label":"功能","prop":"actionName"},
            {"label":"操作员","prop":"operateUser"},
            {"label":"操作时间","prop":"operateTime"},
            {"label":"执行时间(ms)","prop":"executeMilliseconds"},
            {"label":"请求参数","prop":"requestParameters"},
            {"label":"结果","prop":"operateResult"},
            {"label":"消息","prop":"operateMessage"},
            {"label":"动作","prop":"rowActions"},
            {label:'创建时间',prop:'createTime',width:'160'},
        ]
    }

    export function getRules(){
        return {

        }
    }
</script>

