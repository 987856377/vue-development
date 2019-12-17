<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import Login from '@/components/Login'
import Index from '@/components/Index'
import Application from '@/components/Application'
export default {
  name: 'app',
  components: {
    Login,
    Index,
    Application
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
    /*
    inear-gradient() 函数用于创建一个线性渐变的 "图像"。
    为了创建一个线性渐变，你需要设置一个起始点和一个方向（指定为一个角度）的渐变效果。你还要定义终止色。
    终止色就是你想让Gecko去平滑的过渡，并且你必须指定至少两种，当然也会可以指定更多的颜色去创建更复杂的渐变效果。
    */
    background-image: linear-gradient(120deg, #3498db, #8e44ad);
  }
</style>
