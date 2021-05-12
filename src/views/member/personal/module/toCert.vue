<template>
    <!-- 添加或修改车辆管理对话框 -->
    <el-dialog custom-class="cbb_dialog medium" append-to-body
               v-if="dialogInit"
               :close-on-click-modal="true"
               :visible.sync="dialogOpen"
               @close='onClose'
               :close-on-press-escape="false" >
        <div slot="title"><i class="iconfont iconxiugai"/>  实名认证</div>
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
        name: "PersonalCert",
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
                this.api('memberPersonal.info',this.row.id).then(({data})=>{
                    this.row = _.extend(data,_.pick(this.row,['username','userNo','realName']));
                    this.$refs.form.resetForm().setData(this.row);
                })
            },
            /** 提交按钮 */
            formSubmit: function() {
                this.$refs.form.validate().then((res)=>{
                    let param = this.$refs.form.getData(true);
                    param.id = res.id;
                    this.api('memberPersonal.verify',param).then(()=>{
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
            {name:'username',text:'用户名',type:'text'},
            {name:'certStatus',text:'实名状态',type:'text',options:'memberCertStatuss'},
            {name:'realName',text:'姓名',type:'input'},
            {name:'certType',text:'证件类型',type:'select',options:'memberCertTypes'},
            {name:'certNo',text:'证件号码',type:'input'},
            {name:'certValidityDate',text:'有效期',type:'date'},
            {name:'certFront',text:'正面照片',type:'file'},
            {name:'certBack',text:'反面照片',type:'file'},
            {name:'certHold',text:'手持照片',type:'file'},
        ]
    }

    // roles
    export function getRules(){
        return {
            realName:_.getRules(["required"]),
            certType:_.getRules(["required"]),
            certNo:_.getRules(["required"]),
            certFront:_.getRules(["required"]),
            certBack:_.getRules(["required"]),
            certHold:_.getRules(["required"]),
        }
    }

</script>
