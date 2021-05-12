import ColumnInstall from '../Table/install'
import Pagination from "@/components/Pagination";
import RightToolbar from "@/components/RightToolbar"//自定义表格工具扩展
//
import CMButton from './Button'
import CMUpload from './Upload'
import CMPdf from './ViewPdf'
import CMForm from '../Form/form'
import Popover from '../Dialog/Popover'
// dialog
import PreviewImg from '../Dialog/PreviewImg'
import PreviewPdf from '../Dialog/PreviewPdf'

// Global/index.js 公共组件扩展 TODO-add 类似公共组件迁移过来
export default {
  install(Vue) {
    // 挂载到body上,组件动作用handle控制
    function mount(com) {
      if (!com.$this) {
        com.$this = new (Vue.extend(com))();
        document.body.appendChild(com.$this.$mount().$el);
      }
      return com.$this;
    }

    //common compoent
    ColumnInstall(Vue);
    Vue.component('CMButton',CMButton);
    Vue.component('CMUpload',CMUpload);
    Vue.component('CMPdf',CMPdf);
    Vue.component('CMForm',CMForm);
    //
    Vue.component('Pagination', Pagination);
    Vue.component('RightToolbar', RightToolbar);

    //function
    Vue.prototype.DialogPreview = (...arg) => mount(PreviewImg).show(...arg);
    Vue.prototype.DialogPreviewPdf = (...arg) => mount(PreviewPdf).show(...arg);
    Vue.prototype.Popover = (options) => mount(Popover).show(options); // 做着玩
  }
}

