<template>
  <el-container>
    <el-main>
      <el-card class="el-card" v-bind:style="{background: isRiel?'#e43e33':'#ff9800'}">
        <el-row type="flex" justify="space-between">
          <el-col :span="8" class="card-header">
            <div class="wallet-logo">{{ currency }}</div>
            <div class="wallet-title">{{ isRiel?'Riel account':'Dollar account'}}</div>
          </el-col>
          <el-col :span="16" class="wallet-amount">{{ amountLabel }}</el-col>
        </el-row>
        <el-card
          @click.native="transferFormVisible = true"
          :body-style="{ padding: '12px' }"
          class="card-button"
        >
          <el-col :span="8" class="card-header">
            <div class="wallet-logo">
              <i class="el-icon-top" style="font-weight: bolder;"></i>
            </div>
            <div class="wallet-title">Send</div>
          </el-col>
        </el-card>
      </el-card>
      <el-card style="margin-top: 1.25em">
        <Transaction :transactions="transactions" />
      </el-card>
    </el-main>

    <el-dialog
      title="Transfer"
      :close-on-click-modal="false"
      :visible.sync="transferFormVisible"
      @close="closeTransferForm"
      width="450px"
      center
    >
      <el-form class="app-form" ref="transferForm" :rules="rules" :model="transferForm">
        <el-form-item label="Transfer to:" prop="to">
          <el-input name="to" v-model="transferForm.to" placeholder="Account id" />
        </el-form-item>
        <span>
          Available balance:
          <strong>{{ amountLabel }}</strong>
        </span>
        <el-form-item label="Amount:" prop="amount">
          <el-input name="amount" v-model="transferForm.amount" type="number" placeholder="0" />
        </el-form-item>
        <el-form-item label="Additional information:">
          <el-input
            name="message"
            v-model="transferForm.message"
            type="textarea"
            placeholder="Details"
          />
        </el-form-item>
        <el-form-item class="button-container">
          <el-button
            class="fullwidth"
            type="danger"
            :loading="isSending"
            @click="onTransfer"
          >Transfer</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { lazyComponent } from '@router'
import _ from 'lodash'

export default {
  name: 'Wallet',
  components: {
    Transaction: lazyComponent('Transactions/Transaction')
  },
  computed: {
    ...mapGetters(['getTransactionByAssetId', 'wallets']),
    walletId () {
      return this.$route.params.walletId
    },
    wallet () {
      return this.wallets.find(w => w.id === this.walletId) || {}
    },
    isRiel () {
      return this.walletId === 'riel$iroha'
    },
    currency () {
      return this.isRiel ? '៛' : '$'
    },
    amountLabel () {
      return this.isRiel ? this.wallet.amount + '៛' : '$' + this.wallet.amount
    },
    transactions () {
      return this.getTransactionByAssetId(this.wallet.assetId)
    }
  },
  data () {
    var checkAmount = (rule, value, callback) => {
      if (!_.isNil(this.transferForm.amount)) {
        if (value > this.wallet.amount) {
          callback(new Error('Amount should not greater than your balance'))
        }
      }
      callback()
    }

    return {
      transferForm: {},
      isSending: false,
      rules: {
        to: [
          {
            required: true,
            trigger: 'change',
            message: 'Username is required'
          },
          {
            pattern: /^[a-z_0-9]{1,32}@[a-z_0-9]{1,9}$/,
            trigger: 'blur',
            message: 'Username should match [a-z_0-9]{1,32}@[a-z_0-9]{1,9}'
          }
        ],
        amount: [
          { required: true, trigger: 'change', message: 'Amount is required' },
          {
            pattern: /^(?![0.]+$)\d+(\.\d+)?$/,
            trigger: 'blur',
            message: 'Amount should greater than 0'
          },
          { validator: checkAmount, trigger: 'change' }
        ]
      },
      transferFormVisible: false
    }
  },
  methods: {
    ...mapActions(['openConfirmDialog']),
    onTransfer () {
      this.$refs['transferForm'].validate(valid => {
        if (valid) {
          this.openConfirmDialog().then(privateKeys => {
            if (!privateKeys) return
            this.isSending = true

            this.$store
              .dispatch('transferAsset', {
                privateKeys,
                assetId: this.wallet.assetId,
                to: this.transferForm.to,
                amount: String(this.transferForm.amount),
                description: this.transferForm.message
              })
              .then(() => {
                this.$message({
                  message: 'Transfer successful!',
                  type: 'success'
                })
              })
              .catch(err => {
                this.$alert(err.message, 'Transfer error', {
                  type: 'error'
                })
              })
              .finally(() => {
                this.isSending = false
                this.transferFormVisible = false
              })
          })
        } else {
          return false
        }
      })
    },
    closeTransferForm () {
      if (this.$refs.transferForm) {
        this.$refs.transferForm.resetFields()
        this.transferForm = {}
      }
    }
  }
}
</script>

<style scoped>
.card-button {
  margin-top: 1.2em;
  width: 200px;
  display: flex;
  flex-direction: row;
  font-weight: bolder;
  cursor: pointer;
}
.card-button:hover {
  box-shadow: 5px 5px 10px 0px rgba(0, 0, 0, 0.5);
}
.card-button:active {
  transform: translateY(1px);
}
.card-header {
  display: flex;
}
.wallet-logo {
  height: 30px;
  width: 30px;
  font-weight: bold;
  background: #fff;
  border-radius: 50%;
  text-align: center;
  font-size: 1.5em;
  line-height: 1.3;
  color: #e43e33;
}
.wallet-title {
  height: 30px;
  padding-left: 15px;
  font-size: 1.2em;
  display: flex;
  align-items: center;
  justify-content: center;
}
.wallet-amount {
  font-size: 1.5em;
  font-weight: bold;
  height: 30px;
  text-align: right;
  line-height: 1.3;
}
.el-dialog__body {
  padding-top: 0px;
}
.button-container {
  margin: 0px;
}
</style>
