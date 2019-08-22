import { cache, newPreCommandServiceOptions } from './util'
import commands from 'iroha-helpers/lib/commands'
import fs from 'fs'
import path from 'path'

const accountId = 'admin@iroha'

function isLoggedIn () {
  return !!cache.username
}

function preDefinedPrivateKey () {
  let preAccountId = '../../docker/iroha/keys/admin@iroha.priv'
  let privateKey = fs.readFileSync(path.join(__dirname, preAccountId)).toString().trim()
  return [privateKey]
}

function preDefinedAccountId () {
  return accountId
}

async function preInitialAssetQuantityForUser ({ accountId }) {
  const  assetId = 'riel$iroha'

  try {
    await commands.addAssetQuantity(
      newPreCommandServiceOptions(),
      {
        assetId: assetId,
        amount: '100'
      }
    )

    await commands.transferAsset(
      newPreCommandServiceOptions(),
      {
        srcAccountId: preDefinedAccountId(),
        destAccountId: accountId,
        assetId: assetId,
        description: '',
        amount: '100'
      }
    )
  } catch (error) {
    throw error
  }
}

export {
  isLoggedIn,
  preDefinedPrivateKey,
  preDefinedAccountId,
  preInitialAssetQuantityForUser
}
