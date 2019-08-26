import Vue from 'vue'
import VueRouter from 'vue-router'
import { isLoggedIn } from '@utils/functions'

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
      path: '/signup',
      name: 'signup',
      component: lazyComponent('Signup')
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
          component: lazyComponent('Wallets/WalletPage'),
          children: [
            {
              path: ':walletId',
              name: 'wallet',
              component: lazyComponent('Wallets/Wallet')
            }
          ]
        },
        {
          path: 'setting',
          name: 'setting',
          component: lazyComponent('SettingPage')
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.name === 'login' || to.name === 'signup') return next()

  if (isLoggedIn()) {
    next()
  } else {
    next({ name: 'login' })
  }
})

export default router;