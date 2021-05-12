<template>
  <!-- 添加或修改车辆管理对话框 -->
  <el-dialog custom-class="cbb_dialog small" append-to-body
             v-if="dialogInit"
             :close-on-click-modal="true"
             :visible.sync="dialogOpen"
             @close='onClose'
             :close-on-press-escape="false" >
    <div slot="title"><i :class="`iconfont ${row.id ? 'iconxiugai':'iconxinzeng'}`"/>  邮件模板</div>
    <CMForm ref="form"
            :columns="columns"
            :rules="rules"
            :loading="options.loading"
            :size="12">
    </CMForm>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="formSubmit" :loading="options.loading">确 定</el-button>
      <el-button @click="onClose">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
    export default {
        name: "EmailAdd",
        data() {
            this.columns = getColumns(this);
            this.rules = getRules(this);
            return {
                dialogInit:false,
                dialogOpen:false,
                options:{
                    loading:false
                }
            }
        },
        created(){window.ss = this;
            //this.getTxt(['_disable_status','sys_show_hide','sys_normal_disable','sys_user_sex','business_capital']);
        },
        methods: {
            onOpen (data,callback){
                this.row = data;
                this.onEnd = callback;
                this.dialogInit = true;
                this.dialogOpen = true;
                this.options.loading = false;
                this.loadList();
            },
            onClose (){
                this.dialogOpen = false
            },
            onEnd (){
                //
            },
            loadList(){
                if(this.row.id){
                  this.api('commonEmail.info',this.row.id).then(({data})=>{
                      this.$refs.form.resetForm().setData(data);
                  })
                }else{
                  _.delay(()=>{
                      this.$refs.form.resetForm();
                  })
                }
            },
            formSubmit(){
                this.$refs.form.validate().then((res)=>{
                    if(res.id){
                        this.api('commonEmail.edit',res).then(response => {
                            this.msgSuccess("修改成功");
                            this.onClose();
                            this.onEnd();
                        });
                    }else{
                        this.api('commonEmail.add',res).then(response => {
                            this.msgSuccess("新增成功");
                            this.onClose();
                            this.onEnd();
                        });
                    }
                })
            },
        }
    }

    // columns
    export function getColumns(){
        return [
            {name:'name',text:'模板名称',type:'input',size:24},
            {name:'subject',text:'模板邮件主题',type:'input',size:24},
            {name:'content',text:'模板邮件内容',type:'textarea',props:{autosize:{ minRows: 2, maxRows: 6 }},size:24},
        ]
    }

    // roles
    export function getRules(){
        return {
            name:_.getRules(["required"]),
            subject:_.getRules(["required"]),
            content:_.getRules(["required"])
        }
    }

</script>
