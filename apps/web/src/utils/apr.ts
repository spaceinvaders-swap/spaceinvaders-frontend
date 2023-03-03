import BigNumber from 'bignumber.js'
import { ChainId } from '@spaceinvaders-swap/sdk'
import { BLOCKS_PER_YEAR } from 'config'
import lpAprs56 from 'config/constants/lpAprs/56.json'
import lpAprs1 from 'config/constants/lpAprs/1.json'

const getLpApr = (chainId: number) => {
  switch (chainId) {
    case ChainId.BSC:
      return lpAprs56
    case ChainId.ETHEREUM:
      return lpAprs1
    default:
      return {}
  }
}

/**
 * Get the APR value in %
 * @param stakingTokenPrice Token price in the same quote currency
 * @param rewardTokenPrice Token price in the same quote currency
 * @param totalStaked Total amount of stakingToken in the pool
 * @param tokenPerBlock Amount of new inva allocated to the pool for each new block
 * @returns Null if the APR is NaN or infinite.
 */
export const getPoolApr = (
  stakingTokenPrice: number,
  rewardTokenPrice: number,
  totalStaked: number,
  tokenPerBlock: number,
): number => {
  const totalRewardPricePerYear = new BigNumber(rewardTokenPrice).times(tokenPerBlock).times(BLOCKS_PER_YEAR)
  const totalStakingTokenInPool = new BigNumber(stakingTokenPrice).times(totalStaked)
  const apr = totalRewardPricePerYear.div(totalStakingTokenInPool).times(100)
  return apr.isNaN() || !apr.isFinite() ? null : apr.toNumber()
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
  regularInvaPerBlock: number,
): { invaRewardsApr: number; lpRewardsApr: number } => {
  const yearlyInvaRewardAllocation = poolWeight
    ? poolWeight.times(BLOCKS_PER_YEAR * regularInvaPerBlock)
    : new BigNumber(NaN)
  const invaRewardsApr = yearlyInvaRewardAllocation.times(invaPriceUsd).div(poolLiquidityUsd).times(100)
  let invaRewardsAprAsNumber = null
  if (!invaRewardsApr.isNaN() && invaRewardsApr.isFinite()) {
    invaRewardsAprAsNumber = invaRewardsApr.toNumber()
  }
  const lpRewardsApr = (getLpApr(chainId)[farmAddress?.toLowerCase()] || getLpApr(chainId)[farmAddress]) ?? 0 // can get both checksummed or lowercase
  return { invaRewardsApr: invaRewardsAprAsNumber, lpRewardsApr }
}

export default null
