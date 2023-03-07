import { Bet, PredictionUser } from 'state/types'
import { transformRoundResponseToken, transformUserResponseToken, transformBetResponseToken } from './tokenTransformers'

export const transformBetResponseROTO = (betResponse): Bet => {
  const baseBet = transformBetResponseToken(betResponse)
  const bet = {
    ...baseBet,
    claimedBNB: betResponse.claimedROTO ? parseFloat(betResponse.claimedROTO) : 0,
    claimedNetBNB: betResponse.claimedNetROTO ? parseFloat(betResponse.claimedNetROTO) : 0,
  } as Bet

  if (betResponse.user) {
    bet.user = transformUserResponseROTO(betResponse.user)
  }

  if (betResponse.round) {
    bet.round = transformRoundResponseToken(betResponse.round, transformBetResponseROTO)
  }

  return bet
}

export const transformUserResponseROTO = (userResponse): PredictionUser => {
  const baseUserResponse = transformUserResponseToken(userResponse)
  const { totalROTO, totalROTOBull, totalROTOBear, totalROTOClaimed, averageROTO, netROTO } = userResponse || {}

  return {
    ...baseUserResponse,
    totalBNB: totalROTO ? parseFloat(totalROTO) : 0,
    totalBNBBull: totalROTOBull ? parseFloat(totalROTOBull) : 0,
    totalBNBBear: totalROTOBear ? parseFloat(totalROTOBear) : 0,
    totalBNBClaimed: totalROTOClaimed ? parseFloat(totalROTOClaimed) : 0,
    averageBNB: averageROTO ? parseFloat(averageROTO) : 0,
    netBNB: netROTO ? parseFloat(netROTO) : 0,
  }
}
