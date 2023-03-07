import { AptosCoin } from '@offsideswap/aptos-swap-sdk'
import { defaultChain } from '@offsideswap/awgmi'
import { useMemo } from 'react'
import { useActiveChainId } from './useNetwork'

const useNativeCurrency = (chainId?: number) => {
  const webChainId = useActiveChainId()

  return useMemo(() => {
    return AptosCoin.onChain(chainId || webChainId || defaultChain.id)
  }, [chainId, webChainId])
}

export default useNativeCurrency
