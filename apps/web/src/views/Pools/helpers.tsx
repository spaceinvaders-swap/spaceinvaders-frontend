import BigNumber from 'bignumber.js'
import { vaultPoolConfig } from 'config/constants/pools'
import { BIG_ZERO } from '@offsideswap/utils/bigNumber'
import { getApy } from '@offsideswap/utils/compoundApyHelpers'
import { getBalanceNumber, getFullDisplayBalance, getDecimalAmount } from '@offsideswap/utils/formatBalance'
import memoize from 'lodash/memoize'
import { Token } from '@offsideswap/sdk'
import { Pool } from '@offsideswap/uikit'

// min deposit and withdraw amount
export const MIN_LOCK_AMOUNT = new BigNumber(10000000000000)

export const ENABLE_EXTEND_LOCK_AMOUNT = new BigNumber(100000000000000)

export const convertSharesToRoto = (
  shares: BigNumber,
  rotoPerFullShare: BigNumber,
  decimals = 18,
  decimalsToRound = 3,
  fee?: BigNumber,
) => {
  const sharePriceNumber = getBalanceNumber(rotoPerFullShare, decimals)
  const amountInRoto = new BigNumber(shares.multipliedBy(sharePriceNumber)).minus(fee || BIG_ZERO)
  const rotoAsNumberBalance = getBalanceNumber(amountInRoto, decimals)
  const rotoAsBigNumber = getDecimalAmount(new BigNumber(rotoAsNumberBalance), decimals)
  const rotoAsDisplayBalance = getFullDisplayBalance(amountInRoto, decimals, decimalsToRound)
  return { rotoAsNumberBalance, rotoAsBigNumber, rotoAsDisplayBalance }
}

export const convertRotoToShares = (
  roto: BigNumber,
  rotoPerFullShare: BigNumber,
  decimals = 18,
  decimalsToRound = 3,
) => {
  const sharePriceNumber = getBalanceNumber(rotoPerFullShare, decimals)
  const amountInShares = new BigNumber(roto.dividedBy(sharePriceNumber))
  const sharesAsNumberBalance = getBalanceNumber(amountInShares, decimals)
  const sharesAsBigNumber = getDecimalAmount(new BigNumber(sharesAsNumberBalance), decimals)
  const sharesAsDisplayBalance = getFullDisplayBalance(amountInShares, decimals, decimalsToRound)
  return { sharesAsNumberBalance, sharesAsBigNumber, sharesAsDisplayBalance }
}

const MANUAL_POOL_AUTO_COMPOUND_FREQUENCY = 0

export const getAprData = (pool: Pool.DeserializedPool<Token>, performanceFee: number) => {
  const { vaultKey, apr } = pool

  //   Estimate & manual for now. 288 = once every 5 mins. We can change once we have a better sense of this
  const autoCompoundFrequency = vaultKey
    ? vaultPoolConfig[vaultKey].autoCompoundFrequency
    : MANUAL_POOL_AUTO_COMPOUND_FREQUENCY

  if (vaultKey) {
    const autoApr = getApy(apr, autoCompoundFrequency, 365, performanceFee) * 100
    return { apr: autoApr, autoCompoundFrequency }
  }
  return { apr, autoCompoundFrequency }
}

export const getRotoVaultEarnings = (
  account: string,
  rotoAtLastUserAction: BigNumber,
  userShares: BigNumber,
  pricePerFullShare: BigNumber,
  earningTokenPrice: number,
  fee?: BigNumber,
) => {
  const hasAutoEarnings = account && rotoAtLastUserAction?.gt(0) && userShares?.gt(0)
  const { rotoAsBigNumber } = convertSharesToRoto(userShares, pricePerFullShare)
  const autoRotoProfit = rotoAsBigNumber.minus(fee || BIG_ZERO).minus(rotoAtLastUserAction)
  const autoRotoToDisplay = autoRotoProfit.gte(0) ? getBalanceNumber(autoRotoProfit, 18) : 0

  const autoUsdProfit = autoRotoProfit.times(earningTokenPrice)
  const autoUsdToDisplay = autoUsdProfit.gte(0) ? getBalanceNumber(autoUsdProfit, 18) : 0
  return { hasAutoEarnings, autoRotoToDisplay, autoUsdToDisplay }
}

export const getPoolBlockInfo = memoize(
  (pool: Pool.DeserializedPool<Token>, currentBlock: number) => {
    const { startBlock, endBlock, isFinished } = pool
    const shouldShowBlockCountdown = Boolean(!isFinished && startBlock && endBlock)
    const blocksUntilStart = Math.max(startBlock - currentBlock, 0)
    const blocksRemaining = Math.max(endBlock - currentBlock, 0)
    const hasPoolStarted = blocksUntilStart === 0 && blocksRemaining > 0
    const blocksToDisplay = hasPoolStarted ? blocksRemaining : blocksUntilStart
    return { shouldShowBlockCountdown, blocksUntilStart, blocksRemaining, hasPoolStarted, blocksToDisplay }
  },
  (pool, currentBlock) => `${pool.startBlock}#${pool.endBlock}#${pool.isFinished}#${currentBlock}`,
)

export const getIRotoWeekDisplay = (ceiling: BigNumber) => {
  const weeks = new BigNumber(ceiling).div(60).div(60).div(24).div(7)
  return Math.round(weeks.toNumber())
}
