import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useSWRContract } from 'hooks/useSWRContract'
import { getRotoContract } from 'utils/contractHelpers'
import { getBalanceNumber } from '@offsideswap/utils/formatBalance'
import { useBRotoProxyContractAddress } from 'views/Farms/hooks/useBRotoProxyContractAddress'
import BigNumber from 'bignumber.js'

const useProxyROTOBalance = () => {
  const { account, chainId } = useActiveWeb3React()
  const { proxyAddress } = useBRotoProxyContractAddress(account, chainId)
  const rotoContract = getRotoContract()

  const { data, mutate } = useSWRContract([rotoContract, 'balanceOf', [proxyAddress]])

  return {
    refreshProxyRotoBalance: mutate,
    proxyRotoBalance: data ? getBalanceNumber(new BigNumber(data.toString())) : 0,
  }
}

export default useProxyROTOBalance
