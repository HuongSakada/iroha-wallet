<template>
  <el-dialog
    title="Confirm the transaction"
    :close-on-click-modal="false"
    :visible="confirmDialogVisible"
    width="450px"
    center
    @close="onCloseConfirmDialog()">
    <el-form
        ref="confirmForm"
        :model="confirmForm"
        label-position="top">
        <el-form-item 
          v-for="(key, index) in confirmForm.privateKeys"
          :key="index"
          :prop="`privateKey${index}`"
          label="Private key:">
          <el-row type="flex" justify="space-between">
            <el-col :span="20">
              <el-input
                v-model="confirmForm.privateKeys[index]"
              />
            </el-col>
            <el-upload
              action=""
              :auto-upload="false"
              :show-file-list="false"
              :on-change="(f, l) => onFileChosen(f, l, index)"
              :disabled="isSending">
              <el-button>
                <i class="el-icon-upload2"></i>
              </el-button>
            </el-upload>
          </el-row>
        </el-form-item>
        <el-form-item class="button-container">
            <el-button
              class="fullwidth"
              type="danger"
              :loading="isSending"
              @click="onConfirm"
            >
                Confirm
            </el-button>
        </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'ConfirmModal',
  data () {
    return {
      confirmForm: {
        privateKeys: []
      },
      isSending: false
    }
  },
  watch: {
    confirmDialogVisible (isVisible) {
      if (isVisible) this.beforeOpenConfirmDialog()
    }
  },
  computed: {
    ...mapGetters([
      'accountQuorum',
      'confirmDialogVisible'
    ])
  },
  methods: {
    ...mapActions([
      'closeConfirmDialog'
    ]),
    onCloseConfirmDialog () {
      this.closeConfirmDialog()
      this.$refs.confirmForm.resetFields()
      this.beforeOpenConfirmDialog()
    },
    onConfirm () {
      this.closeConfirmDialog(this.confirmForm.privateKeys)
        .finally(() => {
          this.onCloseConfirmDialog()
        })
    },
    onFileChosen (file, fileList, index) {
      const reader = new FileReader()

      reader.onload = (ev) => {
        let key = (ev.target.result || '').trim()
        this.$set(this.confirmForm.privateKeys, index, key)
      }
      reader.readAsText(file.raw)
    },
    beforeOpenConfirmDialog () {
      const privateKeys = Array.from({ length: this.accountQuorum }, () => '')
      this.$set(this.confirmForm, 'privateKeys', privateKeys)
    }
  }
}
</script>

<style scoped>
.button-container {
    margin: 0px;
}
</style>
