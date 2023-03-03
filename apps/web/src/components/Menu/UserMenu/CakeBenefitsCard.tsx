import {
  Box,
  Flex,
  Message,
  Tag,
  LockIcon,
  MessageText,
  useTooltip,
  TooltipText,
  Skeleton,
  Text,
  NextLinkFromReactRouter,
  useMatchBreakpoints,
} from '@spaceinvaders-swap/uikit'
import { VaultPosition } from 'utils/invaPool'
import { FetchStatus } from 'config/constants/types'
import { useTranslation } from '@spaceinvaders-swap/localization'
import styled from 'styled-components'
import useInvaBenefits from './hooks/useInvaBenefits'

const InvaBenefitsCardWrapper = styled(Box)`
  width: 100%;
  margin-bottom: 24px;
  padding: 1px 1px 3px 1px;
  background: linear-gradient(180deg, #53dee9, #7645d9);
  border-radius: ${({ theme }) => theme.radii.default};
`

const InvaBenefitsCardInner = styled(Box)`
  position: relative;
  z-index: 1;
  padding: 8px 12px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: ${({ theme }) => theme.radii.default};

  &:before {
    position: absolute;
    content: '';
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    pointer-events: none;
    border-radius: ${({ theme }) => theme.radii.default};
    background: ${({ theme }) => theme.colors.gradientBubblegum};
  }
`

interface InvaBenefitsCardProps {
  onDismiss: () => void
}

