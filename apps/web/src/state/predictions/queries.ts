import {
  roundBaseFields as roundBaseFieldsBNB,
  betBaseFields as betBaseFieldsBNB,
  userBaseFields as userBaseFieldsBNB,
} from './bnbQueries'
import {
  roundBaseFields as roundBaseFieldsROTO,
  betBaseFields as betBaseFieldsROTO,
  userBaseFields as userBaseFieldsROTO,
} from './rotoQueries'

export const getRoundBaseFields = (tokenSymbol: string) =>
  tokenSymbol === 'ROTO' ? roundBaseFieldsROTO : roundBaseFieldsBNB

export const getBetBaseFields = (tokenSymbol: string) => (tokenSymbol === 'ROTO' ? betBaseFieldsROTO : betBaseFieldsBNB)

export const getUserBaseFields = (tokenSymbol: string) =>
  tokenSymbol === 'ROTO' ? userBaseFieldsROTO : userBaseFieldsBNB
