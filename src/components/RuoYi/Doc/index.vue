<template>
  <div>
    <svg-icon icon-class="question" @click="goto"/>
  </div>
</template>

<script>
export default {
  name: 'CbbDoc',
  data() {
    return {
      url: 'https://gitee.com/rblianyin/dashboard/issues'
    }
  },
  methods: {
    goto() {
      window.open(this.url)
    }
  }
}
</script>