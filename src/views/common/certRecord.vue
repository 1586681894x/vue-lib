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
        name: "CommonCertRecord",
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
                this.api('commonCertRecord.list',param,this.table).then(()=>{
                    this.$refs.query.setColumn({search_EQ_status:{options:this.getTxt('commonStatuss')}})
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
            {"name":"search_LIKE_realName","text":"真实姓名","type":"input",onKeyup:listQuery},
            {"name":"search_LIKE_idCarNo","text":"身份证号","type":"input",onKeyup:listQuery},
            {"name":"search_EQ_status","text":"状态","type":"select",options:[]},
            {type:'label',searchButton:{listQuery,listReset},size:24}
        ]
    }

    export function getColumns(){
        return [
            {type:'selection',width:'55',align:'center',selectable:()=>{}},
            {"label":"ID","prop":"id"},
            {"label":"真实姓名","prop":"realName"},
            {"label":"身份证号","prop":"idCarNo"},
            {"label":"性别","prop":"sex"},
            {"label":"所在地址","prop":"address"},
            {"label":"出生日期","prop":"birthday"},
            {"label":"状态","prop":"status"},
            {"label":"创建时间","prop":"createTime"},
            {"label":"更新时间","prop":"updateTime"},
            {label:'创建时间',prop:'createTime',width:'160'}
        ]
    }

    export function getRules(){
        return {

        }
    }
</script>

