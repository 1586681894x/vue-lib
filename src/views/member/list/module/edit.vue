<template>
  <!-- 添加或修改车辆管理对话框 -->
  <el-dialog custom-class="cbb_dialog medium" append-to-body
             v-if="dialogInit"
             :close-on-click-modal="true"
             :visible.sync="dialogOpen"
             @close='onClose'
             :close-on-press-escape="false" >
    <div slot="title"><i class="iconfont iconxiugai"/>  编辑 - {{row.username}}</div>
    <CMForm ref="form" class="form_text_small"
            :columns="columns"
            :rules="rules"
            :size="12">
      <template slot="br">
        <br />
      </template>
    </CMForm>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="formSubmit" :loading="options.loading">确 定</el-button>
      <el-button @click="onClose">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
    export default {
        name: "MemberEdit",
        data() {
            this.columns = getColumns(this);
            this.rules = getRules(this);
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
                this.row = data;
                this.onEnd = callback;
                this.dialogInit = true;
                this.dialogOpen = true;
                this.$nextTick(()=>{
                    this.$refs.form.resetForm().setData(this.row);
                })
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
                    this.api('member.edit',_.pick(res,['id','status','broker','inviter','grade','comments'])).then(()=>{
                        this.msgSuccess("编辑成功");
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
            {"text":"用户编码：","name":"userNo","type":"text"},
            {"text":"用户名：","name":"username","type":"text"},
            {"text":"用户类型：","name":"userType","type":"text",options:'memberUserTypes'},
            {"text":"手机号码：","name":"mobileNo","type":"text"},
            {"text":"邮件：","name":"email","type":"text"},
            {"text":"姓名：","name":"realName","type":"text"},
            {"text":"身份证号码：","name":"idCardNo","type":"text"},
            {template:'br',size:24},
            {"name":"status","text":"状态：","type":"select",options:'memberStatuss'},
            {"name":"broker","text":"经纪人：","type":"input"},
            {"name":"inviter","text":"介绍人：","type":"input"},
            {"name":"grade","text":"用户等级：","type":"select",options:'memberGrades'},
            {"name":"comments","text":"备注：","type":"textarea",size:24}
        ]
    }

    // roles
    export function getRules(){
        return {
        }
    }

</script>
