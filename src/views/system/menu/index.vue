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
        <right-toolbar :showSearch.sync="showSearch" @queryTable="listQuery"></right-toolbar>
      </el-row>
    </div>
    <CMTable row-key="id" v-table-height
             :columns="columns"
             :options="options"
             :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <template slot="icontemp">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon" />
        </template>
      </template>
    </CMTable>

    <MenuAdd ref="add"/>
  </div>
</template>

<script>
import MenuAdd from './module/add'

export default {
    name: "Menu",
    components: { MenuAdd },
    data() {
      return {
          queryColumns: getQueryColumns.call(this),
          columns:getColumns.call(this),
          showSearch:true,
          options:{
              loading:false,
              total:0,
              data:[]
          }
      };
    },
    created() {
        this.getTxt(['_show_status','_disable_status']);
    },
    mounted(){
        this.getList();
    },
    methods: {
        getList() {
            let param = _.extend(_.pick(this.table,['pageNum','pageSize']),this.$refs.query.getData());
            this.api('menu.listAll',param)
        },
        listQuery() {
            this.getList();
        },
        listReset() {
            this.$refs.query.resetForm();
            this.listQuery();
        },
        handleAdd(row = {id:0}){
            this.$refs.add.onOpen({parentId:row.id,type:'MENU'},this.getList)
        },
        handleUpdate(row){
            this.$refs.add.onOpen(row,this.getList)
        },
        handleDelete(row) {
            this.msgConfirm({content:`是否确认删除名称为 " ${row.name} " 的数据项?`}).then((res)=>{
                return this.api('menu.del',row.id);
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
        {name:'menuName',text:'菜单名称',type:'input',onKeyup:listQuery},
        {name:'status',text:'状态',value:'',type:'select',options:'_show_status',onKeyup:listQuery},
        {type:'label',searchButton:{listQuery,listReset}}
    ]
}

// {
//     "id":2,
//     "parentId":1,
//     "name":"账户管理",
//     "type":"URL",// 资源类型
//     "showMode":1,  // 是否外链：否
//     "orderTime":"2015-01-10 00:00:01",
//     "value":"/manage/system/user/index.html", // 权限验证
//     "path":"/manage/system/user/index.html", // 组件地址
//     "icon":"fa-user",
//     "iconSkin":"fa-user",
//     "showState":0, // 显示状态 : 显示
//     "checked":false,
//     "children":[
//
//     ]
// }
export function getColumns(){
    let {listQuery,listReset} = this;
    return [
        {label:'菜单名称',prop:'name',width:'160'},
        {label:'路由地址',prop:'path',width:'200'},
        {label:'图标',template:'icon'},
        {label:'状态',prop:'showState',align:'center',formatter:this.format.dict('showState','_show_status')},
        {label:'创建时间',prop:'orderTime',width:'160'},
        {label:'操作',prop:'_',width:'120px',fixed:'right',options:[
                {text:'修改',icon:'iconxiugai',onClick:this.handleUpdate},
                {text:'新增',icon:'iconxinzeng',onClick:this.handleAdd},
                {text:'删除',icon:'iconshanchu-xianxing',onShow:(row)=>{return row.userId !== 1},onClick:this.handleDelete},
            ]
        }
    ]
}

export function getRules(){
    let {listQuery,listReset} = this;
    return [
        {name:'menuName',text:'菜单名称',type:'input',onKeyup:listQuery},
        {name:'status',text:'状态',type:'select',options:'_disable_status',onKeyup:listQuery},
        {type:'label',searchButton:{listQuery,listReset}}
    ]
}
</script>
