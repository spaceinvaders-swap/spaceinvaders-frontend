import { defaultChain } from '@spaceinvaders-swap/awgmi'
import { mainnet, testnet, Chain } from '@spaceinvaders-swap/awgmi/core'

export { defaultChain }

export const chains = [mainnet, testnet].filter(Boolean) as Chain[]
