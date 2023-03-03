export const SPACEINVADERS_EXTENDED = 'https://tokens.spaceinvaders-swap.finance/spaceinvaders-swap-extended.json'
export const COINGECKO = 'https://tokens.spaceinvaders-swap.finance/coingecko.json'
export const SPACEINVADERS_ETH_DEFAULT = 'https://tokens.spaceinvaders-swap.finance/spaceinvaders-swap-eth-default.json'
export const SPACEINVADERS_ETH_MM = 'https://tokens.spaceinvaders-swap.finance/spaceinvaders-swap-eth-mm.json'
export const SPACEINVADERS_BSC_MM = 'https://tokens.spaceinvaders-swap.finance/spaceinvaders-swap-bnb-mm.json'
export const COINGECKO_ETH = 'https://tokens.coingecko.com/uniswap/all.json'
export const CMC = 'https://tokens.spaceinvaders-swap.finance/cmc.json'

export const ETH_URLS = [SPACEINVADERS_ETH_DEFAULT, SPACEINVADERS_ETH_MM, COINGECKO_ETH]
export const BSC_URLS = [SPACEINVADERS_EXTENDED, CMC, COINGECKO, SPACEINVADERS_BSC_MM]

// List of official tokens list
export const OFFICIAL_LISTS = [SPACEINVADERS_EXTENDED, SPACEINVADERS_ETH_DEFAULT, SPACEINVADERS_ETH_MM]

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
export const DEFAULT_ACTIVE_LIST_URLS: string[] = [SPACEINVADERS_EXTENDED, SPACEINVADERS_ETH_DEFAULT, SPACEINVADERS_ETH_MM]
