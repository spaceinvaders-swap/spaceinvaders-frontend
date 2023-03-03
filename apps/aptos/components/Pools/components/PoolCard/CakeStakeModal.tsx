import { Pool } from '@spaceinvaders-swap/uikit'
import { useCallback } from 'react'

import { Coin, ChainId } from '@spaceinvaders-swap/aptos-swap-sdk'
import useUnstakeFarms from 'components/Farms/hooks/useUnstakeFarms'
import useStakeFarms from 'components/Farms/hooks/useStakeFarms'
import { useQueryClient } from '@spaceinvaders-swap/awgmi'
import invaPoolRelatedQueries from 'components/Pools/utils/invaPoolRelatedQueries'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import StakeModalContainer from './StakeModalContainer'

const InvaStakeModal = ({ pool, ...rest }: Pool.StakeModalPropsType<Coin>) => {
  const { contractAddress } = pool
  const queryClient = useQueryClient()
  const { account, networkName } = useActiveWeb3React()

  const { onUnstake } = useUnstakeFarms(contractAddress[ChainId.TESTNET])
  const { onStake } = useStakeFarms(contractAddress[ChainId.TESTNET])

  const onDone = useCallback(() => {
    queryClient.invalidateQueries({
      predicate: invaPoolRelatedQueries(account),
    })
    queryClient.invalidateQueries({
      queryKey: [{ entity: 'accountResources', networkName, address: account }],
    })
  }, [account, networkName, queryClient])

  return <StakeModalContainer {...rest} onDone={onDone} onUnstake={onUnstake} onStake={onStake} pool={pool} />
}

export default InvaStakeModal
