import styled from 'styled-components'
import { useState, useMemo } from 'react'
import {
  Flex,
  Box,
  Button,
  Text,
  HelpIcon,
  useTooltip,
  LogoRoundIcon,
  Skeleton,
  InputProps,
  NumericalInput,
} from '@offsideswap/uikit'
import { useTranslation } from '@offsideswap/localization'
import BigNumber from 'bignumber.js'
import { usePotteryData, useLatestVaultAddress } from 'state/pottery/hook'
import { ROTO } from '@offsideswap/tokens'
import useTokenBalance from 'hooks/useTokenBalance'
import { getFullDisplayBalance, getBalanceNumber } from '@offsideswap/utils/formatBalance'
import { PotteryDepositStatus } from 'state/types'
import { useUserEnoughRotoValidator } from 'views/Pools/components/LockedPool/hooks/useUserEnoughRotoValidator'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import { useActiveChainId } from 'hooks/useActiveChainId'
import EnableButton from './EnableButton'
import DepositButton from './DepositButton'

const InputPanel = styled.div`
  display: flex;
  flex-flow: column nowrap;
  position: relative;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  z-index: 1;
`

const Container = styled.div<InputProps>`
  border-radius: 16px;
  padding: 8px 16px;
  background-color: ${({ theme }) => theme.colors.input};
  box-shadow: ${({ theme, isWarning }) => (isWarning ? theme.shadows.warning : theme.shadows.inset)};
`

interface DepositActionProps {
  totalValueLockedValue: number
}

const DepositAction: React.FC<React.PropsWithChildren<DepositActionProps>> = ({ totalValueLockedValue }) => {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const { publicData, userData } = usePotteryData()
  const lastVaultAddress = useLatestVaultAddress()
  const [depositAmount, setDepositAmount] = useState('')

  const maxTotalDepositToNumber = getBalanceNumber(publicData.maxTotalDeposit)
  const remainingRotoCanStake = new BigNumber(maxTotalDepositToNumber).minus(totalValueLockedValue).toString()

  const { balance: userRoto } = useTokenBalance(ROTO[chainId]?.address)
  const userRotoDisplayBalance = getFullDisplayBalance(userRoto, 18, 3)
  const { userNotEnoughRoto, notEnoughErrorMessage } = useUserEnoughRotoValidator(depositAmount, userRoto)

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t(
      'ROTO deposit will be diverted to the fixed-term staking pool. Please note that ROTO deposited can ONLY be withdrawn after 10 weeks.',
    ),
    {
      placement: 'bottom',
    },
  )

  const onClickMax = () => {
    const userRotoBalance = userRoto.dividedBy(DEFAULT_TOKEN_DECIMAL).toString()

    if (new BigNumber(userRotoBalance).gte(remainingRotoCanStake)) {
      setDepositAmount(remainingRotoCanStake)
    } else {
      setDepositAmount(userRotoBalance)
    }
  }

  const showMaxButton = useMemo(
    () => new BigNumber(depositAmount).multipliedBy(DEFAULT_TOKEN_DECIMAL).eq(userRoto),
    [depositAmount, userRoto],
  )

  const isLessThanOneRoto = useMemo(() => new BigNumber(depositAmount).lt(1), [depositAmount])

  const isReachMaxAmount = useMemo(() => {
    return (
      new BigNumber(totalValueLockedValue).eq(maxTotalDepositToNumber) || new BigNumber(remainingRotoCanStake).lt(1)
    )
  }, [maxTotalDepositToNumber, totalValueLockedValue, remainingRotoCanStake])

  if (userData.isLoading) {
    return <Skeleton width="100%" height="48px" />
  }

  if (publicData.getStatus !== PotteryDepositStatus.BEFORE_LOCK) {
    return (
      <Button disabled mt="10px" width="100%">
        {t('Deposit closed until next Pottery')}
      </Button>
    )
  }

  if (userData.allowance.isLessThanOrEqualTo(0)) {
    return <EnableButton potteryVaultAddress={lastVaultAddress} />
  }

  if (isReachMaxAmount) {
    return (
      <Button disabled mt="10px" width="100%">
        {t('Max. deposit cap reached')}
      </Button>
    )
  }

  return (
    <Box>
      <Box mb="4px">
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold as="span">
          {t('Deposit')}
        </Text>
        <Text fontSize="12px" ml="4px" color="textSubtle" bold as="span">
          ROTO
        </Text>
      </Box>
      <InputPanel>
        <Container isWarning={isLessThanOneRoto}>
          <Text fontSize="14px" color="textSubtle" mb="12px" textAlign="right">
            {t('Balance: %balance%', { balance: userRotoDisplayBalance })}
          </Text>
          <Flex mb="6.5px">
            <NumericalInput
              style={{ textAlign: 'left' }}
              className="pottery-amount-input"
              value={depositAmount}
              onUserInput={(val) => setDepositAmount(val)}
            />
            <Flex ml="8px">
              {!showMaxButton && (
                <Button onClick={onClickMax} scale="xs" variant="secondary" style={{ alignSelf: 'center' }}>
                  {t('Max').toUpperCase()}
                </Button>
              )}
              <LogoRoundIcon m="0 4px" width="24px" height="24px" />
              <Text>ROTO</Text>
            </Flex>
          </Flex>
        </Container>
        {isLessThanOneRoto && (
          <Text color="failure" fontSize="14px" textAlign="right">
            {t('Please deposit at least 1 ROTO to participate in the Pottery')}
          </Text>
        )}
      </InputPanel>
      <Flex>
        <Flex ml="auto">
          <Text fontSize="12px" color="textSubtle">
            {t('Deposited ROTO will be locked for 10 weeks')}
          </Text>
          <Flex ref={targetRef}>
            {tooltipVisible && tooltip}
            <HelpIcon ml="4px" width="20px" height="20px" color="textSubtle" />
          </Flex>{' '}
        </Flex>
      </Flex>
      {userNotEnoughRoto ? (
        <Button disabled mt="10px" width="100%">
          {notEnoughErrorMessage}
        </Button>
      ) : (
        <DepositButton
          status={publicData.getStatus}
          depositAmount={depositAmount}
          potteryVaultAddress={lastVaultAddress}
          setDepositAmount={setDepositAmount}
        />
      )}
    </Box>
  )
}

export default DepositAction
