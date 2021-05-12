<template>
    <!-- 添加或修改车辆管理对话框 -->
    <el-dialog custom-class="cbb_dialog medium" append-to-body
               v-if="dialogInit"
               :close-on-click-modal="true"
               :visible.sync="dialogOpen"
               @close='onClose'
               :close-on-press-escape="false" >
        <div slot="title"><i class="iconfont iconchakan"/>  用户信息</div>
        <CMForm ref="form" class="info_dialog"
                :columns="columns"
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
            return {
                dialogInit:false,
                dialogOpen:false
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
            {name:'username',text:'用户名',type:'text'},
            {name:'maritalStatus',text:'婚姻状况',type:'text',options:'_yes_status'},
            {name:'childrenCount',text:'子女情况',type:'text',options:'_member_children'},
            {name:'educationLevel',text:'教育背景',type:'text',options:'_member_education'},
            {name:'incomeMonth',text:'月收入',type:'text',options:'_member_income'},
            {name:'socialInsurance',text:'社会保险',type:'text',options:'_yes_status'},
            {name:'houseFund',text:'公积金',type:'text',options:'_yes_status'},
            {name:'houseStatue',text:'住房情况',type:'text',options:'_member_rent'},
            {name:'carStatus',text:'是否购车',type:'text',options:'_yes_status'},
            {name:'remark',text:'备注',type:'text'},
        ]
    }

</script>
