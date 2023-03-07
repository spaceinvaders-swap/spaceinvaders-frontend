import { useMemo } from 'react'
import { BOOST_WEIGHT, DURATION_FACTOR } from 'config/constants/pools'
import BigNumber from 'bignumber.js'
import { useRotoVault } from 'state/pools/hooks'
import { getFullDecimalMultiplier } from '@offsideswap/utils/getFullDecimalMultiplier'

import { DEFAULT_TOKEN_DECIMAL } from 'config'
import formatSecondsToWeeks, { secondsToWeeks } from '../../utils/formatSecondsToWeeks'

export default function useAvgLockDuration() {
  const { totalLockedAmount, totalShares, totalRotoInVault, pricePerFullShare } = useRotoVault()

  const avgLockDurationsInSeconds = useMemo(() => {
    const flexibleRotoAmount = totalRotoInVault.minus(totalLockedAmount)
    const flexibleRotoShares = flexibleRotoAmount.div(pricePerFullShare).times(DEFAULT_TOKEN_DECIMAL)
    const lockedRotoBoostedShares = totalShares.minus(flexibleRotoShares)
    const lockedRotoOriginalShares = totalLockedAmount.div(pricePerFullShare).times(DEFAULT_TOKEN_DECIMAL)
    const avgBoostRatio = lockedRotoBoostedShares.div(lockedRotoOriginalShares)

    return (
      Math.round(
        avgBoostRatio
          .minus(1)
          .times(new BigNumber(DURATION_FACTOR.toString()))
          .div(new BigNumber(BOOST_WEIGHT.toString()).div(getFullDecimalMultiplier(12)))
          .toNumber(),
      ) || 0
    )
  }, [totalRotoInVault, totalLockedAmount, pricePerFullShare, totalShares])

  const avgLockDurationsInWeeks = useMemo(
    () => formatSecondsToWeeks(avgLockDurationsInSeconds),
    [avgLockDurationsInSeconds],
  )

  const avgLockDurationsInWeeksNum = useMemo(
    () => secondsToWeeks(avgLockDurationsInSeconds),
    [avgLockDurationsInSeconds],
  )

  return {
    avgLockDurationsInWeeks,
    avgLockDurationsInWeeksNum,
    avgLockDurationsInSeconds,
  }
}
