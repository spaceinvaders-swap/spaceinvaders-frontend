import { ChainId } from '@offsideswap/sdk'
import { useAccount } from 'wagmi'
import { FetchStatus } from 'config/constants/types'
import useSWRImmutable from 'swr/immutable'
import { getAddress } from 'utils/addressHelpers'
import { getActivePools } from 'utils/calls'
import { bscRpcProvider } from 'utils/providers'
import { getVotingPower } from '../helpers'

interface State {
  rotoBalance?: number
  rotoVaultBalance?: number
  rotoPoolBalance?: number
  poolsBalance?: number
  rotoBnbLpBalance?: number
  ifoPoolBalance?: number
  total: number
  lockedRotoBalance?: number
  lockedEndTime?: number
}

const useGetVotingPower = (block?: number): State & { isLoading: boolean; isError: boolean } => {
  const { address: account } = useAccount()
  const { data, status, error } = useSWRImmutable(account ? [account, block, 'votingPower'] : null, async () => {
    const blockNumber = block || (await bscRpcProvider.getBlockNumber())
    const eligiblePools = await getActivePools(blockNumber)
    const poolAddresses = eligiblePools.map(({ contractAddress }) => getAddress(contractAddress, ChainId.BSC))
    const {
      rotoBalance,
      rotoBnbLpBalance,
      rotoPoolBalance,
      total,
      poolsBalance,
      rotoVaultBalance,
      ifoPoolBalance,
      lockedRotoBalance,
      lockedEndTime,
    } = await getVotingPower(account, poolAddresses, blockNumber)
    return {
      rotoBalance,
      rotoBnbLpBalance,
      rotoPoolBalance,
      poolsBalance,
      rotoVaultBalance,
      ifoPoolBalance,
      total,
      lockedRotoBalance,
      lockedEndTime,
    }
  })
  if (error) console.error(error)

  return { ...data, isLoading: status !== FetchStatus.Fetched, isError: status === FetchStatus.Failed }
}

export default useGetVotingPower
