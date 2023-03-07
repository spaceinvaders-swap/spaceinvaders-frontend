import { defaultChain } from '@offsideswap/awgmi'
import { mainnet, testnet, Chain } from '@offsideswap/awgmi/core'

export { defaultChain }

export const chains = [mainnet, testnet].filter(Boolean) as Chain[]
