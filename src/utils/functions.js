import { cache } from './util'

function isLoggedIn () {
  return !!cache.username
}

export {
  isLoggedIn
}
