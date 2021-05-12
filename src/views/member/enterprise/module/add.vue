<template>
  <!-- 添加或修改车辆管理对话框 -->
  <el-dialog custom-class="cbb_dialog medium" append-to-body
             v-if="dialogInit"
             :close-on-click-modal="true"
             :visible.sync="dialogOpen"
             @close='onClose'
             :close-on-press-escape="false" >
    <div slot="title"><i class="iconfont iconxiugai"/>  企业信息</div>
    <CMForm ref="form" class="info_dialog"
            :columns="columns"
            :rules="rules"
            :size="24"
            label-width="15em"
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
        name: "MemberEnterprise",
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
            },
            onClose (){
                this.dialogOpen = false
            },
            onEnd (){
                //
            },
            loadList(){
                this.api('memberEnterprise.info',this.row.id).then(({data})=>{
                    this.row = _.extend(data,_.pick(this.row,['userNo','username']));
                    this.$refs.form.resetForm().setData(this.row);
                })
            },
            /** 提交按钮 */
            formSubmit: function() {
                this.$refs.form.validate().then((res)=>{
                    this.api('memberEnterprise.edit',res).then(()=>{
                        this.msgSuccess("保存成功");
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
            {"name":"userNo","text":"用户编码：","type":"text",size:12},
            {"name":"username","text":"用户名：","type":"text",size:12},
            {"name":"entType","text":"企业类型：","type":"select",options:'memberEntTypes'},
            {"name":"entName","text":"企业名称：","type":"input"},
            {"name":"licenceNo","text":"社会统一信用代码：","type":"input"},
            {"name":"licencePath","text":"营业执照图片：","type":"file"},
            {"name":"licenceAddress","text":"营业执照地址：","type":"input"},
            {"name":"businessLife","text":"营业年限：","type":"input"},
            {"name":"legalName","text":"法人姓名：","type":"input"},
            {"name":"legalCertType","text":"法人证件类型：","type":"select",options:"memberLegalCertTypes"},
            {"name":"legalCertNo","text":"法人证件号码：","type":"input"},
            {"name":"legalCertValidTime","text":"法人证件到期时间：","type":"input"},
            {"name":"legalCertFrontPath","text":"法人证件正面图片：","type":"file",size:12},
            {"name":"legalCertBackPath","text":"法人证件背面图片：","type":"file",size:12},
            {"name":"businessScope","text":"经营范围：","type":"input"},
            {"name":"holdingEnum","text":"实际控股人或企业类型：","type":"select",options:'memberHoldingEnums'},
            {"name":"holdingName","text":"股东或实际控制人真实姓名：","type":"input"},
            {"name":"holdingCertType","text":"实际控制人证件类型：","type":"select",options:'memberHoldingCertTypes'},
            {"name":"holdingCertNo","text":"实际控制人证件号：","type":"input"},
            {"name":"holdingCertValidTime","text":"实际控制人证件到期时间：","type":"input"},
            {"name":"holdingCertFrontPathFile","text":"实际控制人证件正面：","type":"file",size:12},
            {"name":"holdingCertBackPathFile","text":"实际控制人证件背面：","type":"file",size:12},
            {"name":"accountLicenseNo","text":"开户许可证号码：","type":"input"},
            {"name":"taxAuthorityNo","text":"税务登记证号码：","type":"input"},
            {"name":"accountLicensePath","text":"开户许可证：","type":"file",size:12},
            {"name":"taxAuthorityPath","text":"税务登记证图片：","type":"file",size:12},
            {"name":"certStatus","text":"是否实名：","type":"select",options:'_ok_status'},
            {"name":"comments","text":"备注：","type":"input"}
        ]
    }

    // roles
    export function getRules(){
        return {
            text:_.getRules(["required"])
        }
    }

</script>
