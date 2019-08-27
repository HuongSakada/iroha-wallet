<template>
  <el-container>
    <el-main>
      <el-row :gutter="17" style="margin-bottom: 1.25rem">
        <el-col :span="12">
          <router-link :to="'/wallets/' + rielAccount.id">
            <wallet-card title="Riel account" :amount="rielAccount.amount" />
          </router-link>
        </el-col>
        <el-col :span="12">
          <router-link :to="'/wallets/' + usdAccount.id">
            <wallet-card :isRiel="false" title="Dollar account" :amount="usdAccount.amount" />
          </router-link>
        </el-col>
      </el-row>

      <el-row>
        <el-card>
          <Transaction :transactions="accountTransactions" />
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
      accountTransactions: 'getAccountTransactions',
      wallets: 'wallets',
      rielAccount: 'rielAccount',
      usdAccount: 'usdAccount'
    })
  },
  created () {
    this.getAllAccountAssetsTransactions()
  },
  methods: {
    ...mapActions(['getAllAccountAssetsTransactions'])
  }
}
</script>

<style scoped>
</style>