const InvaBenefitsCard: React.FC<React.PropsWithChildren<InvaBenefitsCardProps>> = ({ onDismiss }) => {
  const { t } = useTranslation()
  const { data: invaBenefits, status: invaBenefitsFetchStatus } = useInvaBenefits()
  const { isMobile } = useMatchBreakpoints()

  const {
    targetRef: invaTargetRef,
    tooltip: invaTooltip,
    tooltipVisible: invaTooltipVisible,
  } = useTooltip(
    <>
      <Text>
        {t(`%lockedInva% INVA (including rewards) are locked in the INVA Pool until %lockedEndTime%`, {
          lockedInva: invaBenefits?.lockedInva,
          lockedEndTime: invaBenefits?.lockedEndTime,
        })}
      </Text>
      <NextLinkFromReactRouter to="/pools" onClick={onDismiss}>
        <Text bold color="primary">
          {t('Learn More')}
        </Text>
      </NextLinkFromReactRouter>
    </>,
    {
      placement: 'bottom',
      ...(isMobile && { hideTimeout: 2000 }),
    },
  )

  const {
    targetRef: iInvaTargetRef,
    tooltip: iInvaTooltip,
    tooltipVisible: iInvaTooltipVisible,
  } = useTooltip(
    <>
      <Text>
        {t(`iINVA allows you to participate in the IFO public sales and commit up to %iInva% amount of INVA.`, {
          iInva: invaBenefits?.iInva,
        })}
      </Text>
      <NextLinkFromReactRouter to="/ifo" onClick={onDismiss}>
        <Text bold color="primary">
          {t('Learn More')}
        </Text>
      </NextLinkFromReactRouter>
    </>,
    {
      placement: 'bottom',
      ...(isMobile && { hideTimeout: 2000 }),
    },
  )

  const {
    targetRef: bInvaTargetRef,
    tooltip: bInvaTooltip,
    tooltipVisible: bInvaTooltipVisible,
  } = useTooltip(
    <>
      <Text>{t(`bINVA allows you to boost your yield in SpaceinvadersSwap Farms by up to 2x.`)}</Text>
      <NextLinkFromReactRouter to="/farms" onClick={onDismiss}>
        <Text bold color="primary">
          {t('Learn More')}
        </Text>
      </NextLinkFromReactRouter>
    </>,
    {
      placement: 'bottom',
      ...(isMobile && { hideTimeout: 2000 }),
    },
  )

  const {
    targetRef: vInvaTargetRef,
    tooltip: vInvaTooltip,
    tooltipVisible: vInvaTooltipVisible,
  } = useTooltip(
    <>
      <Text>
        {t(`vINVA boosts your voting power to %totalScore% in the SpaceinvadersSwap voting governance.`, {
          totalScore: invaBenefits?.vInva?.totalScore,
        })}
      </Text>
      <NextLinkFromReactRouter to="/voting" onClick={onDismiss}>
        <Text bold color="primary">
          {t('Learn More')}
        </Text>
      </NextLinkFromReactRouter>
    </>,
    {
      placement: 'bottom',
      ...(isMobile && { hideTimeout: 2000 }),
    },
  )

  return invaBenefitsFetchStatus === FetchStatus.Fetched ? (
    <>
      {[VaultPosition.None, VaultPosition.Flexible].includes(invaBenefits?.lockPosition) ? (
        <>
          <Flex flexDirection="row" alignItems="center">
            <Tag variant="secondary" mr="auto">
              <Flex alignItems="center">
                <Box as={LockIcon} mr="4px" />
                {t('No INVA locked')}
              </Flex>
            </Tag>
            <Text fontSize="16px">{invaBenefits?.lockedInva}</Text>
          </Flex>
          <Message mt="8px" mb="16px" variant="warning">
            <MessageText maxWidth="200px">
              {t(
                'Lock INVA to enjoy the benefits of farm yield boosting, participating in IFOs, voting power boosts, and so much more!',
              )}{' '}
              <NextLinkFromReactRouter
                style={{ textDecoration: 'underline', fontWeight: 'bold' }}
                to="/pools"
                onClick={onDismiss}
              >
                {t('Go to Pools')}
              </NextLinkFromReactRouter>
            </MessageText>
          </Message>
        </>
      ) : [VaultPosition.LockedEnd, VaultPosition.AfterBurning].includes(invaBenefits?.lockPosition) ? (
        <>
          <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
            <Tag variant="failure" mr="auto">
              <Flex alignItems="center">
                <Box as={LockIcon} mr="4px" />
                {t('INVA staking expired')}
              </Flex>
            </Tag>
            <Text fontSize="16px">{invaBenefits?.lockedInva}</Text>
          </Flex>
          <Message mt="8px" mb="16px" variant="warning">
            <MessageText maxWidth="200px">
              {t(
                'Renew your staking position to continue enjoying the benefits of farm yield boosting, participating in IFOs, voting power boosts, and so much more!',
              )}{' '}
              <NextLinkFromReactRouter
                style={{ textDecoration: 'underline', fontWeight: 'bold' }}
                to="/pools"
                onClick={onDismiss}
              >
                {t('Go to Pools')}
              </NextLinkFromReactRouter>
            </MessageText>
          </Message>
        </>
      ) : (
        <InvaBenefitsCardWrapper>
          <InvaBenefitsCardInner>
            <Flex flexDirection="row" alignItems="center">
              <Tag variant="secondary" mr="auto">
                <Flex alignItems="center">
                  <Box as={LockIcon} mr="4px" />
                  {t('INVA locked')}
                </Flex>
              </Tag>
              <TooltipText ref={invaTargetRef} bold fontSize="16px">
                {invaBenefits?.lockedInva}
              </TooltipText>
              {invaTooltipVisible && invaTooltip}
            </Flex>
            <Flex mt="10px" flexDirection="row" alignItems="center">
              <TooltipText ref={iInvaTargetRef} color="textSubtle" fontSize="16px" mr="auto">
                iINVA
              </TooltipText>
              {iInvaTooltipVisible && iInvaTooltip}
              {invaBenefits?.iInva}
            </Flex>
            <Flex mt="10px" flexDirection="row" alignItems="center">
              <TooltipText ref={bInvaTargetRef} color="textSubtle" fontSize="16px" mr="auto">
                bINVA
              </TooltipText>
              {bInvaTooltipVisible && bInvaTooltip}
              {t('Up to %boostMultiplier%x', { boostMultiplier: 2 })}
            </Flex>
            <Flex mt="10px" flexDirection="row" alignItems="center">
              <TooltipText ref={vInvaTargetRef} color="textSubtle" fontSize="16px" mr="auto">
                vINVA
              </TooltipText>
              {vInvaTooltipVisible && vInvaTooltip}
              {invaBenefits?.vInva?.vaultScore}
            </Flex>
          </InvaBenefitsCardInner>
        </InvaBenefitsCardWrapper>
      )}
    </>
  ) : (
    <Skeleton width="100%" height={146} borderRadius="16px" marginBottom={24} />
  )
}

export default InvaBenefitsCard
