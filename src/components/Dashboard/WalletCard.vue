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
            <div class="wallet-amount">
              <el-tooltip 
                :content="isRiel?amount+'៛':'$'+amount" 
                placement="top">
                <h4 style="overflow: hidden;text-overflow: ellipsis;padding:0px;margin:0px">{{ isRiel?amount+'៛':'$'+amount }}</h4>
              </el-tooltip>
            </div>
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
      required: true,
      default () {
        return ''
      }
    },
    backgroundColor: {
        type: String,
        default () {
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
.el-card:hover {
  box-shadow: 5px 5px 10px 0px rgba(0,0,0,0.5);
  transform: translateY(1px);
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
  padding: 28px;
  padding-right: 32px !important;
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
