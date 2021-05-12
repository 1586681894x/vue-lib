<template>
  <div>
    <span v-if="showStr('sign')" class="color_link link" @click="showInfo">{{text}}</span>
    <span v-else>{{text}}</span>
    <!--
    <el-tooltip :content="getTxt('order_sign_status',scope.row.signStatus)" :open-delay="800">
      <span v-if="showStatusLink(scope.row,'signStatus')" class="link iconfont iconyiqianyue" @click="dialogSignInfo(scope.row)"></span>
      <span v-else class="gray iconfont iconhetongguanli"></span>
    </el-tooltip>
    -->
  </div>
</template>

<script>
  export default {
    name:'ColumnSignStatus',
    data(){
      let row = this.$attrs.row;
      return {
        row:row,
        text:this.getTxt('order_sign_status',row.signStatus)
      }
    },
    methods:{
      showStr(name){// insure / insured
        let row = this.row;
        switch (name) {
          case 'sign':{
            if(row.signStatus == 1){
              return true
            }
          }
            break;
          default:
            break;
        }
      },
      showInfo(){
        this.$emit('showInfo',this.row)
      }
    }
  }
</script>
