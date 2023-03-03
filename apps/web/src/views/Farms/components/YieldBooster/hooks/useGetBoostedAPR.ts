import BigNumber from 'bignumber.js'
import _toNumber from 'lodash/toNumber'
import { useMemo } from 'react'
import { useInvaVaultPublicData, useInvaVaultUserData } from 'state/pools/hooks'
import { getBInvaMultiplier } from 'views/Farms/components/YieldBooster/components/BInvaCalculator'
import { useUserLockedInvaStatus } from 'views/Farms/hooks/useUserLockedInvaStatus'
import useAvgLockDuration from 'views/Pools/components/LockedPool/hooks/useAvgLockDuration'
import { secondsToDays } from 'views/Pools/components/utils/formatSecondsToWeeks'

export const useGetBoostedMultiplier = (userBalanceInFarm: BigNumber, lpTokenStakedAmount: BigNumber) => {
  useInvaVaultPublicData()
  useInvaVaultUserData()
  const { avgLockDurationsInSeconds } = useAvgLockDuration()
  const { isLoading, lockedAmount, totalLockedAmount, lockedStart, lockedEnd } = useUserLockedInvaStatus()
  const bInvaMultiplier = useMemo(() => {
    const result = getBInvaMultiplier(
      userBalanceInFarm, // userBalanceInFarm,
      lockedAmount, // userLockAmount
      secondsToDays(_toNumber(lockedEnd) - _toNumber(lockedStart)), // userLockDuration
      totalLockedAmount, // totalLockAmount
      lpTokenStakedAmount, // lpBalanceOfFarm
      avgLockDurationsInSeconds ? secondsToDays(avgLockDurationsInSeconds) : 280, // AverageLockDuration
    )
    return result.toString() === 'NaN' || isLoading ? '1.000' : result.toFixed(3)
  }, [
    userBalanceInFarm,
    lpTokenStakedAmount,
    totalLockedAmount,
    avgLockDurationsInSeconds,
    lockedAmount,
    lockedEnd,
    lockedStart,
    isLoading,
  ])
  return _toNumber(bInvaMultiplier)
}

export const useGetCalculatorMultiplier = (
  userBalanceInFarm: BigNumber,
  lpTokenStakedAmount: BigNumber,
  lockedAmount: BigNumber,
  userLockDuration: number,
) => {
  useInvaVaultPublicData()
  useInvaVaultUserData()
  const { avgLockDurationsInSeconds } = useAvgLockDuration()
  const { isLoading, totalLockedAmount } = useUserLockedInvaStatus()
  const bInvaMultiplier = useMemo(() => {
    const result = getBInvaMultiplier(
      userBalanceInFarm, // userBalanceInFarm,
      lockedAmount, // userLockAmount
      secondsToDays(userLockDuration), // userLockDuration
      totalLockedAmount, // totalLockAmount
      lpTokenStakedAmount, // lpBalanceOfFarm
      avgLockDurationsInSeconds ? secondsToDays(avgLockDurationsInSeconds) : 280, // AverageLockDuration
    )
    return result.toString() === 'NaN' || isLoading ? '1.000' : result.toFixed(3)
  }, [
    userBalanceInFarm,
    lpTokenStakedAmount,
    totalLockedAmount,
    avgLockDurationsInSeconds,
    lockedAmount,
    isLoading,
    userLockDuration,
  ])
  return _toNumber(bInvaMultiplier)
}

const useGetBoostedAPR = (
  userBalanceInFarm: BigNumber,
  lpTokenStakedAmount: BigNumber,
  apr: number,
  lpRewardsApr: number,
) => {
  const bInvaMultiplier = useGetBoostedMultiplier(userBalanceInFarm, lpTokenStakedAmount)
  return (apr * bInvaMultiplier + lpRewardsApr).toFixed(2)
}

export default useGetBoostedAPR
