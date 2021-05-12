<template>
  <div class="app-fixed">
    <div class="app-search">
      <CMForm ref="query" class="form_inline1 form_mini" v-show="showSearch" :columns="queryColumns" label-width="6em" :size="6"/>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd()" >新增</el-button>
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleMemberSetting()" :disabled="multipleSelection.length!=1">会员配置信息</el-button>
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleMemberContact()" :disabled="multipleSelection.length!=1">会员联系信息</el-button>
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleMemberEnterprise()" :disabled="showEnterpriseButton()">企业基本信息</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="listQuery"></right-toolbar>
      </el-row>
    </div>
    <CMTable v-table-height
             :columns="columns"
             :options="table"
             @getList="getList"
             @selection-change="handleSelectionChange"
             :loading="table.loading"
    >
      <template slot="icontemp">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon" />
        </template>
      </template>
    </CMTable>

    <Add ref="add" />
    <Edit ref="edit" />
    <ToContact ref="contact" />
    <ToEnterprise ref="enterprise" />
    <ToSetting ref="setting" />
  </div>
</template>

<script>
    import Add from "./module/add";
    import Edit from "./module/edit";
    import ToContact from "../contacts/module/add";
    import ToEnterprise from "../enterprise/module/add";
    import ToSetting from "../settings/module/add";

    export default {
        name: "MemberList",
        components:{ Add, Edit,ToContact,ToEnterprise,ToSetting },
        data() {
            this.queryColumns = getQueryColumns(this);
            this.columns = getColumns(this);
            return {
                showSearch:true,
                multipleSelection:[],
                table:{
                    dictPrefix:'member',
                    pageNum: 1,
                    pageSize: 10,
                    sort:'id',
                    order: 'desc',
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
                this.api('member.list',param,this.table)
            },
            listQuery() {
                this.table.page = 1;
                this.getList();
            },
            listReset() {
                this.$refs.query.resetForm();
                this.listQuery();
            },
            showEnterpriseButton(){
                let l = this.multipleSelection;
                return !(l.length==1 && l[0].userType == 'enterprise')
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleMemberContact(){
                this.$refs.contact.onOpen(this.multipleSelection[0],this.getList)
            },
            handleMemberSetting(){
                this.$refs.setting.onOpen(this.multipleSelection[0],this.getList)
            },
            handleMemberEnterprise(){
                this.$refs.enterprise.onOpen(this.multipleSelection[0],this.getList)
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
            {name:'search_EQ_userNo',text:'编码',type:'input',onKeyup:listQuery},
            {name:'search_EQ_username',text:'用户名',type:'input',onKeyup:listQuery},
            {name:'search_EQ_mobileNo',text:'手机',type:'input',onKeyup:listQuery},
            {name:'search_EQ_realName',text:'姓名',type:'input',onKeyup:listQuery},
            {name:'search_EQ_userType',text:'类型',type:'select',options:[]},
            {name:'search_EQ_grade',text:'等级',type:'select',options:[]},
            {name:'search_EQ_status',text:'状态',type:'select',options:[]},
            {name:'search_EQ_realNameStatus',text:'是否实名',type:'select',options:[]},
            {name:'search_EQ_inviter',text:'注册时间',type:'date',props:{type:'daterange'},size:8},
            {type:'label',searchButton:{listQuery,listReset},size:16}
        ]
    }

    export function getColumns({format,handleUpdate}){
        return [
            {type:'selection',width:'55',align:'center'},//selectable:()=>{}
            {label:'会员ID',prop:'id'},
            {label:'会员编码',prop:'userNo',width:'200'},
            {label:'用户名',prop:'username',width:'200'},
            {label:'姓名',prop:'realName'},
            {label:'类型',prop:'userType',formatter:format.dict('status','memberUserTypes')},
            {label:'是否实名认证',prop:'realNameStatus',width:'200',formatter:format.dict('realNameStatus','_yes_status')},
            {label:'手机',prop:'mobileNo',width:'180'},
            {label:'是否手机认证',prop:'mobileNoStatus',width:'200',formatter:format.dict('mobileNoStatus','_yes_status')},
            {label:'邮件',prop:'email',width:'180'},
            {label:'是否邮件认证',prop:'emailStatus',width:'200',formatter:format.dict('emailStatus','_yes_status')},
            {label:'经纪人',prop:'broker'},
            {label:'介绍人',prop:'inviter'},
            {label:'等级',prop:'grade',formatter:format.dict('status','memberGrades')},
            {label:'状态',prop:'status',formatter:format.dict('status','memberStatuss')},
            {label:'创建时间',prop:'createTime',width:'160'},
            {label:'操作',prop:'_',width:'60px',fixed:'right',options:[
                    {text:'修改',icon:'el-icon-edit',onClick:(row)=>{console.log(row);handleUpdate(row)}},
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

