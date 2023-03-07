import BigNumber from 'bignumber.js'
import { BIG_ZERO } from '@offsideswap/utils/bigNumber'
import { createSelector } from '@reduxjs/toolkit'
import { State, VaultKey } from '../types'
import { transformPool, transformVault } from './helpers'
import { initialPoolVaultState } from './index'
import { getVaultPosition, VaultPosition } from '../../utils/rotoPool'

const selectPoolsData = (state: State) => state.pools.data
const selectPoolData = (sousId) => (state: State) => state.pools.data.find((p) => p.sousId === sousId)
const selectUserDataLoaded = (state: State) => state.pools.userDataLoaded
const selectVault = (key: VaultKey) => (state: State) => key ? state.pools[key] : initialPoolVaultState
const selectIfo = (state: State) => state.pools.ifo
const selectIfoUserCredit = (state: State) => state.pools.ifo.credit ?? BIG_ZERO

export const makePoolWithUserDataLoadingSelector = (sousId) =>
  createSelector([selectPoolData(sousId), selectUserDataLoaded], (pool, userDataLoaded) => {
    return { pool: transformPool(pool), userDataLoaded }
  })

export const poolsWithUserDataLoadingSelector = createSelector(
  [selectPoolsData, selectUserDataLoaded],
  (pools, userDataLoaded) => {
    return { pools: pools.map(transformPool), userDataLoaded }
  },
)

export const makeVaultPoolByKey = (key) => createSelector([selectVault(key)], (vault) => transformVault(key, vault))

export const poolsWithVaultSelector = createSelector(
  [
    poolsWithUserDataLoadingSelector,
    makeVaultPoolByKey(VaultKey.RotoVault),
    makeVaultPoolByKey(VaultKey.RotoFlexibleSideVault),
  ],
  (poolsWithUserDataLoading, deserializedLockedRotoVault, deserializedFlexibleSideRotoVault) => {
    const { pools, userDataLoaded } = poolsWithUserDataLoading
    const rotoPool = pools.find((pool) => !pool.isFinished && pool.sousId === 0)
    const withoutRotoPool = pools.filter((pool) => pool.sousId !== 0)

    const rotoAutoVault = {
      ...rotoPool,
      ...deserializedLockedRotoVault,
      vaultKey: VaultKey.RotoVault,
      userData: { ...rotoPool.userData, ...deserializedLockedRotoVault.userData },
    }

    const lockedVaultPosition = getVaultPosition(deserializedLockedRotoVault.userData)
    const hasFlexibleSideSharesStaked = deserializedFlexibleSideRotoVault.userData.userShares.gt(0)

    const rotoAutoFlexibleSideVault =
      lockedVaultPosition > VaultPosition.Flexible || hasFlexibleSideSharesStaked
        ? [
            {
              ...rotoPool,
              ...deserializedFlexibleSideRotoVault,
              vaultKey: VaultKey.RotoFlexibleSideVault,
              userData: { ...rotoPool.userData, ...deserializedFlexibleSideRotoVault.userData },
            },
          ]
        : []

    return { pools: [rotoAutoVault, ...rotoAutoFlexibleSideVault, ...withoutRotoPool], userDataLoaded }
  },
)

export const makeVaultPoolWithKeySelector = (vaultKey) =>
  createSelector(poolsWithVaultSelector, ({ pools }) => pools.find((p) => p.vaultKey === vaultKey))

export const ifoCreditSelector = createSelector([selectIfoUserCredit], (ifoUserCredit) => {
  return new BigNumber(ifoUserCredit)
})

export const ifoCeilingSelector = createSelector([selectIfo], (ifoData) => {
  return new BigNumber(ifoData.ceiling)
})
