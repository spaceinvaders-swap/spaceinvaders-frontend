import {
  roundBaseFields as roundBaseFieldsBNB,
  betBaseFields as betBaseFieldsBNB,
  userBaseFields as userBaseFieldsBNB,
} from './bnbQueries'
import {
  roundBaseFields as roundBaseFieldsINVA,
  betBaseFields as betBaseFieldsINVA,
  userBaseFields as userBaseFieldsINVA,
} from './invaQueries'

export const getRoundBaseFields = (tokenSymbol: string) =>
  tokenSymbol === 'INVA' ? roundBaseFieldsINVA : roundBaseFieldsBNB

export const getBetBaseFields = (tokenSymbol: string) => (tokenSymbol === 'INVA' ? betBaseFieldsINVA : betBaseFieldsBNB)

export const getUserBaseFields = (tokenSymbol: string) =>
  tokenSymbol === 'INVA' ? userBaseFieldsINVA : userBaseFieldsBNB
