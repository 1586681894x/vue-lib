<template>
  <div class="app-fixed">
    <div class="app-search">
      <CMForm ref="query" class="form_inline1 form_mini" v-show="showSearch" :columns="queryColumns" />
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
                  type="primary"
                  icon="el-icon-plus"
                  size="mini"
                  @click="handleAdd()"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
                  type="success"
                  icon="el-icon-edit"
                  size="mini"
                  :disabled="multipleSelection.length!=1"
                  @click="handleUpdate(multipleSelection[0])"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  :disabled="multipleSelection.length<1"
                  @click="handleMulDelete()"
          >批量删除</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="listQuery"></right-toolbar>
      </el-row>
    </div>
    <div class="app-table" >
      <CMTable v-table-height
          :columns="columns"
          :options="options"
          @selection-change="handleSelectionChange"
      >
        <template slot="icontemp">
          <template slot-scope="scope">
            <svg-icon :icon-class="scope.row.icon" />
          </template>
        </template>
      </CMTable>
    </div>

    <RoleAdd ref="add"/>
    <RoleEdit ref="edit"/>
    <RoleMenuScope ref="menuScope"/>
  </div>
</template>

<script>
import RoleAdd from './module/add'
import RoleEdit from './module/edit'
import RoleMenuScope from './module/menuScope'

export default {
    name: "Role",
    components: { RoleAdd,RoleEdit,RoleMenuScope },
    data() {
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
        //this.getTxt(['sys_show_hide','sys_normal_disable']);
        this.queryColumns = getQueryColumns.call(this);
        this.columns = getColumns.call(this);
    },
    mounted(){
        this.getList();
    },
    methods: {
        getList() {
            let param = _.extend(_.pick(this.table,['pageNum','pageSize']),this.$refs.query.getData());
            this.api('role.list',param)
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
        handleDataScope(row){
            //this.$refs.add.onOpen(row,this.getList)
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

export function getQueryColumns(){
    let {listQuery,listReset} = this;
    return [
        {name:'search_LIKE_name',text:'角色名称',type:'input',onKeyup:listQuery},
        {type:'label',searchButton:{listQuery,listReset},size:16}
    ]
}

export function getColumns(){
    let {listQuery,listReset} = this;
    let show = (row)=>{return row.id != 1 };
    let onlyAdmin = (r)=>{
        return r.id!=1 ? true : this.$store.getters.name == 'admin'
    }
    return [
        {type:'selection',width:'55',align:'center',selectable:show},
        {label:'名称',prop:'name',width:'200'},
        {label:'说明',prop:'descn'},
        {label:'创建时间',prop:'createTime',width:'160'},
        {label:'操作',prop:'_',width:'255px',fixed:'right',options:[
                {text:'修改',icon:'el-icon-edit',onShow:onlyAdmin,onClick:this.handleUpdate},
                {text:'删除',icon:'el-icon-delete',onShow:show,onClick:this.handleDelete},
            ]
        }
    ]
}

export function getRules(){
    let {listQuery,listReset} = this;
    return [
        {name:'name',text:'名称',type:'input',onKeyup:listQuery},
        {type:'label',searchButton:{listQuery,listReset}}
    ]
}
</script>
