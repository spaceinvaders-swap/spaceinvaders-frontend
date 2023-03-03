import { useTranslation } from '@spaceinvaders-swap/localization'
import { Button, ButtonProps, useToast } from '@spaceinvaders-swap/uikit'
import { memo, useCallback } from 'react'

import { useAccount } from 'wagmi'
import { ToastDescriptionWithTx } from 'components/Toast'
import { vaultPoolConfig } from 'config/constants/pools'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useCatchTxError from 'hooks/useCatchTxError'
import { useVaultPoolContract } from 'hooks/useContract'
import { useAppDispatch } from 'state'
import { fetchInvaVaultUserData } from 'state/pools'
import { VaultKey } from 'state/types'
import { useSWRConfig } from 'swr'

const ConvertToFlexibleButton: React.FC<React.PropsWithChildren<ButtonProps>> = (props) => {
  const dispatch = useAppDispatch()

  const { address: account } = useAccount()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const vaultPoolContract = useVaultPoolContract(VaultKey.InvaVault)
  const { callWithGasPrice } = useCallWithGasPrice()
  const { t } = useTranslation()
  const { mutate } = useSWRConfig()
  const { toastSuccess } = useToast()

  const handleUnlock = useCallback(async () => {
    const callOptions = {
      gasLimit: vaultPoolConfig[VaultKey.InvaVault].gasLimit,
    }

    const receipt = await fetchWithCatchTxError(() => {
      const methodArgs = [account]
      return callWithGasPrice(vaultPoolContract, 'unlock', methodArgs, callOptions)
    })

    if (receipt?.status) {
      toastSuccess(
        t('Staked!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your funds have been staked in the pool')}
        </ToastDescriptionWithTx>,
      )
      dispatch(fetchInvaVaultUserData({ account }))
      mutate(['userInvaLockStatus', account])
    }
  }, [t, toastSuccess, account, callWithGasPrice, dispatch, fetchWithCatchTxError, vaultPoolContract, mutate])

  return (
    <Button width="100%" disabled={pendingTx} onClick={handleUnlock} variant="secondary" {...props}>
      {pendingTx ? t('Converting...') : t('Convert to Flexible')}
    </Button>
  )
}

export default memo(ConvertToFlexibleButton)
