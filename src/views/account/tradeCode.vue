<template>
  <div class="app-fixed">
    <div class="app-search">
      <CMForm ref="query" class="form_inline1 form_mini" v-show="showSearch" :columns="queryColumns" label-width="6em" :size="6"/>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleUpdate()">新增</el-button>
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

    <TradeCode ref="edit"/>
  </div>
</template>

<script>
    import TradeCode from './module/TradeCodeAdd'

    export default {
        name: "AccountTradeCode",
        components:{ TradeCode },
        data() {
            this.queryColumns = getQueryColumns(this);
            this.columns = getColumns(this);
            return {
                showSearch:true,
                multipleSelection:[],
                table:{
                    dictPrefix:'tradeCode',
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
                this.api('accountTradeCode.list',param,this.table)
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
            handleUpdate(row = {}){
                this.$refs.edit.onOpen(row,this.getList)
            }
        }
    }

    export function getQueryColumns(sc){
        return [
            {name:'search_LIKE_tradeCode',text:'交易码',type:'input',onKeyup:sc.listQuery},
            {name:'search_LIKE_tradeName',text:'交易名称',type:'input',onKeyup:sc.listQuery},
            {name:'search_EQ_direction',text:'方向',type:'select',options:'tradeCodeDirections'},
            {type:'label',searchButton:{listQuery:sc.listQuery,listReset:sc.listReset}}
        ]
    }

    export function getColumns(sc){
        return [
            {type:'selection',width:'55',align:'center'},
            {"label":"交易编码","prop":"tradeCode"},
            {"label":"交易名称","prop":"tradeName"},
            {"label":"方向","prop":"direction",formatter:sc.format.dict('direction','tradeCodeDirections')},
            {"label":"备注","prop":"comments"},
            {"label":"更新时间","prop":"updateTime",width:'160'},
            {label:'创建时间',prop:'createTime',width:'160'}
        ]
    }

    export function getRules(){
        return {}
    }
</script>

