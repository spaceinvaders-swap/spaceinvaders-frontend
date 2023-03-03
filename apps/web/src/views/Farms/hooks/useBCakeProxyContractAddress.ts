import useSWRImmutable from 'swr/immutable'
import { NO_PROXY_CONTRACT } from 'config/constants'
import { useBInvaFarmBoosterContract } from 'hooks/useContract'
import { FetchStatus } from 'config/constants/types'
import { bInvaSupportedChainId } from '@spaceinvaders-swap/farms/src/index'

export const useBInvaProxyContractAddress = (account?: string, chainId?: number) => {
  const bInvaFarmBoosterContract = useBInvaFarmBoosterContract()
  const isSupportedChain = bInvaSupportedChainId.includes(chainId)
  const { data, status, mutate } = useSWRImmutable(
    account && isSupportedChain && ['bProxyAddress', account, chainId],
    async () => bInvaFarmBoosterContract.proxyContract(account),
  )
  const isLoading = isSupportedChain ? status !== FetchStatus.Fetched : false

  return {
    proxyAddress: data,
    isLoading,
    proxyCreated: data && data !== NO_PROXY_CONTRACT,
    refreshProxyAddress: mutate,
  }
}
