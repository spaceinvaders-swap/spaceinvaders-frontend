import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useFarmUser } from 'state/farms/hooks'
import { useBInvaFarmBoosterContract } from 'hooks/useContract'
import { useSWRMulticall } from 'hooks/useSWRContract'
import farmBoosterAbi from 'config/abi/farmBooster.json'
import isUndefinedOrNull from '@spaceinvaders-swap/utils/isUndefinedOrNull'
import { useUserBoosterStatus } from 'views/Farms/hooks/useUserBoosterStatus'
import { useBInvaProxyContractAddress } from 'views/Farms/hooks/useBInvaProxyContractAddress'
import { useUserLockedInvaStatus } from 'views/Farms/hooks/useUserLockedInvaStatus'
import { useCallback } from 'react'
import { useAccount } from 'wagmi'

export enum YieldBoosterState {
  UNCONNECTED,
  NO_LOCKED,
  LOCKED_END,
  NO_PROXY_CREATED,
  NO_MIGRATE,
  NO_LP,
  DEACTIVE,
  ACTIVE,
  ACTIVE_AND_NO_LP,
  MAX,
}

function useIsPoolActive(pid: number) {
  const farmBoosterContract = useBInvaFarmBoosterContract()
  const { address: account } = useAccount()

  const { data, mutate } = useSWRMulticall(
    farmBoosterAbi,
    [{ address: farmBoosterContract.address, name: 'isBoostedPool', params: [account, pid] }],
    { isPaused: () => !account },
  )

  return {
    isActivePool: Array.isArray(data) ? data[0][0] : false,
    refreshIsPoolActive: mutate,
  }
}

interface UseYieldBoosterStateArgs {
  farmPid: number
}

export default function useYieldBoosterState(yieldBoosterStateArgs: UseYieldBoosterStateArgs) {
  const { farmPid } = yieldBoosterStateArgs
  const { account, chainId } = useActiveWeb3React()
  const { remainingCounts, refreshActivePools } = useUserBoosterStatus(account)
  const { locked, lockedEnd } = useUserLockedInvaStatus()
  const { stakedBalance, proxy } = useFarmUser(farmPid)
  const { isActivePool, refreshIsPoolActive } = useIsPoolActive(farmPid)
  const { proxyCreated, refreshProxyAddress, proxyAddress } = useBInvaProxyContractAddress(account, chainId)

  const refreshActivePool = useCallback(() => {
    refreshActivePools()
    refreshIsPoolActive()
  }, [refreshActivePools, refreshIsPoolActive])

  let state = null

  if (!account || isUndefinedOrNull(locked)) {
    state = YieldBoosterState.UNCONNECTED
  } else if (!locked && stakedBalance.eq(0)) {
    // NOTE: depend on useInvaVaultUserData in Farm Component to check state
    state = YieldBoosterState.NO_LOCKED
  } else if (!proxyCreated) {
    state = YieldBoosterState.NO_PROXY_CREATED
  } else if (stakedBalance.gt(0)) {
    state = YieldBoosterState.NO_MIGRATE
  } else if (lockedEnd === '0' || new Date() > new Date(parseInt(lockedEnd) * 1000)) {
    // NOTE: duplicate logic in BInvaBoosterCard
    state = YieldBoosterState.LOCKED_END
  } else if (!isActivePool && proxy?.stakedBalance.eq(0)) {
    state = YieldBoosterState.NO_LP
  } else if (!isActivePool && remainingCounts === 0) {
    state = YieldBoosterState.MAX
  } else if (isActivePool && proxy?.stakedBalance.eq(0)) {
    state = YieldBoosterState.ACTIVE_AND_NO_LP
  } else if (isActivePool) {
    state = YieldBoosterState.ACTIVE
  } else {
    state = YieldBoosterState.DEACTIVE
  }

  return {
    state,
    shouldUseProxyFarm: proxyCreated && stakedBalance.eq(0),
    refreshActivePool,
    refreshProxyAddress,
    proxyAddress,
  }
}
