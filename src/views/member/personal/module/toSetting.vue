<template>
    <!-- 添加或修改车辆管理对话框 -->
    <el-dialog custom-class="cbb_dialog medium" append-to-body
               v-if="dialogInit"
               :close-on-click-modal="true"
               :visible.sync="dialogOpen"
               @close='onClose'
               :close-on-press-escape="false" >
        <div slot="title"><i class="iconfont iconxiugai"/>  完善用户信息</div>
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
        name: "PersonalSetting",
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
                    this.api('memberPersonal.edit',param).then(()=>{
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
            {size:12},
            {name:'maritalStatus',text:'婚姻状况',type:'select',options:'_yes_status'},
            {name:'childrenCount',text:'子女情况',type:'select',options:'_memberChildrenCounts'},
            {name:'educationLevel',text:'教育背景',type:'select',options:'memberEducationLevels'},
            {name:'incomeMonth',text:'月收入',type:'select',options:'memberIncomeMonths'},
            {name:'socialInsurance',text:'社会保险',type:'select',options:'_yes_status'},
            {name:'houseFund',text:'公积金',type:'select',options:'_yes_status'},
            {name:'houseStatue',text:'住房情况',type:'select',options:'memberHouseStatues'},
            {name:'carStatus',text:'是否购车',type:'select',options:'_yes_status'},
            {name:'remark',text:'备注',type:'textarea',size:24},
        ]
    }

    // roles
    export function getRules(){
        return {
            maritalStatus:_.getRules(['required']),
            childrenCount:_.getRules(['required']),
            educationLevel:_.getRules(['required']),
            incomeMonth:_.getRules(['required']),
            socialInsurance:_.getRules(['required']),
            houseFund:_.getRules(['required']),
            houseStatue:_.getRules(['required']),
            carStatus:_.getRules(['required'])
        }
    }

</script>
