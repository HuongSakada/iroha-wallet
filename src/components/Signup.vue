<template>
<div class="wrapper">
  <div class="login-form-container">
    <div class="logo">
      <img id="logo" src="~@/assets/logo.svg" alt="Iroha">
    </div>

    <div class="title">Let's get started</div>

    <el-form 
      class="login-form" 
      ref="form" 
      :rules="rules" 
      :model="form" 
      label-position="top">

      <el-form-item label="First name:" prop="firstname">
        <el-input
          name="firstname"
          v-model="form.firstname"
          :disabled="isLoading"
        ></el-input>
      </el-form-item>

      <el-form-item label="Last name:" prop="lastname">
        <el-input
          name="lastname"
          v-model="form.lastname"
          :disabled="isLoading"
        ></el-input>
      </el-form-item>

      <el-form-item label="Username:" prop="username">
        <el-input
          name="username"
          v-model="form.username"
          :disabled="isLoading"
        ></el-input>
      </el-form-item>

      <el-form-item class="login-button-container">
        <el-button
          class="fullwidth"
          @click="onSubmit"
          type="danger">
          Register
        </el-button>
      </el-form-item>

      <p class="auth-container-info">Already have an account</p>
      <el-form-item class="login-button-container">
        <el-button
          class="fullwidth"
          type="danger"
          @click="$router.push('/login')"
          plain>
          LOG IN
        </el-button>
      </el-form-item>
    </el-form>
  </div>

  <el-dialog
    title="Your private key"
    :close-on-click-modal="false"
    :visible.sync="dialogVisible"
    width="450px"
    center>
    <div >Download your private key and keep it secret!</div>
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
</div>
</template>

<script>
/* eslint-disable */
import { mapActions } from 'vuex'
import { saveAs } from 'file-saver'
import { omit, cloneDeep } from 'lodash'

export default {
  name: 'Signup',
  data () {
    return {
      isLoading: false,
      dialogVisible: false,
      alertVisible: false,
      predefinedDomain: 'iroha',
      form: {
        username: '',
        firstname: '',
        lastname: ''
      },
      userAccount: {
        username: '',
        privateKey: ''
      },
      rules: {
        firstname: [
          { required: true, trigger: 'change', message: 'Firstname is required' }
        ],
        lastname: [
          { required: true, trigger: 'change', message: 'Lastname is required' }
        ],
        username: [
          { required: true, trigger: 'change', message: 'Username is required' },
          { pattern: /^[a-z_0-9]{1,32}$/, trigger: 'change', message: 'Username should match [a-z_0-9]{1,32}' }
        ]
      }
    }
  },
  methods: {
    onSubmit () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.isLoading = true
          this.$store.dispatch('createAccount', {
            accountName: this.form.username,
            domainId: this.predefinedDomain
          })
          .then((privateKey) => {
            this.userAccount.username = this.form.username.trim()
            this.userAccount.privateKey = privateKey

            let accountInfo = cloneDeep(this.form)
            
            this.$store.dispatch('setAccountDetails', {
              accountId: `${this.userAccount.username}@${this.predefinedDomain}`,
              accountInfo: omit(accountInfo, ['username'])
            })
            .catch( err => { throw err })
          })
          .then(() => {
            this.$store.dispatch('initialAssetQuantityForUser', {
              accountId: `${this.userAccount.username}@${this.predefinedDomain}`
            })
            .catch( err => { throw err })
          })
          .then(() => {
            this.dialogVisible = true

            this.$notify.success({
              title: 'Create account successfully',
              message: 'You got 100៛ and $100 in your account.'
            })
          })
          .catch(err => {
            console.error(err)
            this.$alert(err.message, 'Create account error', {
              type: 'error'
            })
          })
          .finally(() => { 
            this.isLoading = false 
          })
        }
        else{
          return false
        }
      });
    },
    onDownloadPrivateKey () {
      const filename = `${this.userAccount.username}@${this.predefinedDomain}.priv`
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
.wrapper {
  display: flex;
  justify-content: center;
  min-height: 100vh;
}
.title {
  margin: 20px auto;
  font-weight: bolder;
  font-size: 1.2em;
}
.login-form-container {
  margin: auto;
}
.logo {
  display: flex;
  justify-content: center;
}
.logo img {
  width: 5rem;
  height: 5rem;
}
.login-form {
  width: 30rem;
  justify-content: center;
  text-align: left;
}
</style>
