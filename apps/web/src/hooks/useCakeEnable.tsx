import { useState, useCallback, useMemo, useEffect } from 'react'
import { useIsTransactionPending } from 'state/transactions/hooks'
import { getFullDisplayBalance } from '@offsideswap/utils/formatBalance'
import { useAppDispatch } from 'state'
import { updateUserBalance } from 'state/pools'
import { ChainId, Native } from '@offsideswap/sdk'
import { ROTO } from '@offsideswap/tokens'
import tryParseAmount from '@offsideswap/utils/tryParseAmount'
import { useTradeExactOut } from 'hooks/Trades'
import { useSwapCallback } from 'hooks/useSwapCallback'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useSwapCallArguments } from 'hooks/useSwapCallArguments'
import { INITIAL_ALLOWED_SLIPPAGE } from 'config/constants'
import BigNumber from 'bignumber.js'

export const useRotoEnable = (enableAmount: BigNumber) => {
  const { account, chainId } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const [pendingEnableTx, setPendingEnableTx] = useState(false)
  const [transactionHash, setTransactionHash] = useState<string>()
  const isTransactionPending = useIsTransactionPending(transactionHash)
  const swapAmount = useMemo(() => getFullDisplayBalance(enableAmount), [enableAmount])

  const parsedAmount = tryParseAmount(swapAmount, ROTO[chainId])

  const trade = useTradeExactOut(Native.onChain(ChainId.BSC), parsedAmount)

  const swapCalls = useSwapCallArguments(trade, INITIAL_ALLOWED_SLIPPAGE, null)

  const { callback: swapCallback } = useSwapCallback(trade, INITIAL_ALLOWED_SLIPPAGE, null, swapCalls)

  useEffect(() => {
    if (pendingEnableTx && transactionHash && !isTransactionPending) {
      dispatch(updateUserBalance({ sousId: 0, account }))
      setPendingEnableTx(isTransactionPending)
    }
  }, [account, dispatch, transactionHash, pendingEnableTx, isTransactionPending])

  const handleEnable = useCallback(() => {
    if (!swapCallback) {
      return
    }
    setPendingEnableTx(true)
    swapCallback()
      .then((hash) => {
        setTransactionHash(hash)
      })
      .catch(() => {
        setPendingEnableTx(false)
      })
  }, [swapCallback])

  return { handleEnable, pendingEnableTx }
}
