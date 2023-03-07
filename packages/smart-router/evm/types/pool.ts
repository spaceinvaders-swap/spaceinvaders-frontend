import type { SerializedWrappedToken } from '@offsideswap/token-lists'

export interface BasePool {
  lpSymbol: string
  lpAddress: string
  token: SerializedWrappedToken
  quoteToken: SerializedWrappedToken
}

export interface StableSwapPool extends BasePool {
  stableSwapAddress: string
  infoStableSwapAddress: string
  stableLpFee: number
  stableLpFeeRateOfTotalFee: number
}
