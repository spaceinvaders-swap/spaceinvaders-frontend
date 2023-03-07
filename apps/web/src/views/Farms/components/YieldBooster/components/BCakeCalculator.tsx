import { useTranslation } from '@offsideswap/localization'
import {
  BalanceInput,
  Box,
  Button,
  Flex,
  HelpIcon,
  Text,
  Toggle,
  useTooltip,
  useRoiCalculatorReducer,
  CalculatorMode,
  EditingCurrency,
} from '@offsideswap/uikit'
import { useAccount } from 'wagmi'
import BigNumber from 'bignumber.js'
import _toNumber from 'lodash/toNumber'
import { useEffect, useMemo, useState } from 'react'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import styled, { useTheme } from 'styled-components'
import { getBalanceNumber } from '@offsideswap/utils/formatBalance'
import { useBRotoTooltipContent } from 'views/Farms/components/BRotoBoosterCard'
import { useUserLockedRotoStatus } from 'views/Farms/hooks/useUserLockedRotoStatus'
import { weeksToSeconds } from 'views/Pools/components/utils/formatSecondsToWeeks'
import { useGetCalculatorMultiplier } from '../hooks/useGetBoostedAPR'
import LockDurationField from './BRotoLockedDuration'

const BRotoBlock = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  width: 100%;
  padding: 16px;
  box-sizing: border-box;
  border-radius: 16px;
