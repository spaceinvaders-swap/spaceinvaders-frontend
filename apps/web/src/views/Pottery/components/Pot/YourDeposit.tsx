import { Box, Text, Skeleton, Balance } from '@spaceinvaders-swap/uikit'
import BigNumber from 'bignumber.js'
import { useAccount } from 'wagmi'
import { useTranslation } from '@spaceinvaders-swap/localization'
import { usePriceInvaBusd } from 'state/farms/hooks'
import { usePotteryData } from 'state/pottery/hook'
import { getBalanceAmount } from '@spaceinvaders-swap/utils/formatBalance'

interface YourDepositProps {
  depositBalance?: any
}

const YourDeposit: React.FC<React.PropsWithChildren<YourDepositProps>> = ({ depositBalance }) => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const invaPriceBusd = usePriceInvaBusd()
  const { userData } = usePotteryData()
  const totalDepositBalance = getBalanceAmount(depositBalance).toNumber()
  const balanceInBusd = new BigNumber(totalDepositBalance).times(invaPriceBusd).toNumber()

  return (
    <Box>
      <Box mb="4px">
        <Text fontSize="12px" color="textSubtle" bold as="span" textTransform="uppercase">
          {t('Your')}
        </Text>
        <Text fontSize="12px" color="secondary" bold as="span" ml="4px" textTransform="uppercase">
          {t('Deposit')}
        </Text>
      </Box>
      {account && userData.isLoading ? (
        <>
          <Skeleton width="100px" height="35px" />
          <Skeleton width="40px" height="18px" />
        </>
      ) : (
        <>
          <Balance
            bold
            decimals={3}
            fontSize={['20px', '20px', '24px']}
            lineHeight="110%"
            value={totalDepositBalance}
          />
          <Balance prefix="~" unit=" USD" decimals={2} value={balanceInBusd || 0} fontSize="12px" color="textSubtle" />
        </>
      )}
    </Box>
  )
}

export default YourDeposit
