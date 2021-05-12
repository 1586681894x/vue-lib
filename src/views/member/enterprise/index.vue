<template>
  <div class="app-fixed">
    <div class="app-search">
      <CMForm ref="query" class="form_inline1 form_mini" v-show="showSearch" :columns="queryColumns" label-width="6em" :size="6"/>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
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

    <ToEnterprise ref="edit"/>
  </div>
</template>

<script>
    import ToEnterprise from "./module/add";

    export default {
        name: "MemberEnterpise",
        components:{ToEnterprise},
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
                    dictPrefix:'member',
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
                this.api('memberEnterprise.list',param)
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

    export function getColumns(sc){
        return [
            {type:'selection',width:'55',align:'center'},
            {label:'会员ID',prop:'id',width:'200'},
            {label:'会员编码',prop:'userNo',width:'200'},
            {label:'用户名',prop:'username'},
            {label:'类型',prop:'userType'},
            {label:'真实姓名',prop:'realName'},
            {label:'是否实名认证',prop:'realNameStatus',width:'140',formatter:sc.format.dict('realNameStatus','_yes_status')},
            {label:'手机',prop:'mobileNo'},
            {label:'是否手机认证',prop:'mobileNoStatus',width:'140',formatter:sc.format.dict('realNameStatus','_yes_status')},
            {label:'邮件',prop:'email'},
            {label:'是否邮件认证',prop:'emailStatus',width:'140',formatter:sc.format.dict('realNameStatus','_yes_status')},
            {label:'经纪人',prop:'broker'},
            {label:'介绍人',prop:'inviter'},
            {label:'等级',prop:'grade'},
            {label:'状态',prop:'status'},
            {label:'创建时间',prop:'createTime',width:'160'},
            {label:'操作',prop:'_',width:'60px',fixed:'right',options:[
                    {text:'修改',icon:'el-icon-edit',onClick:sc.handleUpdate}
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

