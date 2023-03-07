import { ContextApi } from '@offsideswap/localization'
import BigNumber from 'bignumber.js'

export const getEarningsText = (
  numFarmsToCollect: number,
  hasRotoPoolToCollect: boolean,
  earningsBusd: BigNumber,
  t: ContextApi['t'],
): string => {
  const data = {
    earningsBusd: earningsBusd.toString(),
    count: numFarmsToCollect,
  }

  let earningsText = t('%earningsBusd% to collect', data)

  if (numFarmsToCollect > 0 && hasRotoPoolToCollect) {
    if (numFarmsToCollect > 1) {
      earningsText = t('%earningsBusd% to collect from %count% farms and ROTO pool', data)
    } else {
      earningsText = t('%earningsBusd% to collect from %count% farm and ROTO pool', data)
    }
  } else if (numFarmsToCollect > 0) {
    if (numFarmsToCollect > 1) {
      earningsText = t('%earningsBusd% to collect from %count% farms', data)
    } else {
      earningsText = t('%earningsBusd% to collect from %count% farm', data)
    }
  } else if (hasRotoPoolToCollect) {
    earningsText = t('%earningsBusd% to collect from ROTO pool', data)
  }

  return earningsText
}
