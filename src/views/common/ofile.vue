<template>
  <div class="app-fixed">
    <div class="app-search">
      <CMForm ref="query" class="form_inline1 form_mini" v-show="showSearch" :columns="queryColumns" label-width="6em"/>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleCert()" >签名认证测试</el-button>
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
        name: "CommonOfile",
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
        created() {window.ss = this;
            //this.getTxt(['']);
        },
        mounted(){
            this.getList();
        },
        methods: {
            getList(pagination) {
                let param = _.omit(_.extend(this.table,pagination,this.$refs.query.getData()),['data','loading']);
                this.api('commonOfile.list',param,this.table).then(()=>{
                    this.$refs.query.setColumn({search_EQ_fileType:{options:this.getTxt('commonFileTypes')}})
                })
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
            handleCert(){
                window.open('/ofile.html','blink')
            }
        }
    }

    export function getQueryColumns({listQuery,listReset}){
        return [
            {"name":"search_LIKE_fileName","text":"文件名","type":"input"},
            {"name":"search_EQ_fileType","text":"文件类型","type":"select",options:[]},
            {"name":"search_LIKE_originalName","text":"文件名","type":"input"},
            {"name":"search_GTE_createTime","text":"上传时间","type":"input"},
            {"name":"search_LTE_createTime","text":"至查询","type":"input"},
            {type:'label',searchButton:{listQuery,listReset},size:8}
        ]
    }

    export function getColumns(){
        return [
            //{type:'selection',width:'55',align:'center',selectable:()=>{}},
            {"label":"ID","prop":"id"},
            {"label":"路径","prop":"filePath",width:'300'},
            {"label":"原文件名","prop":"originalName",width:'200'},
            {"label":"文件类型","prop":"fileType"},
            {"label":"大小","prop":"fileSize"},
            {"label":"模块分类","prop":"module"},
            {"label":"用户名","prop":"userName",width:'160'},
            {"label":"上传时间","prop":"createTime",width:'160'},
            {label:'创建时间',prop:'createTime',width:'160'}
        ]
    }

    export function getRules(){
        return {

        }
    }
</script>

