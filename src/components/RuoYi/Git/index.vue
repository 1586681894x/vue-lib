<template>
  <div>
    <svg-icon icon-class="github" @click="goto"/>
  </div>
</template>

<script>
export default {
  name: 'CbbGit',
  data() {
    return {
      url: 'https://gitee.com/vehicle-insurance-staging'
    }
  },
  methods: {
    goto() {
      window.open(this.url)
    }
  }
}
</script>