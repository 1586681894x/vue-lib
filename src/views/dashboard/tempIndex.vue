<template>
  <div class="app-fixed">
    <div class="app-search">
      <CMForm ref="query" class="form" v-show="showSearch" :columns="queryColumns" />
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-plus" size="mini" >新增</el-button>
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
        </template>
      </template>
    </CMTable>
  </div>
</template>

<script>
    export default {
        name: "TempIndex",
        data() {
            this.queryColumns = getQueryColumns(this);
            this.columns = getColumns(this);
            return {
                showSearch:true,
                multipleSelection:[],
                table:{
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
                this.api('role.list',param,this.table)
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
            {name:'search_LIKE_name',text:'角色名称',type:'input',onKeyup:listQuery},
            {type:'label',searchButton:{listQuery,listReset},size:16}
        ]
    }

    export function getColumns(){
        return [
            {type:'selection',width:'55',align:'center',selectable:()=>{}},
            {label:'名称',prop:'name',width:'200'},
            {label:'说明',prop:'descn'},
            {label:'创建时间',prop:'createTime',width:'160'},
            {label:'操作',prop:'_',width:'255px',fixed:'right',options:[
                    {text:'修改',icon:'el-icon-edit'},
                    {text:'删除',icon:'el-icon-delete'},
                ]
            }
        ]
    }

    export function getRules(){
        return {

        }
    }
</script>

