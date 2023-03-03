import { ContextApi } from '@spaceinvaders-swap/localization'
import BigNumber from 'bignumber.js'

export const getEarningsText = (
  numFarmsToCollect: number,
  hasInvaPoolToCollect: boolean,
  earningsBusd: BigNumber,
  t: ContextApi['t'],
): string => {
  const data = {
    earningsBusd: earningsBusd.toString(),
    count: numFarmsToCollect,
  }

  let earningsText = t('%earningsBusd% to collect', data)

  if (numFarmsToCollect > 0 && hasInvaPoolToCollect) {
    if (numFarmsToCollect > 1) {
      earningsText = t('%earningsBusd% to collect from %count% farms and INVA pool', data)
    } else {
      earningsText = t('%earningsBusd% to collect from %count% farm and INVA pool', data)
    }
  } else if (numFarmsToCollect > 0) {
    if (numFarmsToCollect > 1) {
      earningsText = t('%earningsBusd% to collect from %count% farms', data)
    } else {
      earningsText = t('%earningsBusd% to collect from %count% farm', data)
    }
  } else if (hasInvaPoolToCollect) {
    earningsText = t('%earningsBusd% to collect from INVA pool', data)
  }

  return earningsText
}
