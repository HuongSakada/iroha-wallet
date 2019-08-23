import { cache, newPreCommandServiceOptions } from './util'
import commands from 'iroha-helpers/lib/commands'

function isLoggedIn () {
  return !!cache.username
}

function preDefinedPrivateKey () {
  return ['0f0ce16d2afbb8eca23c7d8c2724f0c257a800ee2bbd54688cec6b898e3f7e33']
}

function preDefinedAccountId () {
  return 'admin@iroha'
}

async function preInitialAssetQuantityForUser ({ assetId, accountId }) {
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
