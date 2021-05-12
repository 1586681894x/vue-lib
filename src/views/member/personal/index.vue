<template>
  <div class="app-fixed">
    <div class="app-search">
      <CMForm ref="query" class="form_inline1 form_mini" v-show="showSearch" :columns="queryColumns" label-width="6em" :size="6"/>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button :disabled="multipleSelection.length!=1"
                  type="primary"
                  icon="el-icon-plus"
                  size="mini" @click="handleCert()">实名认证</el-button>
          <el-button :disabled="multipleSelection.length!=1"
                  type="primary"
                  icon="el-icon-plus"
                  size="mini" @click="handleSetting()">设置个人信息</el-button>
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

    <ToCert ref="cert" />
    <ToSetting ref="setting" />
  </div>
</template>

<script>
    import ToCert from './module/toCert'
    import ToSetting from './module/toSetting'

    export default {
        name: "MemberPersonal",
        components:{ToCert,ToSetting},
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
                let param = _.omit(_.extend(this.table,pagination,this.$refs.query.getData()),['data','loading','dictPrefix']);
                this.api('memberPersonal.list',param,this.table)
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
            handleCert(){
                this.$refs.cert.onOpen(this.multipleSelection[0],this.getList)
            },
            handleSetting(){
                this.$refs.setting.onOpen(this.multipleSelection[0],this.getList)
            }
        }
    }

    export function getQueryColumns({listQuery,listReset}){
        return [
            {name:'search_EQ_userNo',text:'用户编码',type:'input',onKeyup:listQuery},
            {name:'search_EQ_username',text:'用户名',type:'input',onKeyup:listQuery},
            {name:'search_RLIKE_realName',text:'姓名',type:'input',onKeyup:listQuery},
            {name:'search_EQ_certStatus',text:'状态',type:'select',options:[]},
            {type:'label',searchButton:{listQuery,listReset},size:24}
        ]
    }

    export function getColumns(sc){
        return [
            {type:'selection',width:'55',align:'center'},
            {label:'ID',prop:'id',width:'200'},
            {label:'用户编码',prop:'userNo'},
            {label:'用户名',prop:'username'},
            {label:'姓名',prop:'realName'},
            {label:'证件类型',prop:'certType'},
            {label:'证件号码',prop:'certNo',width:'255'},
            {label:'有效期',prop:'certValidityDate'},
            {label:'实名状态',prop:'certStatus',formatter:sc.format.dict('certStatus','_yes_status')},
            {label:'创建时间',prop:'createTime',width:'160'},
            {label:'更新时间',prop:'updateTime',width:'160'}
        ]
    }

    export function getRules({listQuery,listReset}){
        return [
            {name:'name',text:'名称',type:'input',onKeyup:listQuery},
            {type:'label',searchButton:{listQuery,listReset}}
        ]
    }
</script>

