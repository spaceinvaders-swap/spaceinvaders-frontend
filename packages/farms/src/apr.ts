import { FixedNumber } from '@ethersproject/bignumber'
import { FarmWithPrices } from './farmPrices'

// copy from src/config, should merge them later
const BSC_BLOCK_TIME = 3
const BLOCKS_PER_YEAR = (60 / BSC_BLOCK_TIME) * 60 * 24 * 365 // 10512000

const FIXED_ZERO = FixedNumber.from(0)
const FIXED_100 = FixedNumber.from(100)

export const getFarmInvaRewardApr = (farm: FarmWithPrices, invaPriceBusd: FixedNumber, regularInvaPerBlock: number) => {
  let invaRewardsAprAsString = '0'
  if (!invaPriceBusd) {
    return invaRewardsAprAsString
  }
  const totalLiquidity = FixedNumber.from(farm.lpTotalInQuoteToken).mulUnsafe(
    FixedNumber.from(farm.quoteTokenPriceBusd),
  )
  const poolWeight = FixedNumber.from(farm.poolWeight)
  if (totalLiquidity.isZero() || poolWeight.isZero()) {
    return invaRewardsAprAsString
  }
  const yearlyInvaRewardAllocation = poolWeight
    ? poolWeight.mulUnsafe(FixedNumber.from(BLOCKS_PER_YEAR).mulUnsafe(FixedNumber.from(String(regularInvaPerBlock))))
    : FIXED_ZERO
  const invaRewardsApr = yearlyInvaRewardAllocation
    .mulUnsafe(invaPriceBusd)
    .divUnsafe(totalLiquidity)
    .mulUnsafe(FIXED_100)
  if (!invaRewardsApr.isZero()) {
    invaRewardsAprAsString = invaRewardsApr.toUnsafeFloat().toFixed(2)
  }
  return invaRewardsAprAsString
}
