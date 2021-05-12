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
        name: "CommonCertBankRecord",
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
                this.api('commonCertBankRecord.list',param,this.table).then(()=>{
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
            {"name":"search_LIKE_realName","text":"持卡人姓名","type":"input",onKeyup:listQuery},
            {"name":"search_LIKE_cardNo","text":"银行卡帐号","type":"input",onKeyup:listQuery},
            {"name":"search_LIKE_certId","text":"开卡使用的证件号码","type":"input",onKeyup:listQuery},
            {"name":"search_LIKE_phoneNum","text":"绑定手机号","type":"input",onKeyup:listQuery},
            {"name":"search_EQ_status","text":"状态","type":"select",options:[]},
            {type:'label',searchButton:{listQuery,listReset},size:8}
        ]
    }

    export function getColumns(){
        return [
            {type:'selection',width:'55',align:'center',selectable:()=>{}},
            {"label":"ID","prop":"id"},
            {"label":"持卡人姓名","prop":"realName",width:'180'},
            {"label":"银行卡帐号","prop":"cardNo",width:'180'},
            {"label":"证件号码","prop":"certId"},
            {"label":"绑定手机号","prop":"phoneNum",width:'180'},
            {"label":"证件类型","prop":"certType"},
            {"label":"银行卡归属地","prop":"belongArea",width:'180'},
            {"label":"银行卡产品名称","prop":"brand",width:'180'},
            {"label":"银行名称","prop":"bankName"},
            {"label":"银行卡种","prop":"cardType"},
            {"label":"状态","prop":"status"},
            {"label":"验证失败原因","prop":"failReason",width:'180'},
            {"label":"创建时间","prop":"createTime"},
            {"label":"动作","prop":"rowActions"},
            {label:'创建时间',prop:'createTime',width:'160'}
        ]
    }

    export function getRules(){
        return {

        }
    }
</script>

