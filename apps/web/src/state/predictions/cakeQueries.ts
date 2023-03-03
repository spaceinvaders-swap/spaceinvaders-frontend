import { UserResponse, BetResponse, RoundResponse } from './responseType'

export interface UserResponseINVA extends UserResponse<BetResponseINVA> {
  totalINVA: string
  totalINVABull: string
  totalINVABear: string
  averageINVA: string
  totalINVAClaimed: string
  netINVA: string
}

export interface BetResponseINVA extends BetResponse {
  claimedINVA: string
  claimedNetINVA: string
  user?: UserResponseINVA
  round?: RoundResponseINVA
}

export type RoundResponseINVA = RoundResponse<BetResponseINVA>

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
 claimedINVA
 claimedNetINVA
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
  totalINVA
  totalINVABull
  totalINVABear
  totalBetsClaimed
  totalINVAClaimed
  winRate
  averageINVA
  netINVA
`
