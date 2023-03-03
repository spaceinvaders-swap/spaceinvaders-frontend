import BigNumber from 'bignumber.js'
import { SECONDS_IN_YEAR } from 'config'
import { ChainId } from '@spaceinvaders-swap/aptos-swap-sdk'
import mainnetLpAprs from 'config/constants/lpAprs/1.json'
import { BIG_TEN } from '@spaceinvaders-swap/utils/bigNumber'
import { FARM_DEFAULT_DECIMALS } from 'components/Farms/constants'

const getLpApr = (chainId: number) => {
  switch (chainId) {
    case ChainId.MAINNET:
      return mainnetLpAprs
    default:
      return {}
  }
}

/**
 * Get farm APR value in %
 * @param poolWeight allocationPoint / totalAllocationPoint
 * @param invaPriceUsd Inva price in USD
 * @param poolLiquidityUsd Total pool liquidity in USD
 * @param farmAddress Farm Address
 * @returns Farm Apr
 */
export const getFarmApr = (
  chainId: number,
  poolWeight: BigNumber,
  invaPriceUsd: BigNumber,
  poolLiquidityUsd: BigNumber,
  farmAddress: string,
  regularInvaPerSeconds: number,
): { invaRewardsApr: number; lpRewardsApr: number } => {
  const yearlyInvaRewardAllocation = poolWeight
    ? poolWeight.times(SECONDS_IN_YEAR * regularInvaPerSeconds)
    : new BigNumber(NaN)
  const invaRewardsApr = yearlyInvaRewardAllocation.times(invaPriceUsd).div(poolLiquidityUsd).times(100)
  let invaRewardsAprAsNumber: null | number = null
  if (!invaRewardsApr.isNaN() && invaRewardsApr.isFinite()) {
    invaRewardsAprAsNumber = invaRewardsApr.div(BIG_TEN.pow(FARM_DEFAULT_DECIMALS)).toNumber()
  }
  const lpRewardsApr = getLpApr(chainId)[farmAddress?.toLowerCase()] ?? 0
  return { invaRewardsApr: invaRewardsAprAsNumber as number, lpRewardsApr }
}

export default null
