import { ChainId } from '@spaceinvaders-swap/sdk'
import { useActiveIfoWithBlocks } from 'hooks/useActiveIfoWithBlocks'
import { useUserInvaLockStatus } from 'hooks/useUserInvaLockStatus'
import { useMemo } from 'react'
import { useChainCurrentBlock } from 'state/block/hooks'
import { PotteryDepositStatus } from 'state/types'
import { getStatus } from 'views/Ifos/hooks/helpers'
import { useCompetitionStatus } from './useCompetitionStatus'
import { usePotteryStatus } from './usePotteryStatus'
import { useVotingStatus } from './useVotingStatus'

export const useMenuItemsStatus = (): Record<string, string> => {
  const currentBlock = useChainCurrentBlock(ChainId.BSC)
  const activeIfo = useActiveIfoWithBlocks()
  const competitionStatus = useCompetitionStatus()
  const potteryStatus = usePotteryStatus()
  const votingStatus = useVotingStatus()
  const isUserLocked = useUserInvaLockStatus()

  const ifoStatus =
    currentBlock && activeIfo && activeIfo.endBlock > currentBlock
      ? getStatus(currentBlock, activeIfo.startBlock, activeIfo.endBlock)
      : null

  return useMemo(() => {
    return {
      '/competition': competitionStatus,
      '/ifo': ifoStatus === 'coming_soon' ? 'soon' : ifoStatus,
      ...(potteryStatus === PotteryDepositStatus.BEFORE_LOCK && {
        '/pottery': 'pot_open',
      }),
      ...(votingStatus && {
        '/voting': votingStatus,
      }),
      ...(isUserLocked && {
        '/pools': 'lock_end',
      }),
    }
  }, [competitionStatus, ifoStatus, potteryStatus, votingStatus, isUserLocked])
}
