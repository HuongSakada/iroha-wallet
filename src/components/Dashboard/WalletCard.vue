<template>
    <el-card
        :body-style="{ padding: '0px' }"
        class="el-card"
        v-bind:style="{background: backgroundColor}">
        <el-col
            :span="7"
            class="wallet-logo">{{isRiel?'៛':'$'}}</el-col>
        <el-col
            :span="17"
            class="wallet-info">
            <div class="wallet-title">{{ title }}</div>
            <div class="wallet-amount">{{ isRiel?amount+'៛':'$'+amount }}</div>
        </el-col>
    </el-card>
</template>

<script>
export default {
  name: 'WalletCard',
  props: {
    isRiel: {
      type: Boolean,
      default: () => true
    },
    title: {
      type: String,
      required: true
    },
    amount: {
      type: String,
      required: true
    },
    backgroundColor: {
        type: String,
        default() {
            return '#ff9800';
        }
    }
  }
}
</script>

<style scoped>
.el-card {
  height: 130px;
}
.wallet-logo {
  height: 130px;
  font-size: 7em;
  vertical-align: middle;
  font-weight: bolder;
  line-height: 1.22;
  background: transparent;
}
.wallet-info {
  padding: 25px;
  padding-right: 45px;
  height: 130px;
  text-align: right;
  background: transparent;
  vertical-align: middle;
}
.wallet-title {
  font-size: 1.3em;
}
.wallet-amount {
  font-size: 2em;
  font-weight: bold;
}
</style>
