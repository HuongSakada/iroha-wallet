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

      <el-form-item label="Username:" prop="username">
        <el-input
          name="username"
          v-model="form.username"
          :disabled="isLoading"
        ></el-input>
      </el-form-item>

      <el-form-item label="Private key:" prop="privateKey">
        <el-row type="flex" justify="space-between">
          <el-col :span="20">
            <el-input
              name="privateKey"
              v-model="form.privateKey"
              :disabled="isLoading"
            />
          </el-col>
          <el-upload
            class="auth-form_upload"
            action=""
            :auto-upload="false"
            :show-file-list="false"
            :on-change="onFileChosen"
            :disabled="isLoading">
            <el-button>
              <i class="el-icon-upload2"></i>
            </el-button>
          </el-upload>
        </el-row>
      </el-form-item>

      <el-form-item class="login-button-container">
        <el-button
          class="fullwidth"
          type="danger"
          @click="onSubmit"
          :loading="isLoading">
          LOG IN
        </el-button>
      </el-form-item>

      <div class="auth-container-info">Don’t have an account?</div>
      <el-form-item class="login-button-container">
        <el-button
          class="fullwidth"
          type="danger"
          @click="$router.push('/signup')"
          plain>
          Register account
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</div>
</template>

<script>
import { mapActions } from 'vuex'
/* eslint-disable */
export default {
  name: 'login',

  data () {
    return {
      isLoading: false,
      form: {
        username: '',
        privateKey: ''
      },
      rules: {
        username: [
          { required: true, trigger: 'change' },
          { pattern: /^[a-z_0-9]{1,32}@[a-z_0-9]{1,9}$/, trigger: 'blur' }
        ],
        privateKey: [
          { required: true, trigger: 'change' },
          { pattern: /^[a-z_A-Z_0-9]{64}/, trigger: 'blur' }
        ]
      }
    }
  },

  methods: {
    ...mapActions([
      'login'
    ]),
    onFileChosen (file, fileList) {
      const reader = new FileReader()

      reader.onload = (ev) => {
        this.form.privateKey = (ev.target.result || '').trim()
        this.form.username = fileList[fileList.length - 1].name.replace('.priv', '')
      }
      reader.readAsText(file.raw)
    },

    onSubmit () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.isLoading = true

          this.login({
              username: this.form.username,
              privateKey: this.form.privateKey
          })
          .then(() => {
            this.$router.push('/')
          })
          .finally(() => { this.isLoading = false })
        }
        else{
          return false
        }
      });
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
