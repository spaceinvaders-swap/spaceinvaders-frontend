import { Modal, Flex, Text, useToast } from '@spaceinvaders-swap/uikit'
import { BigNumber } from '@ethersproject/bignumber'
import { formatUnits } from '@ethersproject/units'
import { useTranslation } from '@spaceinvaders-swap/localization'
import { useInva, useProfileContract } from 'hooks/useContract'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useProfile } from 'state/profile/hooks'
import { requiresApproval } from 'utils/requiresApproval'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import ApproveConfirmButtons from 'components/ApproveConfirmButtons'
import { REGISTER_COST } from './config'
import { State } from './contexts/types'

interface Props {
  userName: string
  selectedNft: State['selectedNft']
  account: string
  teamId: number
  minimumInvaRequired: BigNumber
  allowance: BigNumber
  onDismiss?: () => void
}

const ConfirmProfileCreationModal: React.FC<React.PropsWithChildren<Props>> = ({
  account,
  teamId,
  selectedNft,
  minimumInvaRequired,
  allowance,
  onDismiss,
}) => {
  const { t } = useTranslation()
  const profileContract = useProfileContract()
  const { refresh: refreshProfile } = useProfile()
  const { toastSuccess } = useToast()
  const { reader: invaContractReader, signer: invaContractApprover } = useInva()
  const { callWithGasPrice } = useCallWithGasPrice()

  const { isApproving, isApproved, isConfirmed, isConfirming, handleApprove, handleConfirm } =
    useApproveConfirmTransaction({
      onRequiresApproval: async () => {
        return requiresApproval(invaContractReader, account, profileContract.address, minimumInvaRequired)
      },
      onApprove: () => {
        return callWithGasPrice(invaContractApprover, 'approve', [profileContract.address, allowance.toJSON()])
      },
      onConfirm: () => {
        return callWithGasPrice(profileContract, 'createProfile', [
          teamId,
          selectedNft.collectionAddress,
          selectedNft.tokenId,
        ])
      },
      onSuccess: async ({ receipt }) => {
        refreshProfile()
        onDismiss()
        toastSuccess(t('Profile created!'), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
      },
    })

  return (
    <Modal title={t('Complete Profile')} onDismiss={onDismiss}>
      <Text color="textSubtle" mb="8px">
        {t('Submitting NFT to contract and confirming User Name and Team.')}
      </Text>
      <Flex justifyContent="space-between" mb="16px">
        <Text>{t('Cost')}</Text>
        <Text>{t('%num% INVA', { num: formatUnits(REGISTER_COST) })}</Text>
      </Flex>
      <ApproveConfirmButtons
        isApproveDisabled={isConfirmed || isConfirming || isApproved}
        isApproving={isApproving}
        isConfirmDisabled={!isApproved || isConfirmed}
        isConfirming={isConfirming}
        onApprove={handleApprove}
        onConfirm={handleConfirm}
      />
    </Modal>
  )
}

export default ConfirmProfileCreationModal
