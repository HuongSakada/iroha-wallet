<template>
  <el-container>
    <el-main>
      <el-row :gutter="17" style="margin-bottom: 1.25rem">
        <el-col :span="12">
          <wallet-card 
            title="Riel account"
            amount="100000"/>
        </el-col>
        <el-col :span="12" >
          <wallet-card 
            :isRiel="false"
            title="Dollar account"
            amount="10000"
            background-color="#e43e33"/>
        </el-col>
      </el-row>

      <el-row>
        <el-card>
          <Transaction :transactions="accountTransactions"/>
        </el-card>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { lazyComponent } from '@router'

export default {
  name: 'Dashboard',
  components: {
    WalletCard: lazyComponent('Dashboard/WalletCard'),
    Transaction: lazyComponent('Transactions/Transaction')
  },
  computed: {
    ...mapGetters({
      accountTransactions: 'getAccountTransactions'
    })
  },
  created () {
    this.getAllAccountAssetsTransactions()
  },
  methods: {
    ...mapActions([
      'getAllAccountAssetsTransactions'
    ])
  }
}
</script>

<style scoped>

</style>
