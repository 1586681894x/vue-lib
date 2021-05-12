<template>
  <!-- 添加或修改车辆管理对话框 -->
  <el-dialog custom-class="cbb_dialog medium" append-to-body
             v-if="dialogInit"
             :close-on-click-modal="true"
             :visible.sync="dialogOpen"
             @close='onClose'
             :close-on-press-escape="false" >
    <div slot="title"><i :class="`iconfont ${row.id?'iconxiugai':'iconxinzeng'}`"/> 菜单 {{row.name}}</div>
    <CMForm ref="form" class="info_dialog"
            :columns="columns"
            :rules="rules"
            :size="12"
            :loading="options.loading">
      <template slot="icon">
        <el-form-item label="菜单图标" size="mini">
          <el-popover
                  placement="bottom-start"
                  width="560"
                  trigger="click"
                  @show="$refs['iconSelect'].reset()"
          >
            <IconSelect ref="iconSelect" @selected="selected" />
            <el-input slot="reference" v-model="form.icon" placeholder="点击选择图标" readonly size="mini">
              <svg-icon
                      v-if="form.icon"
                      slot="prefix"
                      :class="`iconfont ${form.icon}`"
                      style="font-size: 1.2rem;color: #333;"
              />
              <i v-else slot="prefix" class="el-icon-search el-input__icon" />
            </el-input>
          </el-popover>
        </el-form-item>
      </template>
    </CMForm>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="formSubmit" :loading="options.loading">确 定</el-button>
      <el-button @click="onClose">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import IconSelect from "@/components/IconSelect";

  export default {
    name: "MenuAdd",
    row:{icon:'',name:''},
    components: { IconSelect },
    data() {
        return {
            dialogInit:false,
            dialogOpen:false,
            //
            form:{
                icon:''
            },
            options:{
                loading:false
            }
        }
    },
    created(){
        //this.getTxt(['_disable_status','sys_show_hide','sys_normal_disable','sys_user_sex','business_capital']);
        this.columns = getColumns.call(this);
        this.rules = getRules.call(this);
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
      selected(name) {
        this.form.icon = name;
      },
      isChannel(row = {}){
        return !(row.roleIds?.indexOf('104')>-1);
      },
      /** 转换菜单数据结构 */
      normalizer(node) {
          if (node.children && !node.children.length) {
              delete node.children;
          }
          //
          return {
              id: node.id,
              label: node.name,
              children: node.children
          };
      },
      loadList(){
          let ref = this.$refs;
          this.api('menu.listAll','',{}).then((res)=>{
              const menu = { id: 0, name: '主类目', children: [] };
              menu.children = res.data;
              ref.form.resetForm().setColumn({
                  parentId:{options:[menu],value:0}
              }).setData(this.row)
              //
              this.changeMenuType(this.row);
          })
      },
      changeMenuType(item){// MENU URL FUNCTION
          let isHide = item.type === 'FUNCTION';
          let isHideC = item.type === 'MENU';
          this.$refs.form.setColumn({
              icon:{hide:isHide},
              showMode:{hide:isHide||isHideC},
              route:{hide:isHide},
              path:{hide:isHide||isHideC},
              value:{hide:isHideC},
              showState:{hide:isHide},
              status:{hide:isHide},
              //isCache:{hide:isHide||isHideC}
          })
      },
      /** 提交按钮 */
      formSubmit: function() {
          this.$refs.form.validate().then((res)=>{
              let data = _.omit(res,['children']);
              data.icon = this.form.icon;
              if(data.type === 'MENU'){
                data.path = data.parentId == 0 ? 'Layout' : 'Content';
              }
              //
              if (data.id) {
                  this.api('menu.edit',data).then(res => {
                      this.msgSuccess("修改成功");
                      this.onClose();
                      this.onEnd();
                  });
              } else {
                  this.api('menu.add',data).then(response => {
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
          {name:'parentId',text:'上级菜单',type:'treeselect',options:[],size:24,props:{normalizer:this.normalizer}},
          {name:'type',text:'菜单类型',value:'MENU',type:'radio',options:'_menu_type',size:24,onChange:this.changeMenuType},
          {text:'菜单图标',template:'icon',size:24},
          {name:'name',text:'菜单名称',type:'input'},
          // {name:'orderNum',text:'显示排序',type:'number',value:'1'},
          {name:'showMode',text:'是否外链',type:'radio',value:'1',options:'_ok_status'},
          {name:'path',text:'组件路径',type:'input',value:''},
          {name:'value',text:'权限标识',type:'input'},
          {name:'showState',text:'显示状态',type:'radio',value:'0',options:'_show_status'},
          // {name:'status',text:'菜单状态',type:'radio',value:'0',options:'_disable_status'},
      ]
  }

  // roles
  export function getRules(){
      return {
          parentId:_.getRules(["required"]),
          type:_.getRules(["required"]),
          name:_.getRules(["required"])
      }
  }

</script>
