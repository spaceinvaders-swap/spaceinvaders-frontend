const SPACEINVADERS_APTOS = 'https://tokens.spaceinvaders-swap.finance/spaceinvaders-swap-aptos.json'

export const UNSUPPORTED_LIST_URLS: string[] = []

// default lists to be 'active' aka searched across
export const DEFAULT_ACTIVE_LIST_URLS: string[] = [SPACEINVADERS_APTOS]
export const WARNING_LIST_URLS: string[] = []

// lower index == higher priority for token import
export const DEFAULT_LIST_OF_LISTS: string[] = [
  SPACEINVADERS_APTOS,
  ...UNSUPPORTED_LIST_URLS, // need to load unsupported tokens as well
  ...WARNING_LIST_URLS,
]

export const OFFICIAL_LISTS: string[] = []
