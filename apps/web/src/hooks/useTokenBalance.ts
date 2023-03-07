import { useAccount } from 'wagmi'
import BigNumber from 'bignumber.js'
import { ROTO } from '@offsideswap/tokens'
import { FAST_INTERVAL } from 'config/constants'
import { BigNumber as EthersBigNumber } from '@ethersproject/bignumber'
import { Zero } from '@ethersproject/constants'
import { ChainId } from '@offsideswap/sdk'
import { useMemo } from 'react'
import useSWR from 'swr'
import { BIG_ZERO } from '@offsideswap/utils/bigNumber'
import { bscRpcProvider } from 'utils/providers'
import { useWeb3React } from '@offsideswap/wagmi'
import { useTokenContract } from './useContract'
import { useSWRContract } from './useSWRContract'

const useTokenBalance = (tokenAddress: string, forceBSC?: boolean) => {
  const { address: account } = useAccount()

  const contract = useTokenContract(tokenAddress, false)

  const key = useMemo(
    () =>
      account
        ? {
            contract: forceBSC ? contract.connect(bscRpcProvider) : contract,
            methodName: 'balanceOf',
            params: [account],
          }
        : null,
    [account, contract, forceBSC],
  )

  const { data, status, ...rest } = useSWRContract(key as any, {
    refreshInterval: FAST_INTERVAL,
  })

  return {
    ...rest,
    fetchStatus: status,
    balance: data ? new BigNumber(data.toString()) : BIG_ZERO,
  }
}

export const useGetBnbBalance = () => {
  const { address: account } = useAccount()
  const { status, data, mutate } = useSWR([account, 'bnbBalance'], async () => {
    return bscRpcProvider.getBalance(account)
  })

  return { balance: data || Zero, fetchStatus: status, refresh: mutate }
}

export const useGetRotoBalance = () => {
  const { chainId } = useWeb3React()
  const { balance, fetchStatus } = useTokenBalance(ROTO[chainId]?.address || ROTO[ChainId.BSC]?.address, true)

  // TODO: Remove ethers conversion once useTokenBalance is converted to ethers.BigNumber
  return { balance: EthersBigNumber.from(balance.toString()), fetchStatus }
}

export default useTokenBalance
