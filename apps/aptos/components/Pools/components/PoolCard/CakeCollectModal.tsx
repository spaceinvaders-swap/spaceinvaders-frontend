import { useQueryClient } from '@spaceinvaders-swap/awgmi'
import { Pool } from '@spaceinvaders-swap/uikit'
import useHarvestFarm from 'components/Farms/hooks/useHarvestFarm'
import invaPoolRelatedQueries from 'components/Pools/utils/invaPoolRelatedQueries'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCallback } from 'react'
import CollectModalContainer from './CollectModalContainer'

const InvaCollectModal = ({ earningTokenAddress = '', ...rest }: React.PropsWithChildren<Pool.CollectModalProps>) => {
  const { onReward } = useHarvestFarm(earningTokenAddress)
  const queryClient = useQueryClient()
  const { account } = useActiveWeb3React()

  const onDone = useCallback(() => {
    queryClient.invalidateQueries({
      predicate: invaPoolRelatedQueries(account),
    })
  }, [account, queryClient])

  return <CollectModalContainer {...rest} onDone={onDone} onReward={onReward} />
}

export default InvaCollectModal