`
interface BRotoCalculatorProps {
  targetInputBalance: string
  earningTokenPrice: number
  lpTokenStakedAmount: BigNumber
  initialState?: any
  stakingTokenSymbol?: string
  setBRotoMultiplier: (multiplier: number) => void
}

const BRotoCalculator: React.FC<React.PropsWithChildren<BRotoCalculatorProps>> = ({
  targetInputBalance,
  earningTokenPrice,
  initialState,
  stakingTokenSymbol = 'ROTO',
  lpTokenStakedAmount,
  setBRotoMultiplier,
}) => {
  const [isShow, setIsShow] = useState(true)
  const { t } = useTranslation()
  const [duration, setDuration] = useState(() => weeksToSeconds(1))
  const { isLoading, lockedAmount, lockedStart, lockedEnd } = useUserLockedRotoStatus()
  const { state, setPrincipalFromUSDValue, setPrincipalFromTokenValue, toggleEditingCurrency, setCalculatorMode } =
    useRoiCalculatorReducer(
      { stakingTokenPrice: earningTokenPrice, earningTokenPrice, autoCompoundFrequency: 0 },
      initialState,
    )
  const { editingCurrency } = state.controls
  const { principalAsUSD, principalAsToken } = state.data
  const onBalanceFocus = () => {
    setCalculatorMode(CalculatorMode.ROI_BASED_ON_PRINCIPAL)
  }
  const userBalanceInFarm = useMemo(
    () => new BigNumber(targetInputBalance).multipliedBy(DEFAULT_TOKEN_DECIMAL),
    [targetInputBalance],
  )
  const userLockedAmount = useMemo(
    () => new BigNumber(principalAsToken).multipliedBy(DEFAULT_TOKEN_DECIMAL),
    [principalAsToken],
  )

  const bRotoMultiplier = useGetCalculatorMultiplier(userBalanceInFarm, lpTokenStakedAmount, userLockedAmount, duration)

  useEffect(() => {
    setBRotoMultiplier(bRotoMultiplier)
  }, [bRotoMultiplier, setBRotoMultiplier])

  const editingUnit = editingCurrency === EditingCurrency.TOKEN ? stakingTokenSymbol : 'USD'
  const editingValue = editingCurrency === EditingCurrency.TOKEN ? principalAsToken : principalAsUSD
  const conversionUnit = editingCurrency === EditingCurrency.TOKEN ? 'USD' : stakingTokenSymbol
  const conversionValue = editingCurrency === EditingCurrency.TOKEN ? principalAsUSD : principalAsToken
  const onUserInput = editingCurrency === EditingCurrency.TOKEN ? setPrincipalFromTokenValue : setPrincipalFromUSDValue

  const { address: account } = useAccount()

  const tooltipContent = useBRotoTooltipContent()

  const { targetRef, tooltip, tooltipVisible } = useTooltip(tooltipContent, {
    placement: 'bottom-start',
  })

  const {
    targetRef: myBalanceTargetRef,
    tooltip: myBalanceTooltip,
    tooltipVisible: myBalanceTooltipVisible,
  } = useTooltip(t('Boost multiplier calculation does not include profit from ROTO staking pool'), {
    placement: 'top-end',
    tooltipOffset: [20, 10],
  })
  const theme = useTheme()

  return (
    <>
      <Text color="secondary" bold fontSize="12px" textTransform="uppercase" mt="24px" mb="8px">
        {t('Yield Booster')}
      </Text>

      <Toggle scale="md" checked={isShow} onClick={() => setIsShow(!isShow)} />
      {isShow && (
        <>
          <BRotoBlock style={{ marginTop: 24 }}>
            <Text color="secondary" bold fontSize="12px" textTransform="uppercase">
              {t('Roto locked')}
            </Text>
            <BalanceInput
              inputProps={{
                scale: 'sm',
              }}
              currencyValue={`${conversionValue} ${conversionUnit}`}
              // innerRef={balanceInputRef}
              placeholder="0.00"
              value={editingValue}
              unit={editingUnit}
              onUserInput={onUserInput}
              switchEditingUnits={toggleEditingCurrency}
              onFocus={onBalanceFocus}
            />
            <Flex justifyContent="space-between" mt="8px">
              <Button
                scale="xs"
                p="4px 16px"
                width="68px"
                variant="tertiary"
                onClick={() => setPrincipalFromUSDValue('100')}
              >
                $100
              </Button>
              <Button
                scale="xs"
                p="4px 16px"
                width="68px"
                variant="tertiary"
                onClick={() => setPrincipalFromUSDValue('1000')}
              >
                $1000
              </Button>
              <Button
                disabled={!account || isLoading || lockedAmount.eq(0)}
                scale="xs"
                p="4px 16px"
                width="128px"
                variant="tertiary"
                style={{ textTransform: 'uppercase' }}
                onClick={() =>
                  setPrincipalFromUSDValue(getBalanceNumber(lockedAmount.times(earningTokenPrice)).toFixed(2))
                }
              >
                {t('My Balance')}
              </Button>
              <span ref={myBalanceTargetRef}>
                <HelpIcon width="16px" height="16px" color="textSubtle" />
              </span>
              {myBalanceTooltipVisible && myBalanceTooltip}
            </Flex>
            <LockDurationField
              duration={duration}
              setDuration={setDuration}
              currentDuration={_toNumber(lockedEnd) - _toNumber(lockedStart)}
              isOverMax={false}
            />
          </BRotoBlock>
          <BRotoBlock style={{ marginTop: 16 }}>
            <Text color="secondary" bold fontSize="12px" textTransform="uppercase">
              <>{t('Boost Multiplier')}</>
            </Text>
            <Text color="text" bold fontSize="20px" textTransform="uppercase">
              <>{bRotoMultiplier}X</>
              {tooltipVisible && tooltip}
              <Box ref={targetRef} marginLeft="3px" display="inline-block" position="relative" top="3px">
                <HelpIcon color={theme.colors.textSubtle} />
              </Box>
            </Text>
            <Text color="textSubtle" fontSize={12}>
              {t(
                'The estimated boost multiplier is calculated using live data. The actual boost multiplier may change upon activation.',
              )}
            </Text>
          </BRotoBlock>
        </>
      )}
    </>
  )
}

export default BRotoCalculator

const CA = 0.5
const CB = 3 // TODO: read from SC later

export const getBRotoMultiplier = (
  userBalanceInFarm: BigNumber,
  userLockAmount: BigNumber,
  userLockDuration: number,
  totalLockAmount: BigNumber,
  lpBalanceOfFarm: BigNumber,
  averageLockDuration: number,
) => {
  const dB = userBalanceInFarm.times(CA)
  const aBPart1 = lpBalanceOfFarm.times(userLockAmount).times(userLockDuration)
  const aBPart3 = totalLockAmount.times(averageLockDuration)
  const aB = aBPart1.dividedBy(CB).dividedBy(aBPart3)
  const bigNumberResult = dB.plus(aB).gt(userBalanceInFarm)
    ? userBalanceInFarm.dividedBy(dB)
    : dB.plus(aB).dividedBy(dB)
  return bigNumberResult
}
