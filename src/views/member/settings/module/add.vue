<template>
  <!-- 添加或修改车辆管理对话框 -->
  <el-dialog custom-class="cbb_dialog medium" append-to-body
             v-if="dialogInit"
             :close-on-click-modal="true"
             :visible.sync="dialogOpen"
             @close='onClose'
             :close-on-press-escape="false" >
    <div slot="title"><i class="iconfont iconxiugai"/>  配置信息  {{row.userNo}}</div>
    <CMForm ref="form" class="info_dialog"
            :columns="columns"
            :rules="rules"
            :size="12"
            :loading="options.loading">
    </CMForm>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="formSubmit" :loading="options.loading">修 改</el-button>
      <el-button @click="onClose">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
    export default {
        name: "MemberSetting",
        row:{userNo:''},
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
                this.loadList();
            },
            onClose (){
                this.dialogOpen = false
            },
            onEnd (){
                //
            },
            loadList(){
                this.api('memberProfile.info',this.row.id).then(({data})=>{
                    this.row = _.extend(data,_.pick(this.row,['username','userNo','realName']));
                    this.$refs.form.resetForm().setData(this.row);
                })
            },
            /** 提交按钮 */
            formSubmit: function() {
                this.$refs.form.validate().then((res)=>{
                    let param = _.omit(res,['parentId','area']);
                    if(param.id){
                        this.api('memberProfile.edit',param).then(()=>{
                            this.msgSuccess("保存成功");
                            this.onClose();
                            this.onEnd();
                        })
                    }else{
                        this.api('memberProfile.add',param).then(()=>{
                            this.msgSuccess("保存成功");
                            this.onClose();
                            this.onEnd();
                        })
                    }
                })
            },
        }
    }


    // columns
    export function getColumns(){
        return [
            {name:'username',text:'用户',type:'text'},
            {size:12},
            {name:'realName',text:'昵称',type:'input'},
            {name:'dailyWords',text:'个性签名',type:'input'},
            {name:'profilePhotoType',text:'头像类型',type:'select',options:"memberProfilePhotoTypes"},
            {name:'profilePhoto',text:'头像',type:'input'},
            {name:'smsSendStatus',text:'短信静默',type:'select',options:'_yes_status'},
            {size:12},
            {name:'realNameStatus',text:'实名认证',type:'text',options:'_yes_status'},
            {name:'mobileNoStatus',text:'手机认证',type:'text',options:'_yes_status'},
            {name:'emailStatus',text:'邮箱认证',type:'text',options:'_yes_status'},
            {name:'n1',text:'安全问题',type:'text',options:'_yes_status'},
            {name:'comments',text:'备注',type:'textarea',size:24},
        ]
    }

    // roles
    export function getRules(){
        return {
            text:_.getRules(["required"])
        }
    }

</script>
