<template>
  <!-- 添加或修改车辆管理对话框 -->
  <el-dialog custom-class="cbb_dialog medium" :title="dialogTitle" append-to-body
             v-if="dialogInit"
             :close-on-click-modal="true"
             :visible.sync="dialogOpen"
             @close='onClose'
             :close-on-press-escape="false" >
    <CMForm ref="form" class="info_dialog"
            :columns="columns"
            :rules="rules"
            :size="12"
            :loading="options.loading"></CMForm>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="formSubmit" :loading="options.loading">确 定</el-button>
      <el-button @click="onClose">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    name: "UserAdd",
    data() {
        return {
            dialogInit:false,
            dialogOpen:false,
            dialogTitle:'-',
            //
            options:{
                loading:false,
                row:{},
                posts:[],
                roles:[]
            }
        }
    },
    created(){
        //this.getTxt(['_disable_status','sys_normal_disable','sys_user_sex','business_capital']);
        this.columns = getColumns.call(this);
        this.rules = getRules.call(this);
    },
    methods: {
      onOpen (data,callback){
        this.row = _.clone(data);
        this.onEnd = callback;
        this.dialogInit = true;
        this.dialogOpen = true;
        this.dialogTitle = data.id ? '用户编辑' : '用户添加';
        this.loadList();
      },
      onClose (){
        this.dialogOpen = false
      },
      onEnd (){
        //
      },
      isChannel(row = {}){
        return !(row.roleIds?.indexOf('104')>-1);
      },
      loadList(){
          let ref = this.$refs, id = this.row?.id;
          this.options.loading = true;
          this.api('user.info',id,{
              onComplete:res=>{
                  let getIds = Function(`return ${res.data?.roleIds}`);
                  this.options.loading = false;
                  this.row = res.entity||{};
                  this.row.roleId = getIds().map((v)=>{return v+''});
                  ref.form.resetForm().setData(this.row);
              }
          })
      },
      changeRole(item){// 资方角色id ： 104
          this.$refs.form.setColumn({infoId:{hide:this.isChannel(item)}})
      },
      /** 提交按钮 */
      formSubmit: function() {
          this.$refs.form.validate().then((res)=>{
              let data = _.extend({
                  id:res.id,
                  role:res.roleId,
                  roleName:res.roleName||'',
                  deptName:res.deptName||'',
              },this.$refs.form.getData(true));
              //
              this.api('user.edit',data).then(res => {
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
      let deptChange = (arr,data)=>{ data.deptName = arr[0]?.k };
      let roleChange = (arr,data)=>{ data.roleName = arr[0]?.k };
      return [
          {name:'username',text:'登陆名称',type:'input',props:{disabled:true}},
          {size:12},
          {name:'realName',text:'真实姓名',type:'input'},
          {name:'email',text:'E-Mail',type:'input'},
          {name:'mobileNo',text:'手机号码',type:'input'},
          {name:'userType',text:'类型',type:'select',options:'_user_type'},
          {name:'status',text:'状态',type:'select',options:'_disable_status'},
          {name:'roleId',text:'角色',type:'select',value:[],options:'role',props:{multiple:true},onOptions:roleChange},
          {name:'orgId',text:'部门',type:'select',options:'dept',onOptions:deptChange},
          {name:'descn',text:'备注',type:'textarea',size:24}
      ]
  }
  // roles
  function getRules(){
      return {
          username:_.getRules(['required']),
          realName:_.getRules(['required']),
          email:_.getRules(['required','email']),
          mobileNo:_.getRules(['required','mobile']),
      }
  }

</script>

<style scoped>
</style>
