import { useMemo } from 'react'
import { useTranslation } from '@offsideswap/localization'
import { Flex, Box, Text, Balance } from '@offsideswap/uikit'
import { usePriceRotoBusd } from 'state/farms/hooks'
import BigNumber from 'bignumber.js'
import { getBalanceNumber } from '@offsideswap/utils/formatBalance'
import { PotteryWithdrawAbleData } from 'state/types'
import WithdrawButton from 'views/Pottery/components/Pot/Claim/WithdrawButton'
import { calculateRotoAmount } from 'views/Pottery/helpers'
import { getDrawnDate } from 'views/Lottery/helpers'
import { addDays } from 'date-fns'

interface AvailableWithdrawProps {
  withdrawData: PotteryWithdrawAbleData
}

const AvailableWithdraw: React.FC<React.PropsWithChildren<AvailableWithdrawProps>> = ({ withdrawData }) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const rotoPriceBusd = usePriceRotoBusd()
  const { previewRedeem, lockedDate, shares, status, potteryVaultAddress, totalSupply, totalLockRoto, balanceOf } =
    withdrawData

  const rotoNumber = useMemo(() => new BigNumber(previewRedeem), [previewRedeem])
  const amountAsBn = calculateRotoAmount({
    status,
    previewRedeem,
    shares,
    totalSupply: new BigNumber(totalSupply),
    totalLockRoto: new BigNumber(totalLockRoto),
  })

  const amount = getBalanceNumber(amountAsBn)
  const amountInBusd = new BigNumber(amount).times(rotoPriceBusd).toNumber()

  const lockDate = useMemo(() => getDrawnDate(locale, lockedDate?.toString()), [lockedDate, locale])
  const withdrawableDate = addDays(new Date(parseInt(lockedDate, 10) * 1000), 70).getTime()
  const withdrawableDateStr = useMemo(
    () => getDrawnDate(locale, (withdrawableDate / 1000).toString()),
    [withdrawableDate, locale],
  )

  return (
    <Box>
      <Text fontSize="12px" color="secondary" bold as="span" textTransform="uppercase">
        {t('stake withdrawal')}
      </Text>
      <Flex mb="11px">
        <Box>
          <Balance fontSize="20px" lineHeight="110%" value={amount} decimals={2} bold />
          <Balance fontSize="12px" lineHeight="110%" color="textSubtle" value={amountInBusd} decimals={2} unit=" USD" />
          {lockedDate && (
            <>
              <Text fontSize="10px" lineHeight="110%" color="textSubtle">
                {t('Deposited %date%', { date: lockDate })}
              </Text>
              <Text fontSize="10px" lineHeight="110%" color="textSubtle">
                {t('Withdrawable on %date%', { date: withdrawableDateStr })}
              </Text>
            </>
          )}
        </Box>
        <WithdrawButton
          status={status}
          rotoNumber={rotoNumber}
          redeemShare={shares}
          potteryVaultAddress={potteryVaultAddress}
          balanceOf={balanceOf}
        />
      </Flex>
    </Box>
  )
}

export default AvailableWithdraw
