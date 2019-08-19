<template>
    <div>
        <router-link
          class="card"
          :to="'/wallets/' + wallet.id">
            <el-col
                :span="5"
                class="wallet-logo">{{ isRiel?'៛':'$' }}</el-col>
            <el-col
                :span="19"
                class="wallet-label">
                {{ isRiel?'Riel account':'Dollar account' }}
            </el-col>
      </router-link>
    </div>
</template>

<script>
export default {
  name: 'WalletItem',
  props: {
    isRiel: {
      type: Boolean,
      default: () => true
    },
    wallet: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.card {
  display: block;
  width: 100%;
  height: 56px;
  text-decoration: none;
  color: black;
  border-left: 1px solid #FFF;
}
.card:hover {
  background: #e43f338c;
}
.card.router-link-active {
  background: #f4f4f4;
  color: #e43e33;
  height: 54px;
  border-bottom: 2px solid #e43e33;
}
.wallet-logo {
  height: 100%;
  font-size: 1.5em;
  vertical-align: middle;
  font-weight: bolder;
  line-height: 2.3;
  background: transparent;
}
.wallet-label {
  height: 100%;
  text-align: left;
  background: transparent;
  padding-top: 18px;
}
</style>
