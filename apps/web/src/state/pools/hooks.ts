import { useEffect, useMemo } from 'react'
import { useAccount } from 'wagmi'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { batch, useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useFastRefreshEffect, useSlowRefreshEffect } from 'hooks/useRefreshEffect'
import { FAST_INTERVAL } from 'config/constants'
import useSWRImmutable from 'swr/immutable'
import { getFarmConfig } from '@spaceinvaders-swap/farms/constants'
import { livePools } from 'config/constants/pools'
import { Pool } from '@spaceinvaders-swap/uikit'
import { Token } from '@spaceinvaders-swap/sdk'

import { useActiveChainId } from 'hooks/useActiveChainId'
import {
  fetchPoolsPublicDataAsync,
  fetchPoolsUserDataAsync,
  fetchInvaVaultPublicData,
  fetchInvaVaultUserData,
  fetchInvaVaultFees,
  fetchPoolsStakingLimitsAsync,
  fetchUserIfoCreditDataAsync,
  fetchIfoPublicDataAsync,
  fetchInvaFlexibleSideVaultPublicData,
  fetchInvaFlexibleSideVaultUserData,
  fetchInvaFlexibleSideVaultFees,
  fetchInvaPoolUserDataAsync,
  fetchInvaPoolPublicDataAsync,
} from '.'
import { VaultKey } from '../types'
import { fetchFarmsPublicDataAsync } from '../farms'
import {
  makePoolWithUserDataLoadingSelector,
  makeVaultPoolByKey,
  poolsWithVaultSelector,
  ifoCreditSelector,
  ifoCeilingSelector,
  makeVaultPoolWithKeySelector,
} from './selectors'

const lPoolAddresses = livePools.filter(({ sousId }) => sousId !== 0).map(({ earningToken }) => earningToken.address)

// Only fetch farms for live pools
const getActiveFarms = async (chainId: number) => {
  const farmsConfig = await getFarmConfig(chainId)
  return farmsConfig
    .filter(
      ({ token, pid, quoteToken }) =>
        pid !== 0 &&
        ((token.symbol === 'INVA' && quoteToken.symbol === 'WBNB') ||
          (token.symbol === 'BUSD' && quoteToken.symbol === 'WBNB') ||
          (token.symbol === 'USDT' && quoteToken.symbol === 'BUSD') ||
          lPoolAddresses.find((poolAddress) => poolAddress === token.address)),
    )
    .map((farm) => farm.pid)
}

const getInvaPriceFarms = async (chainId: number) => {
  const farmsConfig = await getFarmConfig(chainId)
  return farmsConfig
    .filter(
      ({ token, pid, quoteToken }) =>
        pid !== 0 &&
        ((token.symbol === 'INVA' && quoteToken.symbol === 'WBNB') ||
          (token.symbol === 'BUSD' && quoteToken.symbol === 'WBNB')),
    )
    .map((farm) => farm.pid)
}

export const useFetchPublicPoolsData = () => {
  const dispatch = useAppDispatch()
  const { chainId } = useActiveChainId()

  useSlowRefreshEffect(
    (currentBlock) => {
      const fetchPoolsDataWithFarms = async () => {
        const activeFarms = await getActiveFarms(chainId)
        await dispatch(fetchFarmsPublicDataAsync({ pids: activeFarms, chainId }))

        batch(() => {
          dispatch(fetchPoolsPublicDataAsync(currentBlock, chainId))
          dispatch(fetchPoolsStakingLimitsAsync())
        })
      }

      fetchPoolsDataWithFarms()
    },
    [dispatch, chainId],
  )
}

export const usePool = (sousId: number): { pool: Pool.DeserializedPool<Token>; userDataLoaded: boolean } => {
  const poolWithUserDataLoadingSelector = useMemo(() => makePoolWithUserDataLoadingSelector(sousId), [sousId])
  return useSelector(poolWithUserDataLoadingSelector)
}

export const usePoolsWithVault = () => {
  return useSelector(poolsWithVaultSelector)
}

export const useDeserializedPoolByVaultKey = (vaultKey) => {
  const vaultPoolWithKeySelector = useMemo(() => makeVaultPoolWithKeySelector(vaultKey), [vaultKey])

  return useSelector(vaultPoolWithKeySelector)
}

export const usePoolsPageFetch = () => {
  const { address: account } = useAccount()
  const dispatch = useAppDispatch()
  useFetchPublicPoolsData()

  useFastRefreshEffect(() => {
    batch(() => {
      dispatch(fetchInvaVaultPublicData())
      dispatch(fetchInvaFlexibleSideVaultPublicData())
      dispatch(fetchIfoPublicDataAsync())
      if (account) {
        dispatch(fetchPoolsUserDataAsync(account))
        dispatch(fetchInvaVaultUserData({ account }))
        dispatch(fetchInvaFlexibleSideVaultUserData({ account }))
      }
    })
  }, [account, dispatch])

  useEffect(() => {
    batch(() => {
      dispatch(fetchInvaVaultFees())
      dispatch(fetchInvaFlexibleSideVaultFees())
    })
  }, [dispatch])
}

export const useInvaVaultUserData = () => {
  const { address: account } = useAccount()
  const dispatch = useAppDispatch()

  useFastRefreshEffect(() => {
    if (account) {
      dispatch(fetchInvaVaultUserData({ account }))
    }
  }, [account, dispatch])
}

export const useInvaVaultPublicData = () => {
  const dispatch = useAppDispatch()
  useFastRefreshEffect(() => {
    dispatch(fetchInvaVaultPublicData())
  }, [dispatch])
}

export const useFetchIfo = () => {
  const { account, chainId } = useActiveWeb3React()
  const dispatch = useAppDispatch()

  useSWRImmutable(
    'fetchIfoPublicData',
    async () => {
      const invaPriceFarms = await getInvaPriceFarms(chainId)
      await dispatch(fetchFarmsPublicDataAsync({ pids: invaPriceFarms, chainId }))
      batch(() => {
        dispatch(fetchInvaPoolPublicDataAsync())
        dispatch(fetchInvaVaultPublicData())
        dispatch(fetchIfoPublicDataAsync())
      })
    },
    {
      refreshInterval: FAST_INTERVAL,
    },
  )

  useSWRImmutable(
    account && ['fetchIfoUserData', account],
    async () => {
      batch(() => {
        dispatch(fetchInvaPoolUserDataAsync(account))
        dispatch(fetchInvaVaultUserData({ account }))
        dispatch(fetchUserIfoCreditDataAsync(account))
      })
    },
    {
      refreshInterval: FAST_INTERVAL,
    },
  )

  useSWRImmutable('fetchInvaVaultFees', async () => {
    dispatch(fetchInvaVaultFees())
  })
}

export const useInvaVault = () => {
  return useVaultPoolByKey(VaultKey.InvaVault)
}

export const useVaultPoolByKey = (key: VaultKey) => {
  const vaultPoolByKey = useMemo(() => makeVaultPoolByKey(key), [key])

  return useSelector(vaultPoolByKey)
}

export const useIfoCredit = () => {
  return useSelector(ifoCreditSelector)
}

export const useIfoCeiling = () => {
  return useSelector(ifoCeilingSelector)
}
