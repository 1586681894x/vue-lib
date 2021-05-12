<template>
  <div class="app-fixed">
    <div class="app-search">
      <CMForm ref="query" class="form_inline1 form_mini" v-show="showSearch" :columns="queryColumns" />
      <el-row :gutter="10" class="mb8">
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
        name: "AccountList",
        data() {
            this.queryColumns = getQueryColumns(this);
            this.columns = getColumns(this);
            return {
                showSearch:true,
                multipleSelection:[],
                table:{
                    dictPrefix:'account',
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
                this.api('account.list',param,this.table)
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
            }
        }
    }

    export function getQueryColumns(sc){
        return [
            {name:'search_EQ_id',text:'账户ID',type:'input',onKeyup:sc.listQuery},
            {name:'search_EQ_accountNo',text:'账户编码',type:'input',onKeyup:sc.listQuery},
            {name:'search_EQ_userId',text:'用户ID',type:'input',onKeyup:sc.listQuery},
            {name:'search_LIKE_username',text:'用户名',type:'input',onKeyup:sc.listQuery},
            {name:'search_balance',text:'余额',type:'input'},
            {name:'search_EQ_accountType',text:'类型',type:'select',options:[]},
            {name:'search_EQ_status',text:'状态',type:'select',options:[]},
            {type:'label',searchButton:{listQuery:sc.listQuery,listReset:sc.listReset},size:16}
        ]
    }

    export function getColumns(sc){
        return [
            {type:'selection',width:'55',align:'center'},
            {"label":"ID","prop":"id"},
            {"label":"账号","prop":"accountNo"},
            {"label":"用户ID","prop":"userId"},
            {"label":"用户编码","prop":"userNo"},
            {"label":"用户名","prop":"username"},
            {"label":"余额","prop":"balance"},
            {"label":"冻结金额","prop":"freeze"},
            {"label":"可用金额","prop":"available"},
            {"label":"账户类型","prop":"accountType",formatter:sc.format.dict('accountType','accountAccountTypes')},
            {"label":"状态","prop":"status",formatter:sc.format.dict('status','accountStatuss')},
            {"label":"更新时间","prop":"updateTime",width:'160'},
            {label:'创建时间',prop:'createTime',width:'160'},
            {label:'操作',prop:'_',width:'90px',options:[
                    {text:'修改',icon:'el-icon-edit'},
                    {text:'删除',icon:'el-icon-delete'},
                ]
            }
        ]
    }

    export function getRules(){
        return {}
    }
</script>

