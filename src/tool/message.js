import Vue from 'vue'
import _ from 'lodash'

// Vue.prototype.$loading = Loading.service;
// Vue.prototype.$msgbox = MessageBox;
// Vue.prototype.$alert = MessageBox.alert;
// Vue.prototype.$confirm = MessageBox.confirm;
// Vue.prototype.$prompt = MessageBox.prompt;
// Vue.prototype.$notify = Notification;
// Vue.prototype.$message = Message;
// ----------- message function --------------
Vue.prototype.msgSuccess = _.debounce(function (msg) {
  this.$message({ showClose: true, message: msg, type: "success" });
},100)

Vue.prototype.msgError = _.debounce(function (msg) {
  this.$message({ showClose: true, message: msg, type: "error" });
},100)

Vue.prototype.msgInfo = _.debounce(function (msg) {
  this.$message.info(msg);
},100)

Vue.prototype.msgWarning = _.debounce(function (msg) {
  this.$message.warning(msg);
},100)

// confirm {title:'删除',content:'',type:'warning'}
Vue.prototype.msgConfirm = function(opt){
  opt = _.extend({
      content:'',
      title:'删除',
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
      dangerouslyUseHTMLString:true
  },opt);
  return this.$confirm(opt.content, opt.title,opt);
}

