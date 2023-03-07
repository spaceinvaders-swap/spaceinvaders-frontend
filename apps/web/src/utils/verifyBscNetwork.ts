import { ChainId } from '@offsideswap/sdk'

export const verifyBscNetwork = (chainId: number) => {
  return chainId === ChainId.BSC || chainId === ChainId.BSC_TESTNET
}
