<template>
  <div class="app-fixed">
    <el-row :gutter="20" class="box">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
        <CMForm class="head-container" :size="24" labelWidth="0"
                ref="queryTree"
                :columns="[{name:'deptName',placeholder:'请输入部门名称',type:'input',props:{prefixIcon:'el-icon-search'}}]"  />
        <div class="head-container">
          <el-tree
            :data="tree.data"
            :props="{ children:'children', label:'name' }"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="20" :xs="24" class="fl">
        <CMForm ref="query" class="head-container fl-one" v-show="showSearch" label-width="6em" :columns="queryColumns" />
        <el-row :gutter="10" class="mb8 fl-one">
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd()"
            >新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate({id:ids[0]})"
            >修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleMulDelete()"
            >删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="info"
              icon="el-icon-upload2"
              size="mini"
              @click="handleImport"
              v-hasPermi="['system:user:import']"
            >导入</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['system:user:export']"
            >导出</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
        <CMTable class="fl-box" @selection-change="handleSelectionChange" :columns="columns" :options="table" v-table-height="50">
          <template slot="status">
            <template slot-scope="scope">
              <el-switch
                      v-model="scope.row.status"
                      active-value="0"
                      inactive-value="1"
                      @change="handleStatusChange(scope.row)"
              ></el-switch>
            </template>
          </template>
        </CMTable>
      </el-col>
    </el-row>

    <!-- 添加或修改参数配置对话框 -->
    <UserAdd ref="add" />
    <UserEdit ref="edit" />
    <ResetPwd ref="resetPwd" />

    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据
          <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import UserAdd from "./module/add";
import UserEdit from "./module/edit";
import ResetPwd from "./module/resetPwd";

export default {
  name: "User",
  components: { UserAdd,UserEdit,ResetPwd },
  data() {
    this.queryColumns = getQueryColumns.call(this);
    this.columns = getColumns.call(this);
    return {
        ids:[],
        single:true,
        multiple:true,
        showSearch:true,
        upload: {
          // 是否显示弹出层（用户导入）
          open: false,
          // 弹出层标题（用户导入）
          title: "",
          // 是否禁用上传
          isUploading: false,
          // 是否更新已经存在的用户数据
          updateSupport: 0,
          // 设置上传的请求头部
          headers: { Authorization: "Bearer " + getToken() },
          // 上传的地址
          url: process.env.VUE_APP_BASE_API + "/system/user/importData"
        },
        initPassword: undefined,// 默认密码
        tree:{
            loading:false,
            data:[]
        },
        table:{
            pageNum: 1,
            pageSize: 10,
            sort: 'id',
            order: 'desc',
            total:0,
            loading:false,
            data:[],
        },
        options:{
            showCapital:false,
            business_capital:[]
        }
    }
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {window.ss = this;
      this.getTxt(['role','dept'])
      this.getTreeselect();
  },
  mounted(){
      this.getList();
  },
  methods: {
      /** 查询用户列表 */
      getList() {
        let param = _.extend(_.pick(this.table,['pageNum','pageSize','id','order','search_EQ_orgId']),this.$refs.query.getData());
        this.api('user.list',param,this.table);
      },
      /** 查询部门下拉树结构 */
      getTreeselect() {
        this.api('dept.listTree','',this.tree);
      },
      // 筛选节点
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      // 节点单击事件
      handleNodeClick(data) {
        this.table.search_EQ_orgId = data.id;
        this.getList();
      },
      // 用户状态修改
      handleStatusChange(row) {
        let status = row.status === '0' ? '1' : '0';
        let statusTxt = this.getTxt('_disable_status',status)?.k;
        this.msgConfirm({content:`确认要${statusTxt} " ${row.userName} "用户吗?`,title:'警告'}).then(function() {
            return this.api('user.changeStatus',row);
          }).then(() => {
            this.msgSuccess(`${statusTxt} 成功!`);
          }).catch(function() {
            row.status = status;
          });
      },
      /** 搜索按钮操作 */
      listQuery() {
          this.table.page = 1;
          this.getList();
      },
      /** 重置按钮操作 */
      listReset() {
          this.$refs.query.resetForm();
          this.table.search_EQ_orgId = "";
          this.listQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id);
        this.single = selection.length != 1;
        this.multiple = !selection.length;
      },
      changeRole(arr){// 资方角色id ： 104
        Object.assign(this.options,{showCapital:arr.indexOf(104)>-1})
      },
      /** 新增按钮操作 */
      handleAdd(row={}) {
          this.$refs.add.onOpen(row,this.getList);
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
          this.$refs.edit.onOpen(row,this.getList);
      },

    /** 重置密码按钮操作 */
    handleResetPwd(row) {
        this.$refs.resetPwd.onOpen(row)
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.msgConfirm({content:`是否确认删除用户为" ${row.username} "的数据项?`}).then(() => {
        return this.api('user.del',row.id);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
    },
    handleMulDelete() {
        this.msgConfirm({content:`确认删除用户?`}).then(() => {
            return this.api('user.del',this.ids.join(','));
        }).then(() => {
            this.getList();
            this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/user/export', {
        ...this.queryParams
      }, `user_${new Date().getTime()}.xlsx`)
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "用户导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download('system/user/importTemplate', {
        ...this.queryParams
      }, `user_${new Date().getTime()}.xlsx`)
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    }
  }
};

export function getQueryColumns(){
    let {listQuery,listReset} = this;
    return [
        {name:'search_LIKE_username',text:'登陆名称',value:'',type:'input',onKeyup:listQuery},
        {name:'search_LIKE_realName',text:'姓名',value:'',type:'input',onKeyup:listQuery},
        {name:'search_EQ_status',text:'状态',value:'',type:'select',options:'_disable_status'},
        {name:'search_EQ_userType',text:'类型',value:'',type:'select',options:'_user_type'},
        {name:'search_EQ_role',text:'角色',value:'',type:'select',options:'role'},
        {type:'label',searchButton:{listQuery,listReset}}
    ]
}

export function getColumns() {
    let show = (row)=>{return row.id != 1 };
    let showIndex = (row)=>{return row.id!=1; }
    return [
        {type:'selection',width:'50',align:'center',selectable:showIndex},
        {label:'登陆名称',prop:'username',width:'120'},
        {label:'姓名',prop:'realName',width:'160'},
        {label:'E-Mail',prop:'email',width:'160'},
        {label:'手机号码',prop:'mobileNo',width:'180'},
        {label:'创建时间',prop:'createTime',width:'160px',align:'center',formatter:this.format.time()},
        {label:'部门',prop:'orgName',align:'center'},
        {label:'状态',prop:'status',align:'center',formatter:this.format.dict('status','_disable_status')},
        {label:'用户类型',prop:'userType',align:'center',formatter:this.format.dict('userType','_user_type')},
        {label:'操作',prop:'_',width:'255px',fixed:'right',className:'small-padding fixed-width',fixed:'right',options:[
              {text:'修改',icon:'el-icon-edit',onShow:show,onClick:this.handleUpdate},
              {text:'删除',icon:'el-icon-delete',onShow:show,onClick:this.handleDelete},
              {text:'重置',icon:'el-icon-key',onShow:show,onClick:this.handleResetPwd}
          ]
        }
    ]
}
</script>

<style scoped>
  .box{height:100%;}
  .box>div{height:100%;}
</style>
