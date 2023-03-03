import addresses from 'config/constants/contracts'

import { GRAPH_API_PREDICTION_INVA, GRAPH_API_PREDICTION_BNB } from 'config/constants/endpoints'
import { getAddress } from 'utils/addressHelpers'
import { bscTokens } from '@spaceinvaders-swap/tokens'

export default {
  BNB: {
    address: getAddress(addresses.predictionsBNB),
    api: GRAPH_API_PREDICTION_BNB,
    chainlinkOracleAddress: getAddress(addresses.chainlinkOracleBNB),
    displayedDecimals: 4,
    token: bscTokens.bnb,
  },
  INVA: {
    address: getAddress(addresses.predictionsINVA),
    api: GRAPH_API_PREDICTION_INVA,
    chainlinkOracleAddress: getAddress(addresses.chainlinkOracleINVA),
    displayedDecimals: 4,
    token: bscTokens.inva,
  },
}
