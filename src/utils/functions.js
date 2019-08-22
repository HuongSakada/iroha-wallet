import { cache } from './util'
import fs from 'fs'
import path from 'path'

const accountId = 'test@d3'

function isLoggedIn () {
  return !!cache.username
}

function preDefinedPrivateKey () {
  let preAccountId = '../../docker/iroha/keys/admin@iroha.priv'
  let privateKey = fs.readFileSync(path.join(__dirname, preAccountId)).toString().trim()
  return [privateKey]
  return ['0f0ce16d2afbb8eca23c7d8c2724f0c257a800ee2bbd54688cec6b898e3f7e33', '9c430dfe8c54b0a447e25f75121119ac3b649c1253bce8420f245e4c104dccd1']
}

function preDefinedAccountId () {
  return accountId
}

export {
  isLoggedIn,
  preDefinedPrivateKey,
  preDefinedAccountId
}
