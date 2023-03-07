import styled from 'styled-components'
import { Text, Heading, Card, CardHeader, CardBody, Flex, useToast } from '@offsideswap/uikit'
import { useTranslation } from '@offsideswap/localization'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useRoto, useFarmAuctionContract } from 'hooks/useContract'
import { requiresApproval } from 'utils/requiresApproval'
import { useAccount } from 'wagmi'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { getBalanceNumber } from '@offsideswap/utils/formatBalance'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { MaxUint256 } from '@ethersproject/constants'
import ApproveConfirmButtons, { ButtonArrangement } from 'components/ApproveConfirmButtons'
import { ToastDescriptionWithTx } from 'components/Toast'
import useReclaimAuctionBid from '../hooks/useReclaimAuctionBid'

const StyledReclaimBidCard = styled(Card)`
  margin-top: 16px;
  flex: 1;
`

const ReclaimBidCard: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { callWithGasPrice } = useCallWithGasPrice()

  const [reclaimableAuction, checkForNextReclaimableAuction] = useReclaimAuctionBid()

  const { reader: rotoContractReader, signer: rotoContractApprover } = useRoto()
  const farmAuctionContract = useFarmAuctionContract()

  const { toastSuccess } = useToast()

  const { isApproving, isApproved, isConfirming, handleApprove, handleConfirm } = useApproveConfirmTransaction({
    onRequiresApproval: async () => {
      return requiresApproval(rotoContractReader, account, farmAuctionContract.address)
    },
    onApprove: () => {
      return callWithGasPrice(rotoContractApprover, 'approve', [farmAuctionContract.address, MaxUint256])
    },
    onApproveSuccess: async ({ receipt }) => {
      toastSuccess(
        t('Contract approved - you can now reclaim your bid!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash} />,
      )
    },
    onConfirm: () => {
      return callWithGasPrice(farmAuctionContract, 'claimAuction', [reclaimableAuction.id])
    },
    onSuccess: async ({ receipt }) => {
      checkForNextReclaimableAuction()
      toastSuccess(t('Bid reclaimed!'), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
    },
  })

  if (!reclaimableAuction) {
    return null
  }

  const { position, amount } = reclaimableAuction

  return (
    <StyledReclaimBidCard mb={['24px', null, null, '0']}>
      <CardHeader>
        <Heading>{t('Reclaim Bid')}</Heading>
      </CardHeader>
      <CardBody>
        <Text mb="16px">
          {t('Your bid in Auction #%auctionId% was unsuccessful.', { auctionId: reclaimableAuction.id })}
        </Text>
        <Text bold mb="16px">
          {t('Reclaim your ROTO now.')}
        </Text>
        <Flex justifyContent="space-between" mb="8px">
          <Text color="textSubtle">{t('Your total bid')}</Text>
          <Text>{t('%num% ROTO', { num: getBalanceNumber(amount).toLocaleString() })}</Text>
        </Flex>
        <Flex justifyContent="space-between" mb="24px">
          <Text color="textSubtle">{t('Your position')}</Text>
          <Text>#{position}</Text>
        </Flex>
        {account ? (
          <ApproveConfirmButtons
            isApproveDisabled={isApproved}
            isApproving={isApproving}
            isConfirmDisabled={false}
            isConfirming={isConfirming}
            onApprove={handleApprove}
            onConfirm={handleConfirm}
            buttonArrangement={ButtonArrangement.SEQUENTIAL}
            confirmLabel={t('Reclaim')}
          />
        ) : (
          <ConnectWalletButton />
        )}
      </CardBody>
    </StyledReclaimBidCard>
  )
}

export default ReclaimBidCard
