<template class="menu">
  <div>
    <el-menu
      :router="true"
      class="el-side-menu"
      :default-active="currentActiveMenu"
    >
      <h1 class="logo">
        <img
          src="@/assets/logo.svg"
          alt="Iroha Wallet"
        >
      </h1>

      <el-menu-item index="/">
        <template slot="title">
          <el-row>
            <el-col :span="5">
              <i class="el-icon-data-analysis"></i>
            </el-col>
            <span>Dashboard</span>
          </el-row>
        </template>
      </el-menu-item>

      <el-menu-item index="/wallets">
        <template slot="title">
          <el-row>
            <el-col :span="5">
              <i class="el-icon-wallet"></i>
            </el-col>
            <span>Wallets</span>
          </el-row>
        </template>
      </el-menu-item>

      <el-menu-item index="/setting">
        <template slot="title">
          <el-row>
            <el-col :span="5">
              <i class="el-icon-setting"></i>
            </el-col>
            <span>Setting</span>
          </el-row>
        </template>
      </el-menu-item>

       <el-menu-item index="/logout"
        @click="onLogout">
        <template slot="title">
          <el-row>
            <el-col :span="5">
              <i class="el-icon-switch-button"></i>
            </el-col>
            <span>Logout</span>
          </el-row>
        </template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Menu',
  computed: {
    currentActiveMenu () {
      if (this.$route.path.includes('wallets')) return '/wallets'
      return this.$route.path
    }
  },
  methods: {
    ...mapActions([
      'logout'
    ]),
    onLogout () {
      this.logout()
        .then(() => this.$router.push('/login'))
    }
  }
}
</script>

<style scoped>
.logo {
  display: flex;
  height: 60px;
  justify-content: center;
}
.el-side-menu {
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 100;
  position: fixed !important;
  border-right: 1px solid #e43e33 !important;
}
.el-side-menu:not(.el-menu--collapse) {
  width: 200px;
}
.el-side-menu > .el-menu-item, .el-side-menu > .el-menu-item >>> i {
  color: black;
  text-align: left;
}
.el-menu-item:hover {
  background: #e43f338c;
}
.el-menu-item.is-active, .el-menu-item.is-active i {
  background: #e43e33;
  color: rgb(255, 255, 255, 1);
}
</style>
