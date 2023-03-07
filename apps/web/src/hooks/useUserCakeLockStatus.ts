import { useAccount } from 'wagmi'
import { ChainId } from '@offsideswap/sdk'
import useSWRImmutable from 'swr/immutable'
import { useRotoVaultContract } from 'hooks/useContract'
import { useActiveChainId } from './useActiveChainId'

export const useUserRotoLockStatus = () => {
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()
  const rotoVaultContract = useRotoVaultContract()

  const { data: userRotoLockStatus = null } = useSWRImmutable(
    account && chainId === ChainId.BSC ? ['userRotoLockStatus', account] : null,
    async () => {
      const { locked, lockEndTime } = await rotoVaultContract.userInfo(account)
      const lockEndTimeStr = lockEndTime.toString()
      return locked && (lockEndTimeStr === '0' || new Date() > new Date(parseInt(lockEndTimeStr) * 1000))
    },
  )
  return userRotoLockStatus
}
