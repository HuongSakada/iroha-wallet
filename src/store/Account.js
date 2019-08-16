/* eslint-disable */
import Vue from 'vue'
import _ from 'lodash'
import commands from 'iroha-helpers/lib/commands'
import queries from 'iroha-helpers/lib/queries'
import { cache, newQueryServiceOptions} from '@/utils/util'

const types = _([
  'SIGNUP',
  'LOGIN',
  'LOGOUT',
  'GET_ACCOUNT',
  'GET_ACCOUNT_ASSETS',
  'GET_ACCOUNT_ASSET_TRANSACTIONS'
]).chain()
  .flatMap(x => [x + '_REQUEST', x + '_SUCCESS', x + '_FAILURE'])
  .concat(['RESET'])
  .map(x => [x, x])
  .fromPairs()
  .value()

function initialState () {
  return {
    accountId: '',
    accountInfo: {},
    accountQuorum: 0,
    accountSignatories: [],
    assetTransactions: {},
    rawUnsignedTransactions: [],
    rawTransactions: [],
    assets: [],
    connectionError: null
  }
}

function handleError (state, error) {
  throw error
}

const state = initialState()

const getters = {

}

const mutations = {
  [types.RESET] (state) {
    const s = initialState()

    Object.keys(s).forEach(key => {
      state[key] = s[key]
    })
  },

  [types.SIGNUP_REQUEST] (state) {},
  [types.SIGNUP_SUCCESS] (state, account) {},
  [types.SIGNUP_FAILURE] (state, err) {
    handleError(state, err)
  },

  [types.LOGIN_REQUEST] (state) {},
  [types.LOGIN_SUCCESS] (state, account) {
    state.accountId = account.accountId
    state.accountInfo = JSON.parse(account.jsonData)
    state.accountQuorum = account.quorum
  },
  [types.LOGIN_FAILURE] (state, err) {
    handleError(state, err)
  },

  [types.LOGOUT_REQUEST] (state) {},
  [types.LOGOUT_SUCCESS] (state, params) {},
  [types.LOGOUT_FAILURE] (state, err) {
    handleError(state, err)
  },

  [types.GET_ACCOUNT_REQUEST] (state) {},
  [types.GET_ACCOUNT_SUCCESS] (state, account) {},
  [types.GET_ACCOUNT_FAILURE] (state, err) {
    handleError(state, err)
  },

  [types.GET_ACCOUNT_ASSETS_REQUEST] (state) {},
  [types.GET_ACCOUNT_ASSETS_SUCCESS] (state, params) {},
  [types.GET_ACCOUNT_ASSETS_FAILURE] (state, err) {
    handleError(state, err)
  },

  [types.GET_ACCOUNT_ASSET_TRANSACTIONS_REQUEST] (state) {},
  [types.GET_ACCOUNT_ASSET_TRANSACTIONS_SUCCESS] (state, params) {},
  [types.GET_ACCOUNT_ASSET_TRANSACTIONS_FAILURE] (state, err) {
    handleError(state, err)
  },
}

const actions = {
  login ({ commit }, { username, privateKey }) {
    commit(types.LOGOUT_REQUEST)

    cache.key = privateKey
    cache.username = username
    
    return queries.getAccount(
      newQueryServiceOptions(),
      {
      accountId: cache.username
    })
    .then((account) => {
      commit(types.LOGIN_SUCCESS, account)
    })
    .catch(err => {
      commit(types.LOGIN_FAILURE, err)
    })
  },
}

export default {
  state,
  getters,
  mutations,
  actions
}