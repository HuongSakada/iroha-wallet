import _ from 'lodash'

var moment = require('moment')

export function transactionAssetForm (transactions, accountId) {
  const transformed = []
  let txs = _.flatten(transactions)

  if (!_.isEmpty(txs)) {
    txs.forEach((t, index) => {
      const { commandsList, createdTime } = t.payload.reducedPayload
      const batch = t.payload.batch
      const signatures = t.signaturesList.map(x =>
        Buffer.from(x.publicKey, 'base64').toString('hex')
      )

      commandsList.forEach(c => {
        if (!c.transferAsset) return

        const {
          amount,
          assetId,
          destAccountId,
          srcAccountId,
          description
        } = c.transferAsset

        const tx = {
          from:
            srcAccountId === accountId ? 'you' : _.split(srcAccountId, '@', 1),
          to: destAccountId === accountId ? 'you' : _.split(destAccountId, '@', 1),
          assetId: _.split(assetId, '#', 1),
          amount: amount,
          date: moment(createdTime).format('DD-MM-YYYY HH:MM'),
          message: description,
          batch,
          signatures,
          id: index
        }

        transformed.push(tx)
      })
    })
  }

  return _(transformed)
    .chain()
    .uniqWith(_.isEqual)
    .sortBy('date')
    .reverse()
    .value()
}
