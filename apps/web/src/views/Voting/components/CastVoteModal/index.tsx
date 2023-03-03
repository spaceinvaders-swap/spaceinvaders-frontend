import { useTranslation } from '@spaceinvaders-swap/localization'
import { Box, Modal, useToast } from '@spaceinvaders-swap/uikit'
import { useWeb3LibraryContext } from '@spaceinvaders-swap/wagmi'
import { useAccount } from 'wagmi'
import snapshot from '@snapshot-labs/snapshot.js'
import useTheme from 'hooks/useTheme'
import { useState } from 'react'
import { SPACEINVADERS_SPACE } from 'views/Voting/config'
import useGetVotingPower from '../../hooks/useGetVotingPower'
import DetailsView from './DetailsView'
import MainView from './MainView'
import { CastVoteModalProps, ConfirmVoteView } from './types'

const hub = 'https://hub.snapshot.org'
const client = new snapshot.Client712(hub)

const CastVoteModal: React.FC<React.PropsWithChildren<CastVoteModalProps>> = ({
  onSuccess,
  proposalId,
  vote,
  block,
  onDismiss,
}) => {
  const [view, setView] = useState<ConfirmVoteView>(ConfirmVoteView.MAIN)
  const [isPending, setIsPending] = useState(false)
  const { address: account } = useAccount()
  const { t } = useTranslation()
  const library = useWeb3LibraryContext()
  const { toastError } = useToast()
  const { theme } = useTheme()
  const {
    isLoading,
    isError,
    total,
    invaBalance,
    invaVaultBalance,
    invaPoolBalance,
    poolsBalance,
    invaBnbLpBalance,
    ifoPoolBalance,
    lockedInvaBalance,
    lockedEndTime,
  } = useGetVotingPower(block)

  const isStartView = view === ConfirmVoteView.MAIN
  const handleBack = isStartView ? null : () => setView(ConfirmVoteView.MAIN)
  const handleViewDetails = () => setView(ConfirmVoteView.DETAILS)

  const title = {
    [ConfirmVoteView.MAIN]: t('Confirm Vote'),
    [ConfirmVoteView.DETAILS]: t('Voting Power'),
  }

  const handleDismiss = () => {
    onDismiss()
  }

  const handleConfirmVote = async () => {
    try {
      setIsPending(true)

      await client.vote(library as any, account, {
        space: SPACEINVADERS_SPACE,
        choice: vote.value,
        reason: '',
        type: 'single-choice',
        proposal: proposalId,
        app: 'snapshot',
      })

      await onSuccess()

      handleDismiss()
    } catch (error) {
      toastError(t('Error'), (error as Error)?.message ?? t('Error occurred, please try again'))
      console.error(error)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Modal
      title={title[view]}
      onBack={handleBack}
      onDismiss={onDismiss}
      hideCloseButton={!isStartView}
      headerBackground={theme.colors.gradientCardHeader}
    >
      <Box mb="24px">
        {view === ConfirmVoteView.MAIN && (
          <MainView
            vote={vote}
            isError={isError}
            isLoading={isLoading}
            isPending={isPending}
            total={total}
            lockedInvaBalance={lockedInvaBalance}
            lockedEndTime={lockedEndTime}
            onConfirm={handleConfirmVote}
            onViewDetails={handleViewDetails}
            onDismiss={handleDismiss}
          />
        )}
        {view === ConfirmVoteView.DETAILS && (
          <DetailsView
            total={total}
            invaBalance={invaBalance}
            ifoPoolBalance={ifoPoolBalance}
            invaVaultBalance={invaVaultBalance}
            invaPoolBalance={invaPoolBalance}
            poolsBalance={poolsBalance}
            invaBnbLpBalance={invaBnbLpBalance}
            block={block}
            lockedInvaBalance={lockedInvaBalance}
            lockedEndTime={lockedEndTime}
          />
        )}
      </Box>
    </Modal>
  )
}

export default CastVoteModal
