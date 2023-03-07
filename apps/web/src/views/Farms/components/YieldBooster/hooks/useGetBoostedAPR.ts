import BigNumber from 'bignumber.js'
import _toNumber from 'lodash/toNumber'
import { useMemo } from 'react'
import { useRotoVaultPublicData, useRotoVaultUserData } from 'state/pools/hooks'
import { getBRotoMultiplier } from 'views/Farms/components/YieldBooster/components/BRotoCalculator'
import { useUserLockedRotoStatus } from 'views/Farms/hooks/useUserLockedRotoStatus'
import useAvgLockDuration from 'views/Pools/components/LockedPool/hooks/useAvgLockDuration'
import { secondsToDays } from 'views/Pools/components/utils/formatSecondsToWeeks'

export const useGetBoostedMultiplier = (userBalanceInFarm: BigNumber, lpTokenStakedAmount: BigNumber) => {
  useRotoVaultPublicData()
  useRotoVaultUserData()
  const { avgLockDurationsInSeconds } = useAvgLockDuration()
  const { isLoading, lockedAmount, totalLockedAmount, lockedStart, lockedEnd } = useUserLockedRotoStatus()
  const bRotoMultiplier = useMemo(() => {
    const result = getBRotoMultiplier(
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
  return _toNumber(bRotoMultiplier)
}

export const useGetCalculatorMultiplier = (
  userBalanceInFarm: BigNumber,
  lpTokenStakedAmount: BigNumber,
  lockedAmount: BigNumber,
  userLockDuration: number,
) => {
  useRotoVaultPublicData()
  useRotoVaultUserData()
  const { avgLockDurationsInSeconds } = useAvgLockDuration()
  const { isLoading, totalLockedAmount } = useUserLockedRotoStatus()
  const bRotoMultiplier = useMemo(() => {
    const result = getBRotoMultiplier(
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
  return _toNumber(bRotoMultiplier)
}

const useGetBoostedAPR = (
  userBalanceInFarm: BigNumber,
  lpTokenStakedAmount: BigNumber,
  apr: number,
  lpRewardsApr: number,
) => {
  const bRotoMultiplier = useGetBoostedMultiplier(userBalanceInFarm, lpTokenStakedAmount)
  return (apr * bRotoMultiplier + lpRewardsApr).toFixed(2)
}

export default useGetBoostedAPR
