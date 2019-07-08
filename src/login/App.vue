<template>
  <div id="app">
    <Login></Login>
  </div>
</template>
<script>
  import Login from './views/Login.vue';

  export default {
    components: {
      Login
    }
  }
</script>

<style>
  body {
    height: 100%;
    width: 100%;
    background: url("../assets/images/login-bg.jpeg") no-repeat;
    background-size: cover;
  }
</style>