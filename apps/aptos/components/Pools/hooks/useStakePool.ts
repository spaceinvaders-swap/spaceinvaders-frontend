import { SmartChef } from 'contracts/smartchef'
import { getFullDecimalMultiplier } from '@spaceinvaders-swap/utils/getFullDecimalMultiplier'
import BigNumber from 'bignumber.js'
import useSimulationAndSendTransaction from 'hooks/useSimulationAndSendTransaction'
import { useCallback } from 'react'

export default function useStakePool({ stakingTokenAddress, earningTokenAddress, uid, stakingTokenDecimals }) {
  const executeTransaction = useSimulationAndSendTransaction()

  return useCallback(
    (amount) => {
      const stakeAmount = new BigNumber(amount).times(getFullDecimalMultiplier(stakingTokenDecimals)).toString()

      const payload = SmartChef.deposit({
        amount: stakeAmount,
        uid,
        stakeTokenAddress: stakingTokenAddress,
        rewardTokenAddress: earningTokenAddress,
      })

      return executeTransaction(payload)
    },
    [earningTokenAddress, executeTransaction, stakingTokenAddress, stakingTokenDecimals, uid],
  )
}
