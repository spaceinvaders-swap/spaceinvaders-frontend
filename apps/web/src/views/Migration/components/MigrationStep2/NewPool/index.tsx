import React, { useEffect, useMemo } from 'react'
import { useAccount } from 'wagmi'
import { useRotoVault, usePoolsWithVault } from 'state/pools/hooks'
import { useFastRefreshEffect } from 'hooks/useRefreshEffect'
import { useAppDispatch } from 'state'
import {
  fetchRotoPoolUserDataAsync,
  fetchRotoVaultFees,
  fetchRotoVaultPublicData,
  fetchRotoVaultUserData,
  fetchRotoPoolPublicDataAsync,
  fetchRotoFlexibleSideVaultPublicData,
  fetchRotoFlexibleSideVaultUserData,
  fetchRotoFlexibleSideVaultFees,
} from 'state/pools'
import { batch } from 'react-redux'
import { Pool } from '@offsideswap/uikit'
import { Token } from '@offsideswap/sdk'
import PoolsTable from './PoolTable'

const NewPool: React.FC<React.PropsWithChildren> = () => {
  const { address: account } = useAccount()
  const { pools } = usePoolsWithVault()
  const rotoVault = useRotoVault()

  const stakedOnlyOpenPools = useMemo(
    () => pools.filter((pool) => pool.userData && pool.sousId === 0 && !pool.isFinished),
    [pools],
  ) as Pool.DeserializedPool<Token>[]

  const userDataReady: boolean = !account || (!!account && !rotoVault.userData?.isLoading)

  const dispatch = useAppDispatch()

  useFastRefreshEffect(() => {
    batch(() => {
      dispatch(fetchRotoVaultPublicData())
      dispatch(fetchRotoFlexibleSideVaultPublicData())
      dispatch(fetchRotoPoolPublicDataAsync())
      if (account) {
        dispatch(fetchRotoVaultUserData({ account }))
        dispatch(fetchRotoFlexibleSideVaultUserData({ account }))
        dispatch(fetchRotoPoolUserDataAsync(account))
      }
    })
  }, [account, dispatch])

  useEffect(() => {
    batch(() => {
      dispatch(fetchRotoVaultFees())
      dispatch(fetchRotoFlexibleSideVaultFees())
    })
  }, [dispatch])

  return <PoolsTable pools={stakedOnlyOpenPools} account={account} userDataReady={userDataReady} />
}

export default NewPool
