import useSWRImmutable from 'swr/immutable'
import { NO_PROXY_CONTRACT } from 'config/constants'
import { useBRotoFarmBoosterContract } from 'hooks/useContract'
import { FetchStatus } from 'config/constants/types'
import { bRotoSupportedChainId } from '@offsideswap/farms/src/index'

export const useBRotoProxyContractAddress = (account?: string, chainId?: number) => {
  const bRotoFarmBoosterContract = useBRotoFarmBoosterContract()
  const isSupportedChain = bRotoSupportedChainId.includes(chainId)
  const { data, status, mutate } = useSWRImmutable(
    account && isSupportedChain && ['bProxyAddress', account, chainId],
    async () => bRotoFarmBoosterContract.proxyContract(account),
  )
  const isLoading = isSupportedChain ? status !== FetchStatus.Fetched : false

  return {
    proxyAddress: data,
    isLoading,
    proxyCreated: data && data !== NO_PROXY_CONTRACT,
    refreshProxyAddress: mutate,
  }
}
