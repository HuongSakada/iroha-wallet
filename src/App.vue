<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.wrapper {
  display: flex;
  justify-content: center;
}
.app-form {
  width: 25rem;
}
.fullwidth {
  width: 100% !important;
}
.auth-container-info {
  margin-top: 3.5em;
  margin-bottom: 1rem;
  font-size: 0.9em;
  text-align: center;
}
</style>
