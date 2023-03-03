import { useCallback } from 'react'
import { useToast } from '@spaceinvaders-swap/uikit'
import useCatchTxError from 'hooks/useCatchTxError'
import { useTranslation } from '@spaceinvaders-swap/localization'
import { ToastDescriptionWithTx } from 'components/Toast'
import { MaxUint256 } from '@ethersproject/constants'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useInva } from 'hooks/useContract'

export const useApprovePottery = (potteryVaultAddress: string) => {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: isPending } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { signer: invaContract } = useInva()

  const onApprove = useCallback(async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return callWithGasPrice(invaContract, 'approve', [potteryVaultAddress, MaxUint256])
    })

    if (receipt?.status) {
      toastSuccess(
        t('Success!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Please progress to the next step.')}
        </ToastDescriptionWithTx>,
      )
    }
  }, [potteryVaultAddress, invaContract, t, callWithGasPrice, fetchWithCatchTxError, toastSuccess])

  return { isPending, onApprove }
}
