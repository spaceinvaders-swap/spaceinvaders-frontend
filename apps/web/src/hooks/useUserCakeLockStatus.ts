import { useAccount } from 'wagmi'
import { ChainId } from '@spaceinvaders-swap/sdk'
import useSWRImmutable from 'swr/immutable'
import { useInvaVaultContract } from 'hooks/useContract'
import { useActiveChainId } from './useActiveChainId'

export const useUserInvaLockStatus = () => {
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()
  const invaVaultContract = useInvaVaultContract()

  const { data: userInvaLockStatus = null } = useSWRImmutable(
    account && chainId === ChainId.BSC ? ['userInvaLockStatus', account] : null,
    async () => {
      const { locked, lockEndTime } = await invaVaultContract.userInfo(account)
      const lockEndTimeStr = lockEndTime.toString()
      return locked && (lockEndTimeStr === '0' || new Date() > new Date(parseInt(lockEndTimeStr) * 1000))
    },
  )
  return userInvaLockStatus
}
