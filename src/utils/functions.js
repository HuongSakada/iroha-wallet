import { cache } from './util'

function isLoggedIn () {
  return !!cache.username
}

function predefinedPrivateKey () {
  return 'key'
}

export {
  isLoggedIn,
  predefinedPrivateKey
}
