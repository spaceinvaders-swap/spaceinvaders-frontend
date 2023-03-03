import { Currency } from '@spaceinvaders-swap/aptos-swap-sdk'
import { APTOS_COIN } from '@spaceinvaders-swap/awgmi'

export default function currencyId(currency: Currency): string {
  if (currency?.isNative) return APTOS_COIN
  if (currency?.isToken) return currency.address
  throw new Error('invalid currency')
}
