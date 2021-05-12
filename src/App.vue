<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default  {
  name:  'App',
  created(){
    window._.$store = this.$store;
  }
}
</script>
