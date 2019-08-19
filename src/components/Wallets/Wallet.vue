<template>
    <el-container>
        <el-main>
            <el-card class="el-card"
                v-bind:style="{background: isRiel?'#e43e33':'#ff9800'}">
                <el-row type="flex" justify="space-between">
                    <el-col :span="8" class="card-header">
                        <div class="wallet-logo">{{ isRiel?'៛':'$'}}</div>
                        <div class="wallet-title">{{ isRiel?'Riel account':'Dollar account'}}</div>
                    </el-col>
                    <el-col :span="16" class="wallet-amount">{{wallet.amount}}៛</el-col>
                </el-row>
                <el-card 
                    @click.native="onSend('onSend')"
                    :body-style="{ padding: '15px' }"
                    class="card-button">
                    <el-col :span="8" class="card-header">
                        <div class="wallet-logo">
                            <i class="el-icon-top" style="font-weight: bolder;"></i>
                        </div>
                        <div class="wallet-title">Send</div>
                    </el-col>
                </el-card>
            </el-card>
            <el-card style="margin-top: 1.25em">
                <Transaction :transactions="transactions"/>
            </el-card>
        </el-main>
    </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { lazyComponent } from '@router'

export default {
    name: 'Wallet',
    components: {
        Transaction: lazyComponent('Transactions/Transaction')
    },
    computed: {
        ...mapGetters([
            'getTransactionByAssetId',
            'wallets'
        ]),
        wallet () {
            let walletId = this.$route.params.walletId

            return this.wallets.find(w => (w.id === walletId)) || {}
        },
        isRiel () {
            return this.wallet.id === 'golem$d3' ? true:false
        },
        transactions () {
            return this.getTransactionByAssetId(this.wallet.assetId)
        }
    },
    methods: {
        onSend (message) {
            console.log(message)
        }
    }
}
</script>

<style scoped>
.card-button {
    margin-top: 1em;
    width: 200px;
    display: flex;
    flex-direction: row;
    font-weight: bolder;
    cursor: pointer;
}
.card-button:hover {
  box-shadow: 5px 5px 10px 0px rgba(0,0,0,0.5);
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
    background: #FFF;
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
</style>
