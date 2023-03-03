import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Flex,
  HelpIcon,
  Link,
  RocketIcon,
  Text,
  useTooltip,
  useMatchBreakpoints,
  MessageText,
  Message,
} from '@spaceinvaders-swap/uikit'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useTranslation } from '@spaceinvaders-swap/localization'
import Image from 'next/legacy/image'
import NextLink from 'next/link'
import styled, { useTheme } from 'styled-components'
import { useBInvaProxyContractAddress } from '../hooks/useBInvaProxyContractAddress'
import useBInvaProxyBalance from '../hooks/useBInvaProxyBalance'
import { useUserBoosterStatus } from '../hooks/useUserBoosterStatus'
import { useUserLockedInvaStatus } from '../hooks/useUserLockedInvaStatus'
import boosterCardImage from '../images/boosterCardImage.png'
import CreateProxyButton from './YieldBooster/components/CreateProxyButton'

export const CardWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-top: 10px;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 296px;
    margin-left: 50px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    margin-top: 0px;
  }
`
export const ImageWrapper = styled.div`
  position: absolute;
  top: -50px;
  transform: translateY(-50%) scale(75%);
  right: 10px;
  ${({ theme }) => theme.mediaQueries.sm} {
    right: auto;
    top: 50%;
    left: -70px;
    transform: translateY(-50%);
  }
  z-index: 2;
`
const StyledCardBody = styled(CardBody)`
  border-bottom: none;
`
const StyledCardFooter = styled(CardFooter)`
  border-top: none;
  position: relative;
  padding: 8px 24px 16px;
  &::before {
    content: '';
    position: absolute;
    height: 1px;
    width: calc(100% - 48px);
    top: 0px;
    left: 24px;
    background-color: ${({ theme }) => theme.colors.cardBorder};
  }
