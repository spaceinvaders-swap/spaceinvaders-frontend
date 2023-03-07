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
} from '@offsideswap/uikit'
import { VaultPosition } from 'utils/rotoPool'
import { FetchStatus } from 'config/constants/types'
import { useTranslation } from '@offsideswap/localization'
import styled from 'styled-components'
import useRotoBenefits from './hooks/useRotoBenefits'

const RotoBenefitsCardWrapper = styled(Box)`
  width: 100%;
  margin-bottom: 24px;
  padding: 1px 1px 3px 1px;
  background: linear-gradient(180deg, #53dee9, #7645d9);
  border-radius: ${({ theme }) => theme.radii.default};
`

const RotoBenefitsCardInner = styled(Box)`
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

interface RotoBenefitsCardProps {
  onDismiss: () => void
}

const RotoBenefitsCard: React.FC<React.PropsWithChildren<RotoBenefitsCardProps>> = ({ onDismiss }) => {
  const { t } = useTranslation()
  const { data: rotoBenefits, status: rotoBenefitsFetchStatus } = useRotoBenefits()
  const { isMobile } = useMatchBreakpoints()

  const {
    targetRef: rotoTargetRef,
    tooltip: rotoTooltip,
    tooltipVisible: rotoTooltipVisible,
  } = useTooltip(
    <>
      <Text>
        {t(`%lockedRoto% ROTO (including rewards) are locked in the ROTO Pool until %lockedEndTime%`, {
          lockedRoto: rotoBenefits?.lockedRoto,
          lockedEndTime: rotoBenefits?.lockedEndTime,
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
    targetRef: iRotoTargetRef,
    tooltip: iRotoTooltip,
    tooltipVisible: iRotoTooltipVisible,
  } = useTooltip(
    <>
      <Text>
        {t(`iROTO allows you to participate in the IFO public sales and commit up to %iRoto% amount of ROTO.`, {
          iRoto: rotoBenefits?.iRoto,
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
    targetRef: bRotoTargetRef,
    tooltip: bRotoTooltip,
    tooltipVisible: bRotoTooltipVisible,
  } = useTooltip(
    <>
      <Text>{t(`bROTO allows you to boost your yield in OffsideSwap Farms by up to 2x.`)}</Text>
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
    targetRef: vRotoTargetRef,
    tooltip: vRotoTooltip,
    tooltipVisible: vRotoTooltipVisible,
  } = useTooltip(
    <>
      <Text>
        {t(`vROTO boosts your voting power to %totalScore% in the OffsideSwap voting governance.`, {
          totalScore: rotoBenefits?.vRoto?.totalScore,
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

  return rotoBenefitsFetchStatus === FetchStatus.Fetched ? (
    <>
      {[VaultPosition.None, VaultPosition.Flexible].includes(rotoBenefits?.lockPosition) ? (
        <>
          <Flex flexDirection="row" alignItems="center">
            <Tag variant="secondary" mr="auto">
              <Flex alignItems="center">
                <Box as={LockIcon} mr="4px" />
                {t('No ROTO locked')}
              </Flex>
            </Tag>
            <Text fontSize="16px">{rotoBenefits?.lockedRoto}</Text>
          </Flex>
          <Message mt="8px" mb="16px" variant="warning">
            <MessageText maxWidth="200px">
              {t(
                'Lock ROTO to enjoy the benefits of farm yield boosting, participating in IFOs, voting power boosts, and so much more!',
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
      ) : [VaultPosition.LockedEnd, VaultPosition.AfterBurning].includes(rotoBenefits?.lockPosition) ? (
        <>
          <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
            <Tag variant="failure" mr="auto">
              <Flex alignItems="center">
                <Box as={LockIcon} mr="4px" />
                {t('ROTO staking expired')}
              </Flex>
            </Tag>
            <Text fontSize="16px">{rotoBenefits?.lockedRoto}</Text>
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
        <RotoBenefitsCardWrapper>
          <RotoBenefitsCardInner>
            <Flex flexDirection="row" alignItems="center">
              <Tag variant="secondary" mr="auto">
                <Flex alignItems="center">
                  <Box as={LockIcon} mr="4px" />
                  {t('ROTO locked')}
                </Flex>
              </Tag>
              <TooltipText ref={rotoTargetRef} bold fontSize="16px">
                {rotoBenefits?.lockedRoto}
              </TooltipText>
              {rotoTooltipVisible && rotoTooltip}
            </Flex>
            <Flex mt="10px" flexDirection="row" alignItems="center">
              <TooltipText ref={iRotoTargetRef} color="textSubtle" fontSize="16px" mr="auto">
                iROTO
              </TooltipText>
              {iRotoTooltipVisible && iRotoTooltip}
              {rotoBenefits?.iRoto}
            </Flex>
            <Flex mt="10px" flexDirection="row" alignItems="center">
              <TooltipText ref={bRotoTargetRef} color="textSubtle" fontSize="16px" mr="auto">
                bROTO
              </TooltipText>
              {bRotoTooltipVisible && bRotoTooltip}
              {t('Up to %boostMultiplier%x', { boostMultiplier: 2 })}
            </Flex>
            <Flex mt="10px" flexDirection="row" alignItems="center">
              <TooltipText ref={vRotoTargetRef} color="textSubtle" fontSize="16px" mr="auto">
                vROTO
              </TooltipText>
              {vRotoTooltipVisible && vRotoTooltip}
              {rotoBenefits?.vRoto?.vaultScore}
            </Flex>
          </RotoBenefitsCardInner>
        </RotoBenefitsCardWrapper>
      )}
    </>
  ) : (
    <Skeleton width="100%" height={146} borderRadius="16px" marginBottom={24} />
  )
}

export default RotoBenefitsCard
