<template>
  <div class="app-fixed">
    <div class="app-search">
      <CMForm ref="query" class="form_inline1 form_mini" v-show="showSearch" :columns="queryColumns" label-width="6em" :size="6"/>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <!--<el-button-->
                  <!--type="primary"-->
                  <!--icon="el-icon-plus"-->
                  <!--size="mini" >新增</el-button>-->
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="listQuery"></right-toolbar>
      </el-row>
    </div>
    <CMTable v-table-height
             :columns="columns"
             :options="options"
             @getList="getList"
             @selection-change="handleSelectionChange"
    >
      <template slot="icontemp">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon" />
        </template>
      </template>
    </CMTable>

    <ToContact ref="edit"/>
  </div>
</template>

<script>
    import ToContact from "./module/add";

    export default {
        name: "MemberContacts",
        components:{ ToContact },
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
                },
                options:{
                    loading:false,
                    data:[]
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
                this.api('memberContact.list',param)
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
            handleDelete(row) {
                this.msgConfirm({content:`是否确认删除会员名称为 " ${row.username} " 的联系人数据?`}).then(()=>{
                    return this.api('memberContact.del',row.id,{});
                }).then(() => {
                    this.getList();
                    this.msgSuccess("删除成功");
                })
            }
        }
    }

    export function getQueryColumns({listQuery,listReset}){
        return [
            {name:'search_LIKE_userNo',text:'会员编码',type:'input',onKeyup:listQuery},
            {name:'search_LIKE_username',text:'用户名',type:'input',onKeyup:listQuery},
            {name:'search_LIKE_mobileNo',text:'手机号码',type:'input',onKeyup:listQuery},
            {name:'search_LIKE_phoneNo',text:'电话号码',type:'input',onKeyup:listQuery},
            {type:'label',searchButton:{listQuery,listReset},size:24}
        ]
    }

    export function getColumns(sc){
        return [
            {type:'selection',width:'55',align:'center'},
            {label:'主键',prop:'id',width:'200'},
            {label:'会员编码',prop:'userNo'},
            {label:'用户名',prop:'username'},
            {label:'手机',prop:'mobileNo'},
            {label:'电话',prop:'phoneNo'},
            {label:'邮件',prop:'email'},
            {label:'省',prop:'province'},
            {label:'市',prop:'city'},
            {label:'县/区',prop:'district'},
            {label:'邮编',prop:'zip'},
            {label:'QQ',prop:'qq'},
            {label:'MSN',prop:'wechat'},
            {label:'旺旺',prop:'wangwang'},
            {label:'更新时间',prop:'updateTime',width:'160'},
            {label:'创建时间',prop:'createTime',width:'160'},
            {label:'操作',prop:'_',width:'60px',fixed:'right',options:[
                    {text:'修改',icon:'el-icon-edit',onClick:sc.handleUpdate},
                    // {text:'删除',icon:'el-icon-delete',onClick:sc.handleDelete},
                ]
            }
        ]
    }

    export function getRules({listQuery,listReset}){
        return [
            {name:'name',text:'名称',type:'input',onKeyup:listQuery},
            {type:'label',searchButton:{listQuery,listReset}}
        ]
    }
</script>

