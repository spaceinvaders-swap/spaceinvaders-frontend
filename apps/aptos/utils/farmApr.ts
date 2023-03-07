import BigNumber from 'bignumber.js'
import { SECONDS_IN_YEAR } from 'config'
import { ChainId } from '@offsideswap/aptos-swap-sdk'
import mainnetLpAprs from 'config/constants/lpAprs/1.json'
import { BIG_TEN } from '@offsideswap/utils/bigNumber'
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
 * @param rotoPriceUsd Roto price in USD
 * @param poolLiquidityUsd Total pool liquidity in USD
 * @param farmAddress Farm Address
 * @returns Farm Apr
 */
export const getFarmApr = (
  chainId: number,
  poolWeight: BigNumber,
  rotoPriceUsd: BigNumber,
  poolLiquidityUsd: BigNumber,
  farmAddress: string,
  regularRotoPerSeconds: number,
): { rotoRewardsApr: number; lpRewardsApr: number } => {
  const yearlyRotoRewardAllocation = poolWeight
    ? poolWeight.times(SECONDS_IN_YEAR * regularRotoPerSeconds)
    : new BigNumber(NaN)
  const rotoRewardsApr = yearlyRotoRewardAllocation.times(rotoPriceUsd).div(poolLiquidityUsd).times(100)
  let rotoRewardsAprAsNumber: null | number = null
  if (!rotoRewardsApr.isNaN() && rotoRewardsApr.isFinite()) {
    rotoRewardsAprAsNumber = rotoRewardsApr.div(BIG_TEN.pow(FARM_DEFAULT_DECIMALS)).toNumber()
  }
  const lpRewardsApr = getLpApr(chainId)[farmAddress?.toLowerCase()] ?? 0
  return { rotoRewardsApr: rotoRewardsAprAsNumber as number, lpRewardsApr }
}

export default null
