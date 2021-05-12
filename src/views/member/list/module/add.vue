<template>
  <!-- 添加或修改车辆管理对话框 -->
  <el-dialog custom-class="cbb_dialog medium" append-to-body
             v-if="dialogInit"
             :close-on-click-modal="true"
             :visible.sync="dialogOpen"
             @close='onClose'
             :close-on-press-escape="false" >
    <div slot="title"><i class="iconfont iconxiugai"/>  添加</div>
    <CMForm ref="form" class="info_dialog"
            :columns="columns"
            :rules="rules"
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
        name: "MemberAdd",
        data() {
            return {
                dialogInit:false,
                dialogOpen:false,
                options:{ loading:false }
            }
        },
        created(){
            //this.getTxt(['_disable_status','sys_show_hide','sys_normal_disable','sys_user_sex','business_capital']);
        },
        methods: {
            onOpen (data,callback){
                this.columns = getColumns(this);
                this.rules = getRules(this);
                this.row = data;
                this.onEnd = callback;
                this.dialogInit = true;
                this.dialogOpen = true;
            },
            onClose (){
                this.dialogOpen = false
            },
            onEnd (){
                //
            },
            /** 提交按钮 */
            formSubmit: function() {
                this.$refs.form.validate().then((res)=>{
                    this.api('member.add',res).then(()=>{
                        this.msgSuccess("新增成功");
                        this.onClose();
                        this.onEnd();
                    })
                })
            },
        }
    }


    // columns
    export function getColumns(){
        return [
            {"name":"userNo","text":"会员编码：","type":"input"},
            {size:12},
            {"name":"username","text":"用户名：","type":"input"},
            {"name":"password","text":"初始密码：","type":"input",props:{type:'password'}},
            {"name":"memberUserType","text":"会员类型","type":"select",options:'memberUserTypes'},
            {"name":"memberActiveType","text":"激活方式","type":"select",options:'memberActiveTypes'},
            {"name":"mobileNo","text":"手机号码：","type":"input",props:{type:'te'}},
            {"name":"email","text":"邮件：","type":"input"},
            {"name":"realName","text":"真名：","type":"input"},
            {"name":"idCardNo","text":"证件号码：","type":"input"},
            {"name":"broker","text":"经纪人：","type":"input"},
            {"name":"inviter","text":"介绍人：","type":"input"},
            {"name":"grade","text":"用户等级：","type":"select",options:'memberGrades'},
            {"name":"comments","text":"备注：","type":"textarea",size:24}
        ]
    }

    // roles
    export function getRules(){
        return {
            username:_.getRules(['required']),
            password:_.getRules(['required']),
            memberUserType:_.getRules(['required']),
            memberActiveType:_.getRules(['required']),
            grade:_.getRules(['required'])
        }
    }

</script>
