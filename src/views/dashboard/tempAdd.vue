<template>
  <!-- 添加或修改车辆管理对话框 -->
  <el-dialog custom-class="cbb_dialog medium" append-to-body
             v-if="dialogInit"
             :close-on-click-modal="true"
             :visible.sync="dialogOpen"
             @close='onClose'
             :close-on-press-escape="false" >
    <div slot="title"><i class="iconfont iconxiugai"/>  信息</div>
    <CMForm ref="form" class="info_dialog"
            :columns="columns"
            :rules="rules"
            :size="12"
            :loading="options.loading">
    </CMForm>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="formSubmit" :loading="options.loading">确 定</el-button>
      <el-button @click="onClose">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
    export default {
        name: "TempAdd",
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
        created(){
            //this.getTxt(['_disable_status','sys_show_hide','sys_normal_disable','sys_user_sex','business_capital']);
        },
        methods: {
            onOpen (data,callback){
                this.row = data;
                this.onEnd = callback;
                this.dialogInit = true;
                this.dialogOpen = true;
                this.loadList();
                this.form.icon = data.icon;
            },
            onClose (){
                this.dialogOpen = false
            },
            onEnd (){
                //
            },
            loadList(){
                this.api('menu.listAll','')
            },
            /** 提交按钮 */
            formSubmit: function() {
                this.$refs.form.validate().then((res)=>{
                    //
                })
            },
        }
    }


    // columns
    export function getColumns(){
        return [
            {text:'菜单图标',template:'icon',size:24},
            {name:'name',text:'菜单名称',type:'input'},
        ]
    }

    // roles
    export function getRules(){
        return {
            text:_.getRules(["required"])
        }
    }

</script>
