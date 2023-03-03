import { Box, Flex, InjectedModalProps, Modal, Button, Spinner } from '@spaceinvaders-swap/uikit'
import { useTranslation } from '@spaceinvaders-swap/localization'
import useTheme from 'hooks/useTheme'
import useGetVotingPower from '../hooks/useGetVotingPower'
import DetailsView from './CastVoteModal/DetailsView'

interface VoteDetailsModalProps extends InjectedModalProps {
  block: number
}

const VoteDetailsModal: React.FC<React.PropsWithChildren<VoteDetailsModalProps>> = ({ block, onDismiss }) => {
  const { t } = useTranslation()
  const {
    isLoading,
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
  const { theme } = useTheme()

  const handleDismiss = () => {
    onDismiss()
  }

  return (
    <Modal title={t('Voting Power')} onDismiss={handleDismiss} headerBackground={theme.colors.gradientCardHeader}>
      <Box mb="24px" width={['100%', '100%', '100%', '320px']}>
        {isLoading ? (
          <Flex height="450px" alignItems="center" justifyContent="center">
            <Spinner size={80} />
          </Flex>
        ) : (
          <>
            <DetailsView
              total={total}
              invaBalance={invaBalance}
              invaVaultBalance={invaVaultBalance}
              invaPoolBalance={invaPoolBalance}
              poolsBalance={poolsBalance}
              ifoPoolBalance={ifoPoolBalance}
              invaBnbLpBalance={invaBnbLpBalance}
              lockedInvaBalance={lockedInvaBalance}
              lockedEndTime={lockedEndTime}
              block={block}
            />
            <Button variant="secondary" onClick={onDismiss} width="100%" mt="16px">
              {t('Close')}
            </Button>
          </>
        )}
      </Box>
    </Modal>
  )
}

export default VoteDetailsModal
