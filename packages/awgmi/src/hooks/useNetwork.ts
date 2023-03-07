import { getNetwork, watchNetwork } from '@offsideswap/awgmi/core'
import { useSyncExternalStoreWithTracked } from './useSyncExternalStoreWithTracked'

export function useNetwork() {
  return useSyncExternalStoreWithTracked(watchNetwork, getNetwork)
}
