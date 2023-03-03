import React, { useEffect, useMemo } from 'react'
import { useAccount } from 'wagmi'
import { useInvaVault, usePoolsWithVault } from 'state/pools/hooks'
import { useFastRefreshEffect } from 'hooks/useRefreshEffect'
import { useAppDispatch } from 'state'
import {
  fetchInvaPoolUserDataAsync,
  fetchInvaVaultFees,
  fetchInvaVaultPublicData,
  fetchInvaVaultUserData,
  fetchInvaPoolPublicDataAsync,
  fetchInvaFlexibleSideVaultPublicData,
  fetchInvaFlexibleSideVaultUserData,
  fetchInvaFlexibleSideVaultFees,
} from 'state/pools'
import { batch } from 'react-redux'
import { Pool } from '@spaceinvaders-swap/uikit'
import { Token } from '@spaceinvaders-swap/sdk'
import PoolsTable from './PoolTable'

const NewPool: React.FC<React.PropsWithChildren> = () => {
  const { address: account } = useAccount()
  const { pools } = usePoolsWithVault()
  const invaVault = useInvaVault()

  const stakedOnlyOpenPools = useMemo(
    () => pools.filter((pool) => pool.userData && pool.sousId === 0 && !pool.isFinished),
    [pools],
  ) as Pool.DeserializedPool<Token>[]

  const userDataReady: boolean = !account || (!!account && !invaVault.userData?.isLoading)

  const dispatch = useAppDispatch()

  useFastRefreshEffect(() => {
    batch(() => {
      dispatch(fetchInvaVaultPublicData())
      dispatch(fetchInvaFlexibleSideVaultPublicData())
      dispatch(fetchInvaPoolPublicDataAsync())
      if (account) {
        dispatch(fetchInvaVaultUserData({ account }))
        dispatch(fetchInvaFlexibleSideVaultUserData({ account }))
        dispatch(fetchInvaPoolUserDataAsync(account))
      }
    })
  }, [account, dispatch])

  useEffect(() => {
    batch(() => {
      dispatch(fetchInvaVaultFees())
      dispatch(fetchInvaFlexibleSideVaultFees())
    })
  }, [dispatch])

  return <PoolsTable pools={stakedOnlyOpenPools} account={account} userDataReady={userDataReady} />
}

export default NewPool
