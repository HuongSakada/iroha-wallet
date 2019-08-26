import { cache, newPredefinedCommandServiceOptions } from './util'
import commands from 'iroha-helpers/lib/commands'

function isLoggedIn () {
  return !!cache.username
}

function predefinedPrivateKey () {
  return ['0f0ce16d2afbb8eca23c7d8c2724f0c257a800ee2bbd54688cec6b898e3f7e33']
}

function predefinedAccountId () {
  return 'admin@iroha'
}

async function addAssetQuantity ({ assetId, accountId }) {
  try {
    await commands.addAssetQuantity(
      newPredefinedCommandServiceOptions(),
      {
        assetId: assetId,
        amount: '100'
      }
    )

    await commands.transferAsset(
      newPredefinedCommandServiceOptions(),
      {
        srcAccountId: predefinedAccountId(),
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
  predefinedPrivateKey,
  predefinedAccountId,
  addAssetQuantity
}
