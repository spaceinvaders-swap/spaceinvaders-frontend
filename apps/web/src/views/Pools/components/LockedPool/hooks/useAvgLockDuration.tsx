import { useMemo } from 'react'
import { BOOST_WEIGHT, DURATION_FACTOR } from 'config/constants/pools'
import BigNumber from 'bignumber.js'
import { useInvaVault } from 'state/pools/hooks'
import { getFullDecimalMultiplier } from '@spaceinvaders-swap/utils/getFullDecimalMultiplier'

import { DEFAULT_TOKEN_DECIMAL } from 'config'
import formatSecondsToWeeks, { secondsToWeeks } from '../../utils/formatSecondsToWeeks'

export default function useAvgLockDuration() {
  const { totalLockedAmount, totalShares, totalInvaInVault, pricePerFullShare } = useInvaVault()

  const avgLockDurationsInSeconds = useMemo(() => {
    const flexibleInvaAmount = totalInvaInVault.minus(totalLockedAmount)
    const flexibleInvaShares = flexibleInvaAmount.div(pricePerFullShare).times(DEFAULT_TOKEN_DECIMAL)
    const lockedInvaBoostedShares = totalShares.minus(flexibleInvaShares)
    const lockedInvaOriginalShares = totalLockedAmount.div(pricePerFullShare).times(DEFAULT_TOKEN_DECIMAL)
    const avgBoostRatio = lockedInvaBoostedShares.div(lockedInvaOriginalShares)

    return (
      Math.round(
        avgBoostRatio
          .minus(1)
          .times(new BigNumber(DURATION_FACTOR.toString()))
          .div(new BigNumber(BOOST_WEIGHT.toString()).div(getFullDecimalMultiplier(12)))
          .toNumber(),
      ) || 0
    )
  }, [totalInvaInVault, totalLockedAmount, pricePerFullShare, totalShares])

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
