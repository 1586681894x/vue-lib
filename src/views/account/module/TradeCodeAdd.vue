<template>
  <!-- 添加或修改车辆管理对话框 -->
  <el-dialog custom-class="cbb_dialog medium" append-to-body
             v-if="dialogInit"
             :close-on-click-modal="true"
             :visible.sync="dialogOpen"
             @close='onClose'
             :close-on-press-escape="false" >
    <div slot="title"><i class="iconfont iconxiugai"/>  交易码管理</div>
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
        name: "TradeCodeAdd",
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
                if(this.row.id){
                    this.api('accountTradeCode.info',this.row.id).then(({data})=>{
                        this.$refs.form.resetForm().setData(data);
                    })
                }else{
                    _.delay(()=>{
                        this.$refs.form.resetForm();
                    })
                }
            },
            /** 提交按钮 */
            formSubmit: function() {
                this.$refs.form.validate().then((res)=>{
                    if(res.id){
                        this.api('accountTradeCode.edit',res).then(response => {
                            this.msgSuccess("修改成功");
                            this.onClose();
                            this.onEnd();
                        });
                    }else{
                        this.api('accountTradeCode.add',res).then(response => {
                            this.msgSuccess("新增成功");
                            this.onClose();
                            this.onEnd();
                        });
                    }
                })
            },
        }
    }


    // columns
    export function getColumns(){
        return [
            {"name":"tradeCode","text":"交易编码：","type":"input"},
            {"name":"tradeName","text":"交易名称：","type":"input"},
            {"name":"direction","text":"资金方向：","type":"select",options:'tradeCodeDirections'},
            {"name":"comments","text":"备注：","type":"textarea",size:24}
        ]
    }

    // roles
    export function getRules(){
        return {
        }
    }

</script>
