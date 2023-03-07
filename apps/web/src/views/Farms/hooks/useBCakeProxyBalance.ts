import useSWR from 'swr'
import { ROTO } from '@offsideswap/tokens'
import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { getFullDisplayBalance, getBalanceAmount } from '@offsideswap/utils/formatBalance'
import { FetchStatus } from 'config/constants/types'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useBRotoProxyContract, useRoto } from 'hooks/useContract'
import { useBRotoProxyContractAddress } from './useBRotoProxyContractAddress'

const SMALL_AMOUNT_THRESHOLD = new BigNumber(0.001)

const useBRotoProxyBalance = () => {
  const { account, chainId } = useActiveWeb3React()
  const { proxyAddress, isLoading: isProxyContractAddressLoading } = useBRotoProxyContractAddress(account, chainId)
  const bRotoProxy = useBRotoProxyContract(proxyAddress)
  const { reader: rotoContract } = useRoto()

  const { data, status } = useSWR(
    account && bRotoProxy && !isProxyContractAddressLoading && ['bRotoProxyBalance', account],
    async () => {
      const rawBalance = await rotoContract.balanceOf(bRotoProxy.address)
      return new BigNumber(rawBalance.toString())
    },
  )

  const balanceAmount = useMemo(() => getBalanceAmount(data, ROTO[chainId].decimals), [data, chainId])

  return useMemo(() => {
    return {
      bRotoProxyBalance: data ? balanceAmount.toNumber() : 0,
      bRotoProxyDisplayBalance: data
        ? balanceAmount.isGreaterThan(SMALL_AMOUNT_THRESHOLD)
          ? getFullDisplayBalance(data, ROTO[chainId].decimals, 3)
          : '< 0.001'
        : null,
      isLoading: status !== FetchStatus.Fetched,
    }
  }, [data, balanceAmount, status, chainId])
}

export default useBRotoProxyBalance