`

export const BInvaProxyInvaBalanceCard = () => {
  const { t } = useTranslation()
  const { bInvaProxyBalance, bInvaProxyDisplayBalance, isLoading } = useBInvaProxyBalance()
  return !isLoading && bInvaProxyBalance > 0 ? (
    <Message marginBottom="8px" variant="warning">
      <MessageText>
        {t(
          'There is %amount% INVA in the proxy booster contract. In order to harvest that amount you should withdraw, deposit or harvest one of the boosted farms.',
          { amount: bInvaProxyDisplayBalance },
        )}
      </MessageText>
    </Message>
  ) : null
}

export const useBInvaTooltipContent = () => {
  const { t } = useTranslation()
  const tooltipContent = (
    <>
      <Box mb="20px">
        {t(
          'Yield Boosters allow you to boost your farming yields by locking INVA in the fixed-term staking INVA pool. The more INVA you lock, and the longer you lock them, the higher the boost you will receive.',
        )}
      </Box>
      <Box>
        {t('To learn more, check out the')}
        <Link target="_blank" href="https://medium.com/spaceinvaders-swap/introducing-binva-farm-yield-boosters-b27b7a6f0f84">
          {t('Medium Article')}
        </Link>
      </Box>
    </>
  )
  return tooltipContent
}

export const BInvaBoosterCard = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const { isMobile } = useMatchBreakpoints()

  const tooltipContent = useBInvaTooltipContent()

  const { targetRef, tooltip, tooltipVisible } = useTooltip(tooltipContent, {
    placement: 'bottom-start',
    ...(isMobile && { hideTimeout: 1500 }),
  })
  return (
    <CardWrapper>
      <ImageWrapper>
        <Image src={boosterCardImage} alt="boosterCardImage" width={99} height={191} placeholder="blur" />
      </ImageWrapper>
      <Card p="0px" style={{ zIndex: 1 }}>
        <StyledCardBody style={{ padding: '15px 24px' }}>
          <RocketIcon />
          <Text fontSize={22} bold color="text" marginBottom="-12px" display="inline-block" ml="7px">
            {t('Yield Booster')}
          </Text>
          {tooltipVisible && tooltip}
          <Box ref={targetRef} style={{ float: 'right', position: 'relative', top: '6px' }}>
            <HelpIcon color={theme.colors.textSubtle} />
          </Box>
        </StyledCardBody>
        <StyledCardFooter>
          <BInvaProxyInvaBalanceCard />
          <CardContent />
        </StyledCardFooter>
      </Card>
    </CardWrapper>
  )
}

const CardContent: React.FC = () => {
  const { t } = useTranslation()
  const { account, chainId } = useActiveWeb3React()
  const { proxyCreated, refreshProxyAddress } = useBInvaProxyContractAddress(account, chainId)
  const { maxBoostCounts, remainingCounts } = useUserBoosterStatus(account)
  const { locked, lockedEnd } = useUserLockedInvaStatus()
  const theme = useTheme()

  if (!account)
    return (
      <Box>
        <Text color="textSubtle" fontSize={12} bold>
          {t('Connect wallet to view booster')}
        </Text>
        <Text color="textSubtle" fontSize={12} mb="16px">
          {t('An active fixed-term INVA staking position is required for activating farm yield boosters.')}
        </Text>
        <ConnectWalletButton width="100%" style={{ backgroundColor: theme.colors.textSubtle }} />
      </Box>
    )
  if (!locked)
    return (
      <Box width="100%">
        <Text color="textSubtle" fontSize={12} bold>
          {t('No INVA locked')}
        </Text>
        <Text color="textSubtle" fontSize={12} mb="16px">
          {t('An active fixed-term INVA staking position is required for activating farm yield boosters.')}
        </Text>
        <NextLink href="/pools" passHref>
          <Button width="100%" style={{ backgroundColor: theme.colors.textSubtle }}>
            {t('Go to Pool')}
          </Button>
        </NextLink>
      </Box>
    )
  if (lockedEnd === '0' || new Date() > new Date(parseInt(lockedEnd) * 1000))
    return (
      <Box>
        <Text color="textSubtle" fontSize={12} bold>
          {t('Locked staking is ended')}
        </Text>
        <Text color="textSubtle" fontSize={12} mb="16px">
          {t('An active fixed-term INVA staking position is required for activating farm yield boosters.')}
        </Text>
        <NextLink href="/pools" passHref>
          <Button width="100%" style={{ backgroundColor: theme.colors.textSubtle }}>
            {t('Go to Pool')}
          </Button>
        </NextLink>
      </Box>
    )
  if (!proxyCreated) {
    return (
      <Box>
        <Text color="textSubtle" fontSize={12} bold>
          {t('Available Yield Booster')}
        </Text>
        <Text color="textSubtle" fontSize={12} mb="16px">
          {t('A one-time setup is required for enabling farm yield boosters.')}
        </Text>
        <CreateProxyButton onDone={refreshProxyAddress} style={{ backgroundColor: theme.colors.textSubtle }} />
      </Box>
    )
  }
  if (remainingCounts > 0)
    return (
      <Box>
        <Flex justifyContent="space-between" alignItems="center" mb="5px">
          <Text color="secondary" fontSize={12} bold textTransform="uppercase">
            {t('Available Yield Booster')}
          </Text>
          <Text color="secondary" fontSize={16} bold textTransform="uppercase">
            {remainingCounts}/{maxBoostCounts}
          </Text>
        </Flex>

        <Text color="textSubtle" fontSize={12}>
          {t('You will be able to activate the yield booster on an additional %num% farm(s).', {
            num: remainingCounts,
          })}
        </Text>
      </Box>
    )
  return (
    <Box>
      <Flex justifyContent="space-between">
        <Text color="secondary" fontSize={12} bold textTransform="uppercase">
          {t('Available Yield Booster')}
        </Text>
        <Text color="secondary" fontSize={12} bold textTransform="uppercase">
          0
        </Text>
      </Flex>

      <Text color="textSubtle" fontSize={12}>
        {t('To activate yield boosters on additional farms, unset yield boosters on some currently boosted farms.')}
      </Text>
    </Box>
  )
}
