import { useBRotoProxyContract } from 'hooks/useContract'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCallback } from 'react'
import { useAppDispatch } from 'state'
import { useGasPrice } from 'state/user/hooks'
import { harvestFarm, stakeFarm, unstakeFarm } from 'utils/calls/farms'
import { fetchFarmUserDataAsync } from 'state/farms'
import { useBRotoProxyContractAddress } from 'views/Farms/hooks/useBRotoProxyContractAddress'
import { BOOSTED_FARM_GAS_LIMIT } from 'config'
import { useApproveBoostProxyFarm } from '../../../hooks/useApproveFarm'
import useProxyROTOBalance from './useProxyROTOBalance'

export default function useProxyStakedActions(pid, lpContract) {
  const { account, chainId } = useActiveWeb3React()
  const { proxyAddress } = useBRotoProxyContractAddress(account, chainId)
  const bRotoProxy = useBRotoProxyContract(proxyAddress)
  const dispatch = useAppDispatch()
  const gasPrice = useGasPrice()
  const { proxyRotoBalance, refreshProxyRotoBalance } = useProxyROTOBalance()

  const onDone = useCallback(() => {
    refreshProxyRotoBalance()
    dispatch(fetchFarmUserDataAsync({ account, pids: [pid], chainId, proxyAddress }))
  }, [account, proxyAddress, chainId, pid, dispatch, refreshProxyRotoBalance])

  const { onApprove } = useApproveBoostProxyFarm(lpContract, proxyAddress)

  const onStake = useCallback(
    (value) => stakeFarm(bRotoProxy, pid, value, gasPrice, BOOSTED_FARM_GAS_LIMIT),
    [bRotoProxy, pid, gasPrice],
  )

  const onUnstake = useCallback(
    (value) => unstakeFarm(bRotoProxy, pid, value, gasPrice, BOOSTED_FARM_GAS_LIMIT),
    [bRotoProxy, pid, gasPrice],
  )

  const onReward = useCallback(
    () => harvestFarm(bRotoProxy, pid, gasPrice, BOOSTED_FARM_GAS_LIMIT),
    [bRotoProxy, pid, gasPrice],
  )

  return {
    onStake,
    onUnstake,
    onReward,
    onApprove,
    onDone,
    proxyRotoBalance,
  }
}
