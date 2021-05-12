<template>
  <div class="top-right-btn">
    <el-row>
      <el-tooltip class="item" effect="dark" :content="showSearch ? '隐藏搜索' : '显示搜索'" placement="bottom">
        <el-button size="mini" circle @click="toggleSearch()" >
          <span :class="`iconfont ${showSearch?'iconshangjiantou-xianxing':'iconxiajiantou-xianxing'}`" style="font-size:12px;"/>
        </el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="刷新" placement="bottom">
        <el-button size="mini" circle icon="el-icon-refresh" @click="refresh()" />
      </el-tooltip>
    </el-row>
  </div>
</template>
<script>
export default {
  name: "RightToolbar",
  data() {
    return {};
  },
  props: {
    showSearch: {
      type: Boolean,
      default: true,
    },
  },

  methods: {
    //搜索
    toggleSearch() {
      this.$emit("update:showSearch", !this.showSearch);
      // 因无法自动触发： tableHeight指令 - 辅助函数
      _.delay(()=>{ document.body.querySelector('.app-fixed>.app-table')?.autoHeight() })
    },
    //刷新
    refresh() {
      this.$emit("queryTable");
    },
  },
};
</script>
