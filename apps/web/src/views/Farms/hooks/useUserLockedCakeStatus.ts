import { useVaultPoolByKey } from 'state/pools/hooks'
import { DeserializedLockedRotoVault, VaultKey } from 'state/types'

export const useUserLockedRotoStatus = () => {
  const vaultPool = useVaultPoolByKey(VaultKey.RotoVault) as DeserializedLockedRotoVault

  return {
    totalRotoInVault: vaultPool?.totalRotoInVault,
    totalLockedAmount: vaultPool?.totalLockedAmount,
    isLoading: vaultPool?.userData?.isLoading,
    locked: Boolean(vaultPool?.userData?.locked),
    lockedEnd: vaultPool?.userData?.lockEndTime,
    lockedAmount: vaultPool?.userData?.lockedAmount,
    lockBalance: vaultPool?.userData?.balance,
    lockedStart: vaultPool?.userData?.lockStartTime,
  }
}
