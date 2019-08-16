import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export const lazyComponent = (name) => () => import(`@/components/${name}.vue`)

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: lazyComponent('Login')
    },
    {
      path: '/',
      component: lazyComponent('Home'),
      children: [
        {
          path: '',
          name: 'dashboard',
          component: lazyComponent('Dashboard/Dashboard')
        },
        {
          path: 'wallets',
          name: 'wallets',
          component: lazyComponent('Wallets/WalletPage')
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

export default router;