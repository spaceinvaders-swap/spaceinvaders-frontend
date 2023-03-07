import { useQueryClient } from '@offsideswap/awgmi'
import { Pool } from '@offsideswap/uikit'
import useHarvestFarm from 'components/Farms/hooks/useHarvestFarm'
import rotoPoolRelatedQueries from 'components/Pools/utils/rotoPoolRelatedQueries'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCallback } from 'react'
import CollectModalContainer from './CollectModalContainer'

const RotoCollectModal = ({ earningTokenAddress = '', ...rest }: React.PropsWithChildren<Pool.CollectModalProps>) => {
  const { onReward } = useHarvestFarm(earningTokenAddress)
  const queryClient = useQueryClient()
  const { account } = useActiveWeb3React()

  const onDone = useCallback(() => {
    queryClient.invalidateQueries({
      predicate: rotoPoolRelatedQueries(account),
    })
  }, [account, queryClient])

  return <CollectModalContainer {...rest} onDone={onDone} onReward={onReward} />
}

export default RotoCollectModal
