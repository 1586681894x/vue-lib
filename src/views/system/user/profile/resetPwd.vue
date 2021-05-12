<template>
  <el-form ref="form" :model="user" :rules="rules" label-width="10em">
    <el-form-item label="旧密码" prop="password">
      <el-input v-model="user.password" placeholder="请输入旧密码" type="password" />
    </el-form-item>
    <el-form-item label="新密码" prop="newPassword">
      <el-input v-model="user.newPassword" placeholder="请输入新密码" type="password" />
    </el-form-item>
    <el-form-item label="确认密码" prop="confirmNewPassword">
      <el-input v-model="user.confirmNewPassword" placeholder="请确认密码" type="password" />
    </el-form-item>
    <el-form-item prop="passwordCaptcha" label-width="0">
      <div class="fl-r">
        <div class="fl-one" @click="getCode" style="width:10em;padding:0 2em;">
          <img :src="codeUrl" class="login-code-img"/>
        </div>
        <div class="fl-box">
          <el-input v-model="user.passwordCaptcha" placeholder="验证码" type="input" />
        </div>
      </div>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" @click="submit">保存</el-button>
      <el-button type="danger" size="mini" @click="close">关闭</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (this.user.newPassword !== value) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    return {
      test: "1test",
      codeUrl:'',
      user: {},
      // 表单校验
      rules: {
        password: [
          { required: true, message: "旧密码不能为空", trigger: "blur" }
        ],
        newPassword: [
          { required: true, message: "新密码不能为空", trigger: "blur" },
          { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" }
        ],
        confirmNewPassword: [
          { required: true, message: "确认密码不能为空", trigger: "blur" },
          { required: true, validator: equalToPassword, trigger: "blur" }
        ],
        passwordCaptcha:[
          { required: true, message: "验证码不能为空", trigger: "blur" }
        ]
      }
    };
  },
  mounted(){
    this.getCode();
  },
  methods: {
    getCode(){
        this.api('config.code','',{
            onComplete:res => {
                this.codeUrl = `data:imge/png;base64,${res.data}`;
            }
        })
    },
    submit() {
      let form = this.$refs["form"];
      form.validate(valid => {
        if (valid) {
          this.api('config.updatePwd',this.user).then(
            response => {
              this.msgSuccess("修改成功");
              form.resetFields()
            }
          );
        }
      });
    },
    close() {
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.push({ path: "/index" });
    }
  }
};
</script>
