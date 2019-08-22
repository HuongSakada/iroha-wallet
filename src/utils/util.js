import {
  CommandService_v1Client as CommandService,
  QueryService_v1Client as QueryService
} from 'iroha-helpers/lib/proto/endpoint_pb_service'

import { preDefinedPrivateKey, preDefinedAccountId } from '@/utils/functions'

export const DEFAULT_TIMEOUT_LIMIT = 5000

export const cache = {
  username: null,
  key: null,
  nodeIp: 'http://0.0.0.0:8081'
}

export function newCommandService () {
  return new CommandService(cache.nodeIp)
}

export function newCommandServiceOptions (privateKeys, quorum) {
  return {
    privateKeys,
    quorum,
    creatorAccountId: cache.username,
    commandService: newCommandService(),
    timeoutLimit: DEFAULT_TIMEOUT_LIMIT
  }
}

export function newPreCommandServiceOptions () {
  return {
    privateKeys: preDefinedPrivateKey(),
    quorum: 1,
    creatorAccountId: preDefinedAccountId(),
    commandService: newCommandService(),
    timeoutLimit: DEFAULT_TIMEOUT_LIMIT
  }
}

export function newQueryServiceOptions () {
  return {
    privateKey: cache.key,
    creatorAccountId: cache.username,
    queryService: new QueryService(cache.nodeIp),
    timeoutLimit: DEFAULT_TIMEOUT_LIMIT
  }
}