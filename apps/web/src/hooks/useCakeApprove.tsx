import { MaxUint256 } from '@ethersproject/constants'
import { useTranslation } from '@spaceinvaders-swap/localization'
import { useInva } from 'hooks/useContract'
import { useToast } from '@spaceinvaders-swap/uikit'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useCatchTxError from 'hooks/useCatchTxError'
import { ToastDescriptionWithTx } from 'components/Toast'

const useInvaApprove = (setLastUpdated: () => void, spender, successMsg) => {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { signer: invaContract } = useInva()

  const handleApprove = async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return callWithGasPrice(invaContract, 'approve', [spender, MaxUint256])
    })
    if (receipt?.status) {
      toastSuccess(
        t('Contract Enabled'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>{successMsg}</ToastDescriptionWithTx>,
      )
      setLastUpdated()
    }
  }

  return { handleApprove, pendingTx }
}

export default useInvaApprove
