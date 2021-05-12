<template>
  <!-- 添加或修改车辆管理对话框 -->
  <el-dialog custom-class="cbb_dialog medium" :title="dialogTitle" append-to-body
             v-if="dialogInit"
             :close-on-click-modal="true"
             :visible.sync="dialogOpen"
             @close='onClose'
             :close-on-press-escape="false" >
    <CMForm ref="form" class="info_dialog"
            label-width="7em"
            :columns="columns"
            :rules="rules"
            :size="12"
            :loading="form.loading">
    </CMForm>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="formSubmit" :loading="form.loading">确 定</el-button>
      <el-button @click="onClose">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
    import IconSelect from "@/components/IconSelect";

    export default {
        name: "DeptAdd",
        components: { IconSelect },
        data() {
            return {
                dialogInit:false,
                dialogOpen:false,
                dialogTitle:'-',
                //
                form:{
                    loading:false,
                    data:[]
                }
            }
        },
        created(){
            //this.getTxt(['_disable_status','sys_show_hide','sys_normal_disable','sys_user_sex','business_capital']);
            this.columns = getColumns.call(this);
            this.rules = getRules.call(this);
        },
        methods: {
            onOpen (data,callback){
                this.row = _.clone(data);
                this.onEnd = callback;
                this.dialogInit = true;
                this.dialogOpen = true;
                this.dialogTitle = data.id ? '部门编辑' : '部门添加';
                this.loadList();
            },
            onClose (){
                this.dialogOpen = false
            },
            onEnd (){
                //
            },
            /** 转换菜单数据结构 */
            normalizer (node){
                if (node.children && !node.children.length) {
                    delete node.children;
                }
                return {
                    id: node.id,
                    label: node.name,
                    children: node.children
                };
            },
            loadList(){
                let ref = this.$refs, row = this.row;
                this.api('dept.listTree','',this.form).then((res)=>{
                    const menu = { id: 0, name: '公司', children: [] };
                    menu.children = Object.freeze(res.data);
                    ref.form.resetForm().setColumn({
                        parentId:{options:[menu]}
                    }).setData(row);
                    this.columns[3].$this.setText([row.province,row.city,row.county]);
                })
            },
            /** 提交按钮 */
            formSubmit: function() {
                let isEdit = Boolean(this.row.id);
                this.$refs.form.validate().then((data)=>{
                    if (isEdit) {
                        this.api('dept.edit',_.omit(data,['area','children'])).then(res => {
                            this.msgSuccess("修改成功");
                            this.onClose();
                            this.onEnd(data);
                        });
                    } else {
                        this.api('dept.add',_.omit(data,['id','area','children'])).then(response => {
                            this.msgSuccess("新增成功");
                            this.onClose();
                            this.onEnd(data);
                        });
                    }
                })
            },
        }
    }


    // columns
    function getColumns(){
        let areaOptions = (arr,row)=>_.extend(row,{
            province: arr[0].v,
            city: arr[1].v,
            county: arr[2].v,
        });
        //
        return [
            {name:'parentId',text:'上级部门',type:'treeselect',value:'0',options:[{ id: 0, name: '公司', children: [] }],size:24,props:{normalizer:this.normalizer}},
            {name:'name',text:'部门名称',type:'input'},
            {name:'status',text:'部门状态',type:'radio',value:'valid',options:'_dept_status'},
            {name:'area',text:'区域',type:'area',onOptions:areaOptions},
            {name:'mobileNo',text:'手机号',type:'input'},
            {name:'email',text:'邮箱',type:'input'},
            {name:'address',text:'地址',type:'input'},
            {name:'contacts',text:'联系人',type:'input'},
            {name:'telephone',text:'固定电话',type:'input'},
            {name:'memo',text:'备注',type:'textarea',size:24},
        ]
    }
    // roles
    function getRules(){
        return {
            parentId:_.getRules(['required']),
            name:_.getRules(['required']),
            mobileNo:_.getRules(['mobile']),
            email:_.getRules(['email']),
        }
    }

</script>
