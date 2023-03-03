import { useAccountResources, useTableItem } from '@spaceinvaders-swap/awgmi'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import _toString from 'lodash/toString'

import { SMARTCHEF_ADDRESS, SMARTCHEF_POOL_INFO_TYPE_TAG } from 'contracts/smartchef/constants'
import { useCallback, useMemo } from 'react'
import { useMasterChefResource } from 'state/farms/hook'
import { FARMS_USER_INFO, FARMS_USER_INFO_RESOURCE } from 'state/farms/constants'
import { getFarmConfig } from 'config/constants/farms'
import { PairState, usePairs } from 'hooks/usePairs'
import useLedgerTimestamp from 'hooks/useLedgerTimestamp'
import { APT, L0_USDC } from 'config/coins'
import { deserializeToken } from '@spaceinvaders-swap/token-lists'
import { Coin, Pair, PAIR_LP_TYPE_TAG } from '@spaceinvaders-swap/aptos-swap-sdk'
import { INVA_PID } from 'config/constants'
import { useInterval, useLastUpdated } from '@spaceinvaders-swap/hooks'

import { PoolResource } from '../types'
import transformInvaPool from '../transformers/transformInvaPool'
import transformPool from '../transformers/transformPool'
import { POOL_RESET_INTERVAL } from '../constants'
import useAddressPriceMap from './useAddressPriceMap'
import { getPriceInUSDC } from '../utils/getPriceInUSDC'

const POOL_RESOURCE_STALE_TIME = 15_000

export const usePoolsList = () => {
  // Since Aptos is timestamp-based update for earning, we will forcely refresh in 10 seconds.
  const { lastUpdated, setLastUpdated: refresh } = useLastUpdated()
  useInterval(refresh, POOL_RESET_INTERVAL)

  const { account, chainId, networkName } = useActiveWeb3React()
  const getNow = useLedgerTimestamp()

  const { data: pools } = useAccountResources({
    networkName,
    address: SMARTCHEF_ADDRESS,
    select: (resources) => {
      return resources.filter(
        // ignore LP Token Type for now
        (resource) => resource.type.includes(SMARTCHEF_POOL_INFO_TYPE_TAG) && !resource.type.includes(PAIR_LP_TYPE_TAG),
      )
    },
    staleTime: POOL_RESOURCE_STALE_TIME,
  })

  const { data: balances } = useAccountResources({
    address: account,
    select: (resources) => {
      return resources
    },
    staleTime: POOL_RESOURCE_STALE_TIME,
  })

  const prices = useAddressPriceMap({ pools, chainId })

  // const tranformInvaPool = useInvaPool({ balances, chainId })

  return useMemo(() => {
    const currentTimestamp = getNow()
    const syrupPools = pools
      ? pools
          .map((pool, index) =>
            transformPool(pool as PoolResource, currentTimestamp, balances, chainId, prices, index + 1),
          )
          .filter(Boolean)
          .sort((a, b) => Number(a?.sousId) - Number(b?.sousId))
      : []

    // const invaPool = tranformInvaPool()

    // return invaPool ? [invaPool, ...syrupPools] : syrupPools

    return syrupPools

    // Disable exhaustive for lastUpdated
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pools, balances, chainId, prices, lastUpdated])
}

export const useInvaPool = ({ balances, chainId }) => {
  const usdcCoin = L0_USDC[chainId]
  const aptCoin = APT[chainId]

  // Since Aptos is timestamp-based update for earning, we will forcely refresh in 6 seconds.
  const invaFarm = useMemo(() => getFarmConfig(chainId)?.find((f) => f.pid === INVA_PID), [chainId])

  const invaToken = useMemo(() => invaFarm?.token && deserializeToken(invaFarm?.token), [invaFarm])

  const pairs: [Coin, Coin][] = useMemo(() => {
    if (!invaToken) {
      return []
    }

    return [
      [aptCoin, usdcCoin],
      [aptCoin, invaToken],
      [usdcCoin, invaToken],
    ]
  }, [aptCoin, invaToken, usdcCoin])

  const pairsWithInfo = usePairs(pairs)

  const earningTokenPrice = useMemo(() => {
    if (!pairsWithInfo?.length) {
      return 0
    }

    return getPriceInUSDC({
      availablePairs: pairsWithInfo.filter(([status]) => status === PairState.EXISTS).map(([, pair]) => pair as Pair),
      tokenIn: invaToken,
      usdcCoin,
    })
  }, [invaToken, pairsWithInfo, usdcCoin])

  const { data: masterChef } = useMasterChefResource()

  const poolUserInfo = balances?.find((balance) => balance.type.includes(FARMS_USER_INFO_RESOURCE))

  const poolUserInfoHandle = poolUserInfo?.data?.pid_to_user_info?.inner?.handle

  const { data: userInfo } = useTableItem({
    handle: poolUserInfoHandle,
    data: {
      key: _toString(INVA_PID),
      keyType: 'u64',
      valueType: FARMS_USER_INFO,
    },
  })

  const getNow = useLedgerTimestamp()

  return useCallback(() => {
    if (!masterChef || !invaFarm) return undefined
    const invaPoolInfo = masterChef.data.pool_info[INVA_PID]

    return transformInvaPool({
      balances,
      invaPoolInfo,
      userInfo,
      masterChefData: masterChef.data,
      invaFarm,
      chainId,
      earningTokenPrice,
      getNow,
    })
  }, [masterChef, invaFarm, balances, userInfo, chainId, earningTokenPrice, getNow])
}
