<template>
  <el-container>
    <el-main>
      <el-row type="flex" justify="space-between">
        <el-col :span="11">
          <wallet-card 
            title="Riel account"
            amount="100000"/>
        </el-col>
        <el-col :span="11" >
          <wallet-card 
            :isRiel="false"
            title="Dollar account"
            amount="10000"
            background-color="#e43e33"/>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import { lazyComponent } from '@router'

export default {
  name: 'Dashboard',
  components: {
    WalletCard: lazyComponent('Dashboard/WalletCard')
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
