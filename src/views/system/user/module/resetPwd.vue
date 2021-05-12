<template>
  <el-dialog custom-class="cbb_dialog" :title="dialogTitle" append-to-body width="420px"
             v-if="dialogInit"
             :close-on-click-modal="true"
             :visible.sync="dialogOpen"
             @close='onClose'
             :close-on-press-escape="false" >
    <CMForm ref="form" class="info_dialog"
            :columns="columns"
            :rules="rules"
            :size="24"
            :loading="options.loading"></CMForm>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="formSubmit" :loading="options.loading">确 定</el-button>
      <el-button @click="onClose">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    name: "UserResetPwd",
    data() {
        this.columns = getColumns.call(this);
        this.rules = getRules.call(this);
        return {
            dialogInit:false,
            dialogOpen:false,
            dialogTitle:'-',
            //
            options:{
                loading:false
            }
        }
    },
    methods: {
      onOpen (data,callback){
        this.row = _.clone(data);
        this.onEnd = callback;
        this.dialogInit = true;
        this.dialogOpen = true;
        this.dialogTitle = `重置密码 （ ${data.username} ）`;
        this.$refs.form.resetForm();
      },
      onClose (){
        this.dialogOpen = false
      },
      onEnd (){
        //
      },
      /** 提交按钮 */
      formSubmit: function() {
          this.$refs.form.validate().then((data)=>{
              if(data.newPassword !== data.confirmNewPassword){
                this.msgWarning("新密码输入不一致！");
                return;
              }
              //
              data.id = this.row.id;
              this.api("user.updatePwd",data).then(response => {
                  this.msgSuccess("修改成功，新密码是：" + data.newPassword);
                  this.onClose();
              });
          })
      },
    }
  }


  // columns
  function getColumns(){
      return [
          {name:'newPassword',text:'设置新密码',type:'input',props:{type:'password'}},
          {name:'confirmNewPassword',text:'确认新密码',type:'input',props:{type:'password'}},
          {name:'adminPassword',text:'当前用户密码',type:'input',props:{type:'password'}},
      ]
  }
  // roles
  function getRules(){
      return {
          newPassword:_.getRules(['required']),
          confirmNewPassword:_.getRules(['required']),
          adminPassword:_.getRules(['required'])
      }
  }

</script>

<style scoped>
</style>
