import { UserResponse, BetResponse, RoundResponse } from './responseType'

export interface UserResponseROTO extends UserResponse<BetResponseROTO> {
  totalROTO: string
  totalROTOBull: string
  totalROTOBear: string
  averageROTO: string
  totalROTOClaimed: string
  netROTO: string
}

export interface BetResponseROTO extends BetResponse {
  claimedROTO: string
  claimedNetROTO: string
  user?: UserResponseROTO
  round?: RoundResponseROTO
}

export type RoundResponseROTO = RoundResponse<BetResponseROTO>

/**
 * Base fields are the all the top-level fields available in the api. Used in multiple queries
 */
export const roundBaseFields = `
  id
  epoch
  position
  failed
  startAt
  startBlock
  startHash
  lockAt
  lockBlock
  lockHash
  lockPrice
  lockRoundId
  closeAt
  closeBlock
  closeHash
  closePrice
  closeRoundId
  totalBets
  totalAmount
  bullBets
  bullAmount
  bearBets
  bearAmount
`

export const betBaseFields = `
 id
 hash  
 amount
 position
 claimed
 claimedAt
 claimedHash
 claimedBlock
 claimedROTO
 claimedNetROTO
 createdAt
 updatedAt
`

export const userBaseFields = `
  id
  createdAt
  updatedAt
  block
  totalBets
  totalBetsBull
  totalBetsBear
  totalROTO
  totalROTOBull
  totalROTOBear
  totalBetsClaimed
  totalROTOClaimed
  winRate
  averageROTO
  netROTO
`
