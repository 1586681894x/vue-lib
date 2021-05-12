
<template>
  <!-- 添加或修改车辆管理对话框 -->
  <el-dialog custom-class="cbb_dialog medium" append-to-body
             v-if="dialogInit"
             :close-on-click-modal="true"
             :visible.sync="dialogOpen"
             @close='onClose'
             :close-on-press-escape="false" >
    <div slot="title"><i class="iconfont iconxiugai"/>  会员联系信息</div>
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
        name: "MemberContact",
        data() {
            this.columns = getColumns(this);
            this.rules = getRules(this);
            return {
                dialogInit:false,
                dialogOpen:false,
                options:{
                    dictPrefix:'member',
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
                this.api('memberContact.info',this.row.id).then(({data})=>{
                    this.row = _.extend(data,_.pick(this.row,['userNo','username']));
                    this.$refs.form.resetForm().setData(this.row);
                    this.columns[10].$this.setText([this.row.province,this.row.city,this.row.district]);
                })
            },
            /** 提交按钮 */
            formSubmit: function() {
                this.$refs.form.validate().then((res)=>{
                    let param = _.omit(res,['parentId','area']);
                    if(param.id){
                        this.api('memberContact.edit',param).then(()=>{
                            this.msgSuccess("保存成功");
                            this.onClose();
                            this.onEnd();
                        })
                    }else{
                        this.api('memberContact.add',param).then(()=>{
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
        let areaOptions = (val,data)=>{
            data.province = val[0]?.v;
            data.city = val[1]?.v;
            data.district = val[2]?.v;
        };
        return [
            {name:'username',text:'会员',type:'text'},
            {name:'mobileNo',text:'手机号码',type:'input'},
            {name:'phoneNo',text:'电话号码',type:'input'},
            {name:'email',text:'邮箱',type:'input'},
            {name:'zip',text:'邮政编码',type:'input'},
            {name:'qq',text:'QQ',type:'input'},
            {name:'wechat',text:'MSN',type:'input'},
            {name:'wangwang',text:'旺旺',type:'input'},
            {name:'google',text:'google',type:'input'},
            {name:'facebeek',text:'facebook',type:'input'},
            {name:'area',text:'居住地（省/市/县）',value:[],type:'area',size:24,onOptions:areaOptions},
            {name:'address',text:'详细地址',type:'input',size:24},
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
