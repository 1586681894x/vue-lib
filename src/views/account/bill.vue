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
        name: "AccountBill",
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
                this.api('accountBill.list',param,this.table)
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
            {name:'search_EQ_accountNo',text:'账户编码',type:'input',onKeyup:sc.listQuery},
            {name:'search_EQ_userNo',text:'用户编码',type:'input',onKeyup:sc.listQuery},
            {name:'search_LIKE_bizOrderNo',text:'订单号',type:'input',onKeyup:sc.listQuery},
            {name:'search_LIKE_username',text:'用户名',type:'input',onKeyup:sc.listQuery},
            {name:'search_EQ_direction',text:'资金流向',type:'select',options:[]},
            {name:'search_LIKE_tradeCode',text:'交易码',type:'input',onKeyup:sc.listQuery},
            {name:'search_GTE_createTime',text:'时间',type:'date',props:{type:"daterange"}},
            {type:'label',searchButton:{listQuery:sc.listQuery,listReset:sc.listReset},size:16}
        ]
    }

    export function getColumns(){
        return [
            {type:'selection',width:'55',align:'center'},
            {"label":"ID","prop":"id"},
            {"label":"记账时间","prop":"createTime"},
            {"label":"账户(ID/NO)","prop":"accountId",width:'150'},
            {"label":"用户(ID/NO)","prop":"userNo",width:'150'},
            {"label":"用户名","prop":"username"},
            {"label":"交易码","prop":"tradeCodeField"},
            {"label":"资金流向","prop":"direction"},
            {"label":"交易金额","prop":"amount"},
            {"label":"变动后余额","prop":"balancePost",width:'150'},
            {"label":"冻结金额","prop":"freezeAmount"},
            {"label":"冻结后总额","prop":"freezePost",width:'150'},
            {"label":"交易名称","prop":"tradeCode"},
            {"label":"订单号","prop":"bizOrderNo"},
            {"label":"状态","prop":"status"},
            {"label":"动作","prop":"rowActions"},
            {label:'创建时间',prop:'createTime',width:'160'}
        ]
    }

    export function getRules(){
        return {}
    }
</script>

