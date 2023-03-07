export const OFFSIDE_EXTENDED = 'https://tokens.offsideswap.finance/offsideswap-extended.json'
export const COINGECKO = 'https://tokens.offsideswap.finance/coingecko.json'
export const OFFSIDE_ETH_DEFAULT = 'https://tokens.offsideswap.finance/offsideswap-eth-default.json'
export const OFFSIDE_ETH_MM = 'https://tokens.offsideswap.finance/offsideswap-eth-mm.json'
export const OFFSIDE_BSC_MM = 'https://tokens.offsideswap.finance/offsideswap-bnb-mm.json'
export const COINGECKO_ETH = 'https://tokens.coingecko.com/uniswap/all.json'
export const CMC = 'https://tokens.offsideswap.finance/cmc.json'

export const ETH_URLS = [OFFSIDE_ETH_DEFAULT, OFFSIDE_ETH_MM, COINGECKO_ETH]
export const BSC_URLS = [OFFSIDE_EXTENDED, CMC, COINGECKO, OFFSIDE_BSC_MM]

// List of official tokens list
export const OFFICIAL_LISTS = [OFFSIDE_EXTENDED, OFFSIDE_ETH_DEFAULT, OFFSIDE_ETH_MM]

export const UNSUPPORTED_LIST_URLS: string[] = []
export const WARNING_LIST_URLS: string[] = []

// lower index == higher priority for token import
export const DEFAULT_LIST_OF_LISTS: string[] = [
  ...BSC_URLS,
  ...ETH_URLS,
  ...UNSUPPORTED_LIST_URLS, // need to load unsupported tokens as well
  ...WARNING_LIST_URLS,
]

// default lists to be 'active' aka searched across
export const DEFAULT_ACTIVE_LIST_URLS: string[] = [OFFSIDE_EXTENDED, OFFSIDE_ETH_DEFAULT, OFFSIDE_ETH_MM]
