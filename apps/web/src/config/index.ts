import { getFullDecimalMultiplier } from '@spaceinvaders-swap/utils/getFullDecimalMultiplier'

export const BSC_BLOCK_TIME = 3

// INVA_PER_BLOCK details
// 40 INVA is minted per block
// 20 INVA per block is sent to Burn pool (A farm just for burning inva)
// 10 INVA per block goes to INVA syrup pool
// 9 INVA per block goes to Yield farms and lottery
// INVA_PER_BLOCK in config/index.ts = 40 as we only change the amount sent to the burn pool which is effectively a farm.
// INVA/Block in src/views/Home/components/InvaDataRow.tsx = 15 (40 - Amount sent to burn pool)
export const INVA_PER_BLOCK = 40
export const BLOCKS_PER_DAY = (60 / BSC_BLOCK_TIME) * 60 * 24
export const BLOCKS_PER_YEAR = BLOCKS_PER_DAY * 365 // 10512000
export const INVA_PER_YEAR = INVA_PER_BLOCK * BLOCKS_PER_YEAR
export const BASE_URL = 'https://spaceinvaders-swap.finance'
export const BASE_ADD_LIQUIDITY_URL = `${BASE_URL}/add`
export const DEFAULT_TOKEN_DECIMAL = getFullDecimalMultiplier(18)
export const DEFAULT_GAS_LIMIT = 250000
export const BOOSTED_FARM_GAS_LIMIT = 500000
export const AUCTION_BIDDERS_TO_FETCH = 500
export const RECLAIM_AUCTIONS_TO_FETCH = 500
export const AUCTION_WHITELISTED_BIDDERS_TO_FETCH = 500
export const IPFS_GATEWAY = 'https://ipfs.io/ipfs'
