<template>
  <div class="app-fixed">
    <div class="app-search">
      <CMForm ref="query" class="form_inline1 form_mini" v-show="showSearch" :columns="queryColumns" />
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

    <Edit ref="edit"/>
  </div>
</template>

<script>
    import Edit from './module/edit'

    export default {
        name: "CommonEmail",
        components:{ Edit },
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
                this.api('commonEmail.list',param,this.table)
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
            handleUpdate(row = {id:0}){
                this.$refs.edit.onOpen(row,this.getList)
            },
            handleDelete(row) {
                this.msgConfirm({content:`是否确认模板名称为 " ${row.name} " 的数据项?`}).then(()=>{
                    return this.api('commonEmail.del',row.id);
                }).then(() => {
                    this.getList();
                    this.msgSuccess("删除成功");
                })
            }
        }
    }

    export function getQueryColumns({listQuery,listReset}){
        return [
            {"name":"search_LIKE_name","text":"模版名称","type":"input",onKeyup:listQuery},
            {"name":"search_LIKE_subject","text":"邮件主题","type":"input",onKeyup:listQuery},
            {type:'label',searchButton:{listQuery,listReset},size:8}
        ]
    }

    export function getColumns(sc){
        return [
            //{type:'selection',width:'55',align:'center',selectable:()=>{}},
            {"label":"id","prop":"id"},
            {"label":"模版名称","prop":"name"},
            {"label":"邮件主题","prop":"subject"},
            {"label":"修改时间","prop":"updateTime",width:'160'},
            {"label":"创建时间","prop":"createTime",width:'160'},
            {label:'操作',prop:'_',width:'255px',options:[
                    {text:'修改',icon:'iconxiugai',onClick:sc.handleUpdate},
                    {text:'删除',icon:'iconshanchu-xianxing',onShow:(row)=>{return row.userId !== 1},onClick:sc.handleDelete},
                ]
            }
        ]
    }

    export function getRules(){
        return {

        }
    }
</script>

