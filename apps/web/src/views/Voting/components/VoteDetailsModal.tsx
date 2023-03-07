import { Box, Flex, InjectedModalProps, Modal, Button, Spinner } from '@offsideswap/uikit'
import { useTranslation } from '@offsideswap/localization'
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
    rotoBalance,
    rotoVaultBalance,
    rotoPoolBalance,
    poolsBalance,
    rotoBnbLpBalance,
    ifoPoolBalance,
    lockedRotoBalance,
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
              rotoBalance={rotoBalance}
              rotoVaultBalance={rotoVaultBalance}
              rotoPoolBalance={rotoPoolBalance}
              poolsBalance={poolsBalance}
              ifoPoolBalance={ifoPoolBalance}
              rotoBnbLpBalance={rotoBnbLpBalance}
              lockedRotoBalance={lockedRotoBalance}
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
