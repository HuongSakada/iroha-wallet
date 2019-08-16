<template>
<el-container>
  <Menu />
  <el-main style="width: 100%; height: 100vh; padding: 0; padding-left: 200px;">
    <router-view />
  </el-main>
</el-container>
</template>

<script>
import { lazyComponent } from '@router'

export default {
  name: 'Home',
  components: {
    Menu: lazyComponent('Menu')
  },
  data() {
    return {
      
    }
  },
  methods: {

  }
}
</script>

<style scoped>

</style>
