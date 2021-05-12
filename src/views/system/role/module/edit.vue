<template>
  <!-- 添加或修改车辆管理对话框 -->
  <el-dialog custom-class="cbb_dialog" :width="'580px'" :title="dialogTitle" append-to-body
             v-if="dialogInit"
             :close-on-click-modal="true"
             :visible.sync="dialogOpen"
             @close='onClose'
             :close-on-press-escape="false" >
    <CMForm ref="form" class="info_dialog"
            :columns="columns"
            :rules="rules"
            :size="24"
            :loading="options.loading">
      <template slot="scopetree">
        <el-form-item label="菜单权限">
          <el-checkbox @change="handleCheckedTreeExpand($event, 'menu')">展开/折叠</el-checkbox>
          <el-checkbox @change="handleCheckedTreeNodeAll($event, 'menu')">全选/全不选</el-checkbox>
          <el-checkbox v-model="form.menuCheckStrictly" @change="handleCheckedTreeConnect($event, 'menu')">父子联动</el-checkbox>
          <el-tree
                  class="tree-border"
                  :data="form.menuOptions"
                  default-expand-all
                  show-checkbox
                  ref="menu"
                  node-key="id"
                  :check-strictly="!form.menuCheckStrictly"
                  empty-text="加载中，请稍后"
                  :props="treeProps"
          ></el-tree>
        </el-form-item>
      </template>
    </CMForm>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="formSubmit" :loading="options.loading">确 定</el-button>
      <el-button @click="onClose">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
    import IconSelect from "@/components/IconSelect";

    export default {
        name: "MenuAdd",
        components: { IconSelect },
        data() {
            return {
                dialogInit:false,
                dialogOpen:false,
                dialogTitle:'-',
                //
                treeProps:Object.freeze({children:"children",label:"name"}),
                columns:getColumns.call(this),
                rules:getRules.call(this),
                form:{
                    menuOptions:[],
                    menuCheckStrictly:true
                },
                options:{
                    loading:false
                }
            }
        },
        created(){window.sss = this;
            //this.getTxt(['_disable_status','sys_show_hide','sys_normal_disable','sys_user_sex','business_capital']);
        },
        methods: {
            onOpen (data,callback){
                this.row = data;
                this.onEnd = callback;
                this.dialogInit = true;
                this.dialogOpen = true;
                this.dialogTitle = data.id ? '角色编辑' : '角色添加';
                this.loadList();
            },
            onClose (){
                this.dialogOpen = false
            },
            onEnd (){
                //
            },
            loadList(){
                let ref = this.$refs, row = this.row;
                this.api('menu.treeByRole',row.id,{
                    onComplete:(res)=>{
                        let rows = res.rows;
                        this.form.menuOptions = rows;
                        //
                        let defaultChecked = [];
                        _.mapDeep(rows,(v)=>{
                            if(!v.children.length && v.checked){
                                defaultChecked.push(v.id);
                            }
                        })
                        ref.menu.setCheckedKeys(defaultChecked);
                    }
                })
                // row - info
                if(row.id){
                    this.api('role.info',row.id,{
                        onComplete:(res)=>{
                            this.row = res.entity;
                            ref.form.resetForm().setData(_.pick(this.row,['id','name','descn']));
                        }
                    })
                }else{
                    ref.form.resetForm();
                }
            },
            // 树权限（展开/折叠）
            handleCheckedTreeExpand(value, type) {
                if (type == 'menu') {
                    let treeList = this.form.menuOptions;
                    for (let i = 0; i < treeList.length; i++) {
                        this.$refs.menu.store.nodesMap[treeList[i].id].expanded = value;
                    }
                } else if (type == 'dept') {
                    let treeList = this.deptOptions;
                    for (let i = 0; i < treeList.length; i++) {
                        this.$refs.dept.store.nodesMap[treeList[i].id].expanded = value;
                    }
                }
            },
            // 树权限（全选/全不选）
            handleCheckedTreeNodeAll(value, type) {
                if (type == 'menu') {
                    this.$refs.menu.setCheckedNodes(value ? this.form.menuOptions: []);
                } else if (type == 'dept') {
                    this.$refs.dept.setCheckedNodes(value ? this.deptOptions: []);
                }
            },
            // 树权限（父子联动）
            handleCheckedTreeConnect(value, type) {
                if (type == 'menu') {
                    this.form.menuCheckStrictly = value ? true: false;
                } else if (type == 'dept') {
                    this.form.deptCheckStrictly = value ? true: false;
                }
            },
            // 树权限（父子联动）
            handleCheckedTreeConnect(value, type) {
                if (type == 'menu') {
                    this.form.menuCheckStrictly = value ? true: false;
                } else if (type == 'dept') {
                    this.form.deptCheckStrictly = value ? true: false;
                }
            },
            // 所有菜单节点数据
            getMenuAllCheckedKeys() {
                // 目前被选中的菜单节点
                let checkedKeys = this.$refs.menu.getCheckedKeys();
                // 半选中的菜单节点
                let halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys();
                checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
                return checkedKeys;
            },
            /** 提交按钮 */
            formSubmit: function() {
                this.$refs.form.validate().then((data)=>{
                    data.resourceIds = this.getMenuAllCheckedKeys();
                    this.api('role.edit',data).then(res => {
                        this.msgSuccess("修改成功");
                        this.onClose();
                        this.onEnd();
                    });
                })
            },
        }
    }


    // columns
    function getColumns(){
        return [
            {name:'name',text:'角色名称',type:'input',props:{disabled:true}},
            {name:'descn',text:'备注',type:'textarea',value:'',props:{disabled:false}},
            {template:'scopetree',text:'菜单权限'},
        ]
    }
    // roles
    function getRules(){
        return {
        }
    }

</script>
