<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import Login from '@/components/Login'
import Index from '@/components/Index'
export default {
  name: 'app',
  components: {
    Login,
    Index
  }
}
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    /* margin-top: 60px; */
  }
</style>
