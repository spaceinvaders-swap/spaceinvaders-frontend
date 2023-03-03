import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useSWRContract } from 'hooks/useSWRContract'
import { getInvaContract } from 'utils/contractHelpers'
import { getBalanceNumber } from '@spaceinvaders-swap/utils/formatBalance'
import { useBInvaProxyContractAddress } from 'views/Farms/hooks/useBInvaProxyContractAddress'
import BigNumber from 'bignumber.js'

const useProxyINVABalance = () => {
  const { account, chainId } = useActiveWeb3React()
  const { proxyAddress } = useBInvaProxyContractAddress(account, chainId)
  const invaContract = getInvaContract()

  const { data, mutate } = useSWRContract([invaContract, 'balanceOf', [proxyAddress]])

  return {
    refreshProxyInvaBalance: mutate,
    proxyInvaBalance: data ? getBalanceNumber(new BigNumber(data.toString())) : 0,
  }
}

export default useProxyINVABalance
