import BigNumber from 'bignumber.js'
import { Flex, Skeleton, Text, Balance } from '@offsideswap/uikit'
import { useTranslation } from '@offsideswap/localization'
import { usePriceRotoBusd } from 'state/farms/hooks'
import { getBalanceNumber, getFullDisplayBalance } from '@offsideswap/utils/formatBalance'

interface RewardBracketDetailProps {
  rotoAmount: BigNumber
  rewardBracket?: number
  numberWinners?: string
  isBurn?: boolean
  isHistoricRound?: boolean
  isLoading?: boolean
}

const RewardBracketDetail: React.FC<React.PropsWithChildren<RewardBracketDetailProps>> = ({
  rewardBracket,
  rotoAmount,
  numberWinners,
  isHistoricRound,
  isBurn,
  isLoading,
}) => {
  const { t } = useTranslation()
  const rotoPriceBusd = usePriceRotoBusd()

  const getRewardText = () => {
    const numberMatch = rewardBracket + 1
    if (isBurn) {
      return t('Burn')
    }
    if (rewardBracket === 5) {
      return t('Match all %numberMatch%', { numberMatch })
    }
    return t('Match first %numberMatch%', { numberMatch })
  }

  return (
    <Flex flexDirection="column">
      {isLoading ? (
        <Skeleton mb="4px" mt="8px" height={16} width={80} />
      ) : (
        <Text bold color={isBurn ? 'failure' : 'secondary'}>
          {getRewardText()}
        </Text>
      )}
      <>
        {isLoading || rotoAmount.isNaN() ? (
          <Skeleton my="4px" mr="10px" height={20} width={110} />
        ) : (
          <Balance fontSize="20px" bold unit=" ROTO" value={getBalanceNumber(rotoAmount)} decimals={0} />
        )}
        {isLoading || rotoAmount.isNaN() ? (
          <>
            <Skeleton mt="4px" mb="16px" height={12} width={70} />
          </>
        ) : (
          <Balance
            fontSize="12px"
            color="textSubtle"
            prefix="~$"
            value={getBalanceNumber(rotoAmount.times(rotoPriceBusd))}
            decimals={0}
          />
        )}
        {isHistoricRound && rotoAmount && (
          <>
            {numberWinners !== '0' && (
              <Text fontSize="12px" color="textSubtle">
                {getFullDisplayBalance(rotoAmount.div(parseInt(numberWinners, 10)), 18, 2)} ROTO {t('each')}
              </Text>
            )}
            <Text fontSize="12px" color="textSubtle">
              {numberWinners} {t('Winning Tickets')}
            </Text>
          </>
        )}
      </>
    </Flex>
  )
}

export default RewardBracketDetail
