import { useVaultPoolByKey } from 'state/pools/hooks'
import { DeserializedLockedInvaVault, VaultKey } from 'state/types'

export const useUserLockedInvaStatus = () => {
  const vaultPool = useVaultPoolByKey(VaultKey.InvaVault) as DeserializedLockedInvaVault

  return {
    totalInvaInVault: vaultPool?.totalInvaInVault,
    totalLockedAmount: vaultPool?.totalLockedAmount,
    isLoading: vaultPool?.userData?.isLoading,
    locked: Boolean(vaultPool?.userData?.locked),
    lockedEnd: vaultPool?.userData?.lockEndTime,
    lockedAmount: vaultPool?.userData?.lockedAmount,
    lockBalance: vaultPool?.userData?.balance,
    lockedStart: vaultPool?.userData?.lockStartTime,
  }
}
