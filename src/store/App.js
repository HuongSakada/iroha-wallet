
import Vue from 'vue'

function initialState () {
  return {
    confirmDialog: {
      isVisible: false,
      signatures: [],
      resolvePrompting: null,
      rejectPrompting: null
    }
  }
}

const state = initialState()

const getters = {
  confirmDialogVisible () {
    return state.confirmDialog.isVisible
  }
}

const mutations = {
  CONFIRM_DIALOG_OPEN (state, { resolvePrompting, rejectPrompting, signatures }) {
    Vue.set(state, 'confirmDialog', {
      isVisible: true,
      signatures,
      resolvePrompting,
      rejectPrompting
    })
  },

  CONFIRM_DIALOG_CLOSE (state, privateKeys) {
    Vue.set(state.confirmDialog, 'isVisible', false)
    Vue.set(state.confirmDialog, 'signatures', [])
    state.confirmDialog.resolvePrompting(privateKeys)
  }
}

const actions = {
  openConfirmDialog ({ commit }, { signatures = [] } = {}) {
    let resolvePrompting, rejectPrompting
    const prompting = new Promise((resolve, reject) => {
      resolvePrompting = resolve
      rejectPrompting = reject
    })

    commit('CONFIRM_DIALOG_OPEN', {
      resolvePrompting,
      rejectPrompting,
      signatures
    })

    return prompting
  },

  closeConfirmDialog ({ commit }, privateKeys) {
    commit('CONFIRM_DIALOG_CLOSE', privateKeys)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
