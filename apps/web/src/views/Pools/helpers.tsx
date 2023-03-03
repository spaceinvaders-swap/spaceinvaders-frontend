import BigNumber from 'bignumber.js'
import { vaultPoolConfig } from 'config/constants/pools'
import { BIG_ZERO } from '@spaceinvaders-swap/utils/bigNumber'
import { getApy } from '@spaceinvaders-swap/utils/compoundApyHelpers'
import { getBalanceNumber, getFullDisplayBalance, getDecimalAmount } from '@spaceinvaders-swap/utils/formatBalance'
import memoize from 'lodash/memoize'
import { Token } from '@spaceinvaders-swap/sdk'
import { Pool } from '@spaceinvaders-swap/uikit'

// min deposit and withdraw amount
export const MIN_LOCK_AMOUNT = new BigNumber(10000000000000)

export const ENABLE_EXTEND_LOCK_AMOUNT = new BigNumber(100000000000000)

export const convertSharesToInva = (
  shares: BigNumber,
  invaPerFullShare: BigNumber,
  decimals = 18,
  decimalsToRound = 3,
  fee?: BigNumber,
) => {
  const sharePriceNumber = getBalanceNumber(invaPerFullShare, decimals)
  const amountInInva = new BigNumber(shares.multipliedBy(sharePriceNumber)).minus(fee || BIG_ZERO)
  const invaAsNumberBalance = getBalanceNumber(amountInInva, decimals)
  const invaAsBigNumber = getDecimalAmount(new BigNumber(invaAsNumberBalance), decimals)
  const invaAsDisplayBalance = getFullDisplayBalance(amountInInva, decimals, decimalsToRound)
  return { invaAsNumberBalance, invaAsBigNumber, invaAsDisplayBalance }
}

export const convertInvaToShares = (
  inva: BigNumber,
  invaPerFullShare: BigNumber,
  decimals = 18,
  decimalsToRound = 3,
) => {
  const sharePriceNumber = getBalanceNumber(invaPerFullShare, decimals)
  const amountInShares = new BigNumber(inva.dividedBy(sharePriceNumber))
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

export const getInvaVaultEarnings = (
  account: string,
  invaAtLastUserAction: BigNumber,
  userShares: BigNumber,
  pricePerFullShare: BigNumber,
  earningTokenPrice: number,
  fee?: BigNumber,
) => {
  const hasAutoEarnings = account && invaAtLastUserAction?.gt(0) && userShares?.gt(0)
  const { invaAsBigNumber } = convertSharesToInva(userShares, pricePerFullShare)
  const autoInvaProfit = invaAsBigNumber.minus(fee || BIG_ZERO).minus(invaAtLastUserAction)
  const autoInvaToDisplay = autoInvaProfit.gte(0) ? getBalanceNumber(autoInvaProfit, 18) : 0

  const autoUsdProfit = autoInvaProfit.times(earningTokenPrice)
  const autoUsdToDisplay = autoUsdProfit.gte(0) ? getBalanceNumber(autoUsdProfit, 18) : 0
  return { hasAutoEarnings, autoInvaToDisplay, autoUsdToDisplay }
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

export const getIInvaWeekDisplay = (ceiling: BigNumber) => {
  const weeks = new BigNumber(ceiling).div(60).div(60).div(24).div(7)
  return Math.round(weeks.toNumber())
}
