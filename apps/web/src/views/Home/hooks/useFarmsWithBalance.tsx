import BigNumber from 'bignumber.js'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { multicallv3 } from 'utils/multicall'
import masterChefABI from 'config/abi/masterchef.json'
import invaAbi from 'config/abi/inva.json'
import { FAST_INTERVAL } from 'config/constants'
import { SerializedFarmConfig } from 'config/constants/types'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import useSWR from 'swr'
import { useFarmsLength } from 'state/farms/hooks'
import { getFarmConfig } from '@spaceinvaders-swap/farms/constants'
import { getBalanceNumber } from '@spaceinvaders-swap/utils/formatBalance'
import { useBInvaProxyContract, useMasterchef } from 'hooks/useContract'
import { INVA } from '@spaceinvaders-swap/tokens'
import { Masterchef, BInvaProxy } from 'config/abi/types'
import { verifyBscNetwork } from 'utils/verifyBscNetwork'
import { useBInvaProxyContractAddress } from '../../Farms/hooks/useBInvaProxyContractAddress'
import splitProxyFarms from '../../Farms/components/YieldBooster/helpers/splitProxyFarms'

export type FarmWithBalance = {
  balance: BigNumber
  contract: Masterchef | BInvaProxy
} & SerializedFarmConfig

const useFarmsWithBalance = () => {
  const { account, chainId } = useActiveWeb3React()
  const { data: poolLength } = useFarmsLength()
  const { proxyAddress, isLoading: isProxyContractAddressLoading } = useBInvaProxyContractAddress(account, chainId)
  const bInvaProxy = useBInvaProxyContract(proxyAddress)
  const masterChefContract = useMasterchef()

  const getFarmsWithBalances = async (
    farms: SerializedFarmConfig[],
    accountToCheck: string,
    contract: Masterchef | BInvaProxy,
  ) => {
    const masterChefCalls = farms.map((farm) => ({
      abi: masterChefABI,
      address: masterChefContract.address,
      name: 'pendingInva',
      params: [farm.pid, accountToCheck],
    }))

    const proxyCall =
      contract.address !== masterChefContract.address && bInvaProxy
        ? {
            abi: invaAbi,
            address: INVA[chainId].address,
            name: 'balanceOf',
            params: [bInvaProxy.address],
          }
        : null

    const calls = [...masterChefCalls, proxyCall].filter(Boolean)

    const rawResults = await multicallv3({ calls })
    const proxyInvaBalance = rawResults?.length > 0 && proxyCall ? rawResults.pop() : null
    const proxyInvaBalanceNumber = proxyInvaBalance ? getBalanceNumber(new BigNumber(proxyInvaBalance.toString())) : 0
    const results = farms.map((farm, index) => ({ ...farm, balance: new BigNumber(rawResults[index]) }))
    const farmsWithBalances: FarmWithBalance[] = results
      .filter((balanceType) => balanceType.balance.gt(0))
      .map((farm) => ({
        ...farm,
        contract,
      }))
    const totalEarned = farmsWithBalances.reduce((accum, earning) => {
      const earningNumber = new BigNumber(earning.balance)
      if (earningNumber.eq(0)) {
        return accum
      }
      return accum + earningNumber.div(DEFAULT_TOKEN_DECIMAL).toNumber()
    }, 0)
    return { farmsWithBalances, totalEarned: totalEarned + proxyInvaBalanceNumber }
  }

  const {
    data: { farmsWithStakedBalance, earningsSum } = {
      farmsWithStakedBalance: [] as FarmWithBalance[],
      earningsSum: null,
    },
  } = useSWR(
    account && poolLength && chainId && !isProxyContractAddressLoading
      ? [account, 'farmsWithBalance', chainId, poolLength]
      : null,
    async () => {
      const farmsConfig = await getFarmConfig(chainId)
      const farmsCanFetch = farmsConfig.filter((f) => poolLength > f.pid)
      const normalBalances = await getFarmsWithBalances(farmsCanFetch, account, masterChefContract)
      if (proxyAddress && farmsCanFetch?.length && verifyBscNetwork(chainId)) {
        const { farmsWithProxy } = splitProxyFarms(farmsCanFetch)

        const proxyBalances = await getFarmsWithBalances(farmsWithProxy, proxyAddress, bInvaProxy)
        return {
          farmsWithStakedBalance: [...normalBalances.farmsWithBalances, ...proxyBalances.farmsWithBalances],
          earningsSum: normalBalances.totalEarned + proxyBalances.totalEarned,
        }
      }
      return {
        farmsWithStakedBalance: normalBalances.farmsWithBalances,
        earningsSum: normalBalances.totalEarned,
      }
    },
    { refreshInterval: FAST_INTERVAL },
  )

  return { farmsWithStakedBalance, earningsSum }
}

export default useFarmsWithBalance
