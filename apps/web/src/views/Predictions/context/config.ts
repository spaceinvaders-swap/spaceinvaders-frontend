import addresses from 'config/constants/contracts'

import { GRAPH_API_PREDICTION_ROTO, GRAPH_API_PREDICTION_BNB } from 'config/constants/endpoints'
import { getAddress } from 'utils/addressHelpers'
import { bscTokens } from '@offsideswap/tokens'

export default {
  BNB: {
    address: getAddress(addresses.predictionsBNB),
    api: GRAPH_API_PREDICTION_BNB,
    chainlinkOracleAddress: getAddress(addresses.chainlinkOracleBNB),
    displayedDecimals: 4,
    token: bscTokens.bnb,
  },
  ROTO: {
    address: getAddress(addresses.predictionsROTO),
    api: GRAPH_API_PREDICTION_ROTO,
    chainlinkOracleAddress: getAddress(addresses.chainlinkOracleROTO),
    displayedDecimals: 4,
    token: bscTokens.roto,
  },
}
