import useSWR from 'swr'
import { INVA } from '@spaceinvaders-swap/tokens'
import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { getFullDisplayBalance, getBalanceAmount } from '@spaceinvaders-swap/utils/formatBalance'
import { FetchStatus } from 'config/constants/types'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useBInvaProxyContract, useInva } from 'hooks/useContract'
import { useBInvaProxyContractAddress } from './useBInvaProxyContractAddress'

const SMALL_AMOUNT_THRESHOLD = new BigNumber(0.001)

const useBInvaProxyBalance = () => {
  const { account, chainId } = useActiveWeb3React()
  const { proxyAddress, isLoading: isProxyContractAddressLoading } = useBInvaProxyContractAddress(account, chainId)
  const bInvaProxy = useBInvaProxyContract(proxyAddress)
  const { reader: invaContract } = useInva()

  const { data, status } = useSWR(
    account && bInvaProxy && !isProxyContractAddressLoading && ['bInvaProxyBalance', account],
    async () => {
      const rawBalance = await invaContract.balanceOf(bInvaProxy.address)
      return new BigNumber(rawBalance.toString())
    },
  )

  const balanceAmount = useMemo(() => getBalanceAmount(data, INVA[chainId].decimals), [data, chainId])

  return useMemo(() => {
    return {
      bInvaProxyBalance: data ? balanceAmount.toNumber() : 0,
      bInvaProxyDisplayBalance: data
        ? balanceAmount.isGreaterThan(SMALL_AMOUNT_THRESHOLD)
          ? getFullDisplayBalance(data, INVA[chainId].decimals, 3)
          : '< 0.001'
        : null,
      isLoading: status !== FetchStatus.Fetched,
    }
  }, [data, balanceAmount, status, chainId])
}

export default useBInvaProxyBalance
