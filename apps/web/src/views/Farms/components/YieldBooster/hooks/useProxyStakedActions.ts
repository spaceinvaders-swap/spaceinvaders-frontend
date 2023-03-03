import { useBInvaProxyContract } from 'hooks/useContract'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCallback } from 'react'
import { useAppDispatch } from 'state'
import { useGasPrice } from 'state/user/hooks'
import { harvestFarm, stakeFarm, unstakeFarm } from 'utils/calls/farms'
import { fetchFarmUserDataAsync } from 'state/farms'
import { useBInvaProxyContractAddress } from 'views/Farms/hooks/useBInvaProxyContractAddress'
import { BOOSTED_FARM_GAS_LIMIT } from 'config'
import { useApproveBoostProxyFarm } from '../../../hooks/useApproveFarm'
import useProxyINVABalance from './useProxyINVABalance'

export default function useProxyStakedActions(pid, lpContract) {
  const { account, chainId } = useActiveWeb3React()
  const { proxyAddress } = useBInvaProxyContractAddress(account, chainId)
  const bInvaProxy = useBInvaProxyContract(proxyAddress)
  const dispatch = useAppDispatch()
  const gasPrice = useGasPrice()
  const { proxyInvaBalance, refreshProxyInvaBalance } = useProxyINVABalance()

  const onDone = useCallback(() => {
    refreshProxyInvaBalance()
    dispatch(fetchFarmUserDataAsync({ account, pids: [pid], chainId, proxyAddress }))
  }, [account, proxyAddress, chainId, pid, dispatch, refreshProxyInvaBalance])

  const { onApprove } = useApproveBoostProxyFarm(lpContract, proxyAddress)

  const onStake = useCallback(
    (value) => stakeFarm(bInvaProxy, pid, value, gasPrice, BOOSTED_FARM_GAS_LIMIT),
    [bInvaProxy, pid, gasPrice],
  )

  const onUnstake = useCallback(
    (value) => unstakeFarm(bInvaProxy, pid, value, gasPrice, BOOSTED_FARM_GAS_LIMIT),
    [bInvaProxy, pid, gasPrice],
  )

  const onReward = useCallback(
    () => harvestFarm(bInvaProxy, pid, gasPrice, BOOSTED_FARM_GAS_LIMIT),
    [bInvaProxy, pid, gasPrice],
  )

  return {
    onStake,
    onUnstake,
    onReward,
    onApprove,
    onDone,
    proxyInvaBalance,
  }
}
