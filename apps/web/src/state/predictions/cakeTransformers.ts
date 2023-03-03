import { Bet, PredictionUser } from 'state/types'
import { transformRoundResponseToken, transformUserResponseToken, transformBetResponseToken } from './tokenTransformers'

export const transformBetResponseINVA = (betResponse): Bet => {
  const baseBet = transformBetResponseToken(betResponse)
  const bet = {
    ...baseBet,
    claimedBNB: betResponse.claimedINVA ? parseFloat(betResponse.claimedINVA) : 0,
    claimedNetBNB: betResponse.claimedNetINVA ? parseFloat(betResponse.claimedNetINVA) : 0,
  } as Bet

  if (betResponse.user) {
    bet.user = transformUserResponseINVA(betResponse.user)
  }

  if (betResponse.round) {
    bet.round = transformRoundResponseToken(betResponse.round, transformBetResponseINVA)
  }

  return bet
}

export const transformUserResponseINVA = (userResponse): PredictionUser => {
  const baseUserResponse = transformUserResponseToken(userResponse)
  const { totalINVA, totalINVABull, totalINVABear, totalINVAClaimed, averageINVA, netINVA } = userResponse || {}

  return {
    ...baseUserResponse,
    totalBNB: totalINVA ? parseFloat(totalINVA) : 0,
    totalBNBBull: totalINVABull ? parseFloat(totalINVABull) : 0,
    totalBNBBear: totalINVABear ? parseFloat(totalINVABear) : 0,
    totalBNBClaimed: totalINVAClaimed ? parseFloat(totalINVAClaimed) : 0,
    averageBNB: averageINVA ? parseFloat(averageINVA) : 0,
    netBNB: netINVA ? parseFloat(netINVA) : 0,
  }
}
