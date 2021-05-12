<template>
  <div class="app-fixed">
    <div class="app-search">
      <!--<CMForm ref="query" class="head-container fl-one" v-show="showSearch" :columns="queryColumns" />-->

      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd()" >新增</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="listQuery"></right-toolbar>
      </el-row>
    </div>
    <CMTable v-table-height="50"
             :columns="columns"
             :options="table"
             row-key="id"
             default-expand-all
             :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <template slot="icontemp">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon" />
        </template>
      </template>
    </CMTable>

    <DeptAdd ref="add"/>
  </div>
</template>

<script>
import DeptAdd from './module/add'

export default {
    name: "Dept",
    components: { DeptAdd },
    data() {
      return {
          showSearch:true,
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
    created() {window.sss = this;
        //this.getTxt(['sys_show_hide','sys_normal_disable']);
        this.queryColumns = getQueryColumns.call(this);
        this.columns = getColumns.call(this);
    },
    mounted(){
        this.getList();
    },
    methods: {
        getList() {
            let param = _.pick(this.table,['pageNum','pageSize']);
            this.api('dept.listTree',param,{
                onComplete:(res)=>{
                    console.log(res);
                    this.table.data = res.rows;
                }
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
        handleAdd(row = {}){
            this.$refs.add.onOpen(row,this.getList)
        },
        handleAddSub(data){
            let row = _.clone(data);
            row.name += '_下级';
            row.parentId = row.id;
            row.id = '';
            this.$refs.add.onOpen(row,this.getList)
        },
        handleUpdate(row){
            this.$refs.add.onOpen(row,this.getList)
        },
        handleDelete(row) {
            this.msgConfirm({content:`是否确认删除名称为 " ${row.name} " 的数据项?`}).then(()=>{
                return this.api('dept.del',row.id);
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
        {name:'deptName',text:'部门名称',type:'input',onKeyup:listQuery},
        {name:'status',text:'状态',value:'',type:'select',options:'sys_normal_disable'},
        {type:'label',searchButton:{listQuery,listReset}}
    ]
}

export function getColumns(){
    let {listQuery,listReset} = this;
    let areaFormat = (row)=>{return `${row.province} / ${row.city} / ${row.county}`}
    return [
        {type:'selection',width:'55',align:'center'},
        {label:'机构名称',prop:'name',width:'160'},
        {label:'状态',prop:'status',formatter:this.format.dict('status','_dept_status')},
        {label:'区域',prop:'position',width:'200',formatter:areaFormat},
        {label:'地址',prop:'address',width:'200'},
        {label:'手机号',prop:'mobileNo',width:'160'},
        {label:'联系人',prop:'contacts'},
        {label:'固定电话',prop:'telephone',width:'160'},
        {label:'邮箱',prop:'email',width:'160'},
        {label:'备注',prop:'memo'},
        {label:'创建时间',prop:'createTime',width:'160',align:'center'},
        {label:'操作',prop:'_',width:'120px',fixed:'right',options:[
                {text:'修改',icon:'iconxiugai',onClick:this.handleUpdate},
                {text:'新增',icon:'iconxinzeng',onClick:this.handleAddSub},
                {text:'删除',icon:'iconshanchu-xianxing',onShow:(row)=>{return row.userId !== 1},onClick:this.handleDelete},
            ]
        }
    ]
}

export function getRules(){
    return {
    }
}
</script>
