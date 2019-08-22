/* eslint-disable */
import Vue from 'vue'
import _ from 'lodash'
import commands from 'iroha-helpers/lib/commands'
import queries from 'iroha-helpers/lib/queries'
import { cryptoHelper } from 'iroha-helpers'
import { cache, newQueryServiceOptions, newCommandServiceOptions, newPreCommandServiceOptions } from '@/utils/util'
import { transactionAssetForm } from '@/utils/transaction-format'

const types = _([
  'SIGNUP',
  'LOGIN',
  'LOGOUT',
  'GET_ACCOUNT',
  'GET_ACCOUNT_ASSETS',
  'GET_ACCOUNT_ASSET_TRANSACTIONS',
  'TRANSFER_ASSET'
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
  getAccountTransactions (state) {
    let transactions = _.cloneDeep(state.assetTransactions)
    let txs = Object.values(transactions)
      .map(a => a.transactionsList)

    return transactionAssetForm(txs, state.accountId)
  },

  getTransactionByAssetId: (state) => (assetId) => {
    let transactions = _.cloneDeep(state.assetTransactions)

    return transactionAssetForm(transactions[assetId].transactionsList, state.accountId)
  },

  wallets (state) {
    const assets = state.assets.map(a => {
      const assetParts = a.assetId.split('#')
      const assetName = assetParts[0].toLowerCase()

      return {
        id: a.assetId.replace(/#/g, '$'),
        assetId: a.assetId,
        name: _.upperFirst(assetName),
        domain: assetParts[1].toLowerCase(),
        amount: a.balance,
        precision: a.balance.precision
      }
    })

    return assets
  },

  rielAccount: (state, getters) => {
    return getters.wallets.find(w => (w.id === 'riel$iroha')) || {}
  },

  usdAccount: (state, getters) => {
    return getters.wallets.find(w => (w.id === 'usd$iroha')) || {}
  },

  accountQuorum (state) {
    return state.accountQuorum
  }
}

const mutations = {
  [types.RESET] (state) {
    const s = initialState()

    Object.keys(s).forEach(key => {
      state[key] = s[key]
    })

    cache.username = null
    cache.key = null
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
  [types.GET_ACCOUNT_ASSETS_SUCCESS] (state, assets) { 
    state.assets = assets 
  },
  [types.GET_ACCOUNT_ASSETS_FAILURE] (state, err) {
    handleError(state, err)
  },

  [types.GET_ACCOUNT_ASSET_TRANSACTIONS_REQUEST] (state) {},
  [types.GET_ACCOUNT_ASSET_TRANSACTIONS_SUCCESS] (state, { assetId, transactions }) {
    Vue.set(state.assetTransactions, assetId, transactions)
  },
  [types.GET_ACCOUNT_ASSET_TRANSACTIONS_FAILURE] (state, err) {
    handleError(state, err)
  },

  [types.TRANSFER_ASSET_REQUEST] (state) {},
  [types.TRANSFER_ASSET_SUCCESS] (state) {},
  [types.TRANSFER_ASSET_FAILURE] (state, err) {
    handleError(state, err)
  }
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

  logout ({ commit }) {
    commit(types.RESET)
  },

  getAllAccountAssetsTransactions ({ dispatch, state }) {

    let gettingAccountAssets

    if (_.isEmpty(state.assets)) {
      gettingAccountAssets = dispatch('getAccountAssets')
    } else {
      gettingAccountAssets = Promise.resolve()
    }

    return gettingAccountAssets
      .then(() => {
        const gettingAllAccountAssetsTransactions = state.assets.map(a => {
          return dispatch('getAccountAssetTransactions', { assetId: a.assetId })
        })

        return Promise.all(gettingAllAccountAssetsTransactions)
      })
      .catch(err => {
        throw err
      })
  },

  getAccountAssets ({ commit, state }) {
    return queries.getAccountAssets(
      newQueryServiceOptions(),
      {
        accountId: state.accountId
      })
      .then(assets => {
        commit(types.GET_ACCOUNT_ASSETS_SUCCESS, assets)
      })
      .catch(err => {
        commit(types.GET_ACCOUNT_ASSETS_FAILURE, err)
    })
  },

  getAccountAssetTransactions ({ commit, state }, { assetId }) {
    commit(types.GET_ACCOUNT_ASSET_TRANSACTIONS_REQUEST)

    return queries.getAccountAssetTransactions(
      newQueryServiceOptions(),
      {
        accountId: state.accountId,
        assetId,
        pageSize: 100,
        firstTxHash: undefined
      })
      .then(responses => {
        commit(types.GET_ACCOUNT_ASSET_TRANSACTIONS_SUCCESS, {
          assetId: assetId,
          transactions: responses
        })
      })
      .catch(err => {
        commit(types.GET_ACCOUNT_ASSET_TRANSACTIONS_FAILURE, err)
      })
  },

  transferAsset ({ commit, state, getters }, { privateKeys, assetId, to, description = '', amount }) {
    commit(types.TRANSFER_ASSET_REQUEST)

    return commands.transferAsset(
      newCommandServiceOptions(privateKeys, getters.accountQuorum), 
      {
        srcAccountId: state.accountId,
        destAccountId: to,
        assetId,
        description,
        amount
      })
      .catch(err => {
        commit(types.TRANSFER_ASSET_FAILURE, err)
      })
  },

  createAccount ({ commit }, { accountName, domainId }) {

    let { publicKey, privateKey } = cryptoHelper.generateKeyPair()

    if(!_.isEmpty(accountName.trim())){
      return new Promise((resolve, reject) => {
        return commands.createAccount(
          newPreCommandServiceOptions(),
          {
            accountName: accountName,
            domainId: domainId,
            publicKey: publicKey
          }
        )
        .then(() => {
          resolve(privateKey)
        })
        .catch(err => { reject(err) })
      })
      .catch(err => {
        commit(types.SIGNUP_FAILURE, err)
      })
    }
  },

  setAccountDetails ({ state }, { accountId = state.accountId, accountInfo }) {
    const setAccountDetailArray = _.flatMap(accountInfo, function(value, key) {
      return commands.setAccountDetail(
        newPreCommandServiceOptions(), 
        {
          accountId: accountId,
          key: key,
          value: value
        }
      )
      .catch(err => {
        throw err
      })
    });

    return Promise.all(setAccountDetailArray)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}