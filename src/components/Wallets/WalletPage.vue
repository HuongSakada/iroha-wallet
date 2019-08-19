<template>
  <el-row>
    <el-col :span="4" style="margin-top: 20px">
      <wallet-item :wallet="wallets[0]" />
      <wallet-item :wallet="wallets[1]" :isRiel="false"/>
    </el-col>
    <el-col :span="20">
        <router-view />
    </el-col>
  </el-row>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { lazyComponent } from '@router'
import { isUndefined, isNull } from 'util';

export default {
  name: 'WalletPage',
  components: {
    WalletItem: lazyComponent('Wallets/WalletItem')
  },
  computed: {
    ...mapGetters({
      wallets: 'wallets'
    })
  },
  watch: {
    '$route' (to) {
      if (to.name === 'wallets') {
        this.openDefaultWallet()
      }
    }
  },
  mounted () {
    this.openDefaultWallet()
  },
  created () {
    this.getAccountAssets()
  },
  methods: { 
    ...mapActions([
      'getAccountAssets'
    ]),
    openDefaultWallet () {
      let walletId = this.$route.params.walletId

      if (walletId == 'undefined' || walletId == null) {
        walletId = this.wallets[0].id
      }

      if (this.wallets.length) {
        this.$router.push({ 
          name: 'wallet', 
          params: { walletId: walletId } 
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
