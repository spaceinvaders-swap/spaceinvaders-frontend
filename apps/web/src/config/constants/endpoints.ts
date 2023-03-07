import { ChainId } from '@offsideswap/sdk'

export const GRAPH_API_PROFILE = 'https://api.thegraph.com/subgraphs/name/offsideswap/profile'
export const GRAPH_API_PREDICTION_BNB = 'https://api.thegraph.com/subgraphs/name/offsideswap/prediction-v2'
export const GRAPH_API_PREDICTION_ROTO = 'https://api.thegraph.com/subgraphs/name/offsideswap/prediction-roto'

export const GRAPH_API_LOTTERY = 'https://api.thegraph.com/subgraphs/name/offsideswap/lottery'
export const SNAPSHOT_BASE_URL = process.env.NEXT_PUBLIC_SNAPSHOT_BASE_URL
export const API_PROFILE = 'https://profile.offsideswap.com'
export const API_NFT = 'https://nft.offsideswap.com/api/v1'
export const SNAPSHOT_API = `${SNAPSHOT_BASE_URL}/graphql`
export const SNAPSHOT_HUB_API = `${SNAPSHOT_BASE_URL}/api/message`
export const GRAPH_API_POTTERY = 'https://api.thegraph.com/subgraphs/name/offsideswap/pottery'

/**
 * V1 will be deprecated but is still used to claim old rounds
 */
export const GRAPH_API_PREDICTION_V1 = 'https://api.thegraph.com/subgraphs/name/offsideswap/prediction'

export const INFO_CLIENT = 'https://proxy-worker.offside-swap.workers.dev/bsc-exchange'

export const INFO_CLIENT_ETH = 'https://api.thegraph.com/subgraphs/name/offsideswap/exhange-eth'
export const BLOCKS_CLIENT = 'https://api.thegraph.com/subgraphs/name/offsideswap/blocks'
export const BLOCKS_CLIENT_ETH = 'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks'
export const STABLESWAP_SUBGRAPH_CLIENT = 'https://api.thegraph.com/subgraphs/name/offsideswap/exchange-stableswap'
export const GRAPH_API_NFTMARKET = 'https://api.thegraph.com/subgraphs/name/offsideswap/nft-market'
export const GRAPH_HEALTH = 'https://api.thegraph.com/index-node/graphql'

export const TC_MOBOX_SUBGRAPH = 'https://api.thegraph.com/subgraphs/name/offsideswap/trading-competition-v3'
export const TC_MOD_SUBGRAPH = 'https://api.thegraph.com/subgraphs/name/offsideswap/trading-competition-v4'

export const FARM_API = 'https://farms-api.offsideswap.com'

export const BIT_QUERY = 'https://graphql.bitquery.io'

export const ACCESS_RISK_API = '/api/risk'

export const CELER_API = 'https://api.celerscan.com/scan'

export const INFO_CLIENT_WITH_CHAIN = {
  [ChainId.BSC]: INFO_CLIENT,
  [ChainId.ETHEREUM]: INFO_CLIENT_ETH,
}

export const BLOCKS_CLIENT_WITH_CHAIN = {
  [ChainId.BSC]: BLOCKS_CLIENT,
  [ChainId.ETHEREUM]: BLOCKS_CLIENT_ETH,
}

export const ASSET_CDN = 'https://assets.offsideswap.finance'
