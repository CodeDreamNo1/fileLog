<template>
  <div id="app">
    <headers></headers>
    <router-view/>
    <footers></footers>
  </div>
</template>

<script>
import headers from './components/header.vue'
import footers from './components/foot.vue'
export default {
  components: {
      headers,
      footers
		},
}
</script>

<style>
body,ul, li{
  padding: 0;
  margin: 0;
}
a{
  text-decoration: none !important;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
}

</style>
