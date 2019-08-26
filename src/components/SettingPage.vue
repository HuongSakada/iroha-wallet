<template>
    <el-container class="full-height">
        <el-main class="full-height">
            <el-row :gutter="17" class="full-height">
                <el-col :span="12" class="full-height">
                    <el-card
                        :body-style="{ padding: '0' }"
                        class="full-height">
                        Account Quorum is {{ accountQuorum }}
                    </el-card>
                </el-col>
                <el-col :span="12" class="full-height">
                    <el-card 
                        :body-style="{ padding: '0' }">
                        <div class="card-header">
                            <div class="card-header-title">
                                <span style="line-height: 2">Public keys</span>
                                <el-button 
                                    @click="publicKeyVisible = true"
                                    plain size="small" icon="el-icon-plus"
                                    >Add</el-button>
                            </div>
                        </div>
                        <div v-for="signatory in accountSignatories" :key="signatory" class="card-header-item">
                            <div class="item">
                                <span class="item-text">{{ signatory }}</span>
                                <el-button type="text">
                                    <i class="el-icon-delete" />
                                </el-button>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </el-main>

        <el-dialog
            title="Public key"
            :visible.sync="publicKeyVisible"
            width="450px"
            center>
            <div style="text-align: center; font-size: 1rem">
                Are you sure want to add new public key?
            </div>
            <div slot="footer">
                <el-row  class="card-footer">
                    <el-button
                        :span="12"
                        :loading="addingKey"
                        class="fullwidth"
                        type="danger"
                        @click="addPublicKey">
                        Add
                    </el-button>
                    <el-button 
                        :span="12" 
                        class="fullwidth"  
                        @click="publicKeyVisible = false">
                        Cancel
                    </el-button>
                </el-row>
            </div>
        </el-dialog>

        <el-dialog
            title="Your private key"
            :close-on-click-modal="false"
            :visible.sync="dialogVisible"
            width="450px"
            center>
            <div>Download your private key and keep it secret!</div>
            <div slot="footer">
            <el-button
                type="danger"
                class="fullwidth"
                icon="el-icon-download"
                @click="onDownloadPrivateKey">
                Download
            </el-button>
            </div>
        </el-dialog>
    </el-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { saveAs } from 'file-saver'

export default {
    name: 'SettingPage',
    data() {
        return {
            publicKeyVisible: false,
            addingKey: false,
            dialogVisible: false,
            userAccount: {
                accountId: '',
                privateKey: ''
            }
        }
    },
    created () {
        this.getSignatories()
    },
    computed: {
        ...mapGetters([
            'accountSignatories',
            'accountQuorum'
        ])
    },
    methods: {
        ...mapActions([
            'getSignatories',
            'openConfirmDialog'
        ]),
        addPublicKey () {
            this.openConfirmDialog()
            .then(privateKeys => {
                if (!privateKeys) return
                this.addingKey = true

                this.$store.dispatch('addSignatory', {
                    privateKeys: privateKeys
                })
                .then(({privateKey, accountId}) => {
                    this.userAccount.privateKey = privateKey
                    this.userAccount.accountId = accountId
                    this.dialogVisible = true
                })
                .then(() => {
                    this.$message({
                        message: 'Add public key successful!',
                        type: 'success'
                    })
                })
                .catch(err => {
                    this.$alert(err.message, 'Add public key error', {
                        type: 'error'
                    })
                })
                .finally(() => { 
                    this.addingKey = false
                })
            })
        },
        onDownloadPrivateKey () {
            const filename = `${this.userAccount.accountId}.priv`
            const blob = new Blob(
                [this.userAccount.privateKey],
                { type: 'text/plain;charset=utf-8' }
            )

            saveAs(blob, filename)
        }
    }
}
</script>

<style scoped>
.full-height {
    height: 100%;
}
.card-header {
    padding: 1em 1.5em;
}
.card-header-title {
    display: flex;
    justify-content: space-between;
    vertical-align: middle;
}
.card-header-item {
    padding: 5px 1.5em;
    border-top: 1px solid #efefef;
}
.item {
    display: flex;
    justify-content: space-between;
    vertical-align: middle;
}
.item-text {
    font-size: 0.8rem;
    line-height: 3;
}
.card-footer {
    display: flex;
    justify-content: space-between;
}
</style>
