import { useState, useEffect } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Flex, Skeleton, Heading, Box, Text, Balance } from '@offsideswap/uikit'
import { useTranslation } from '@offsideswap/localization'
import { LotteryRound, LotteryRoundGraphEntity } from 'state/types'
import { usePriceRotoBusd } from 'state/farms/hooks'
import { useGetLotteryGraphDataById } from 'state/lottery/hooks'
import { getGraphLotteries } from 'state/lottery/getLotteriesData'
import { formatNumber, getBalanceNumber } from '@offsideswap/utils/formatBalance'
import RewardBrackets from '../RewardBrackets'

const NextDrawWrapper = styled(Flex)`
  background: ${({ theme }) => theme.colors.background};
  padding: 24px;
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
  }
`

const PreviousRoundCardFooter: React.FC<
  React.PropsWithChildren<{ lotteryNodeData: LotteryRound; lotteryId: string }>
> = ({ lotteryNodeData, lotteryId }) => {
  const { t } = useTranslation()
  const [fetchedLotteryGraphData, setFetchedLotteryGraphData] = useState<LotteryRoundGraphEntity>()
  const lotteryGraphDataFromState = useGetLotteryGraphDataById(lotteryId)
  const rotoPriceBusd = usePriceRotoBusd()

  useEffect(() => {
    const getGraphData = async () => {
      const fetchedGraphData = await getGraphLotteries(undefined, undefined, { id_in: [lotteryId] })
      setFetchedLotteryGraphData(fetchedGraphData[0])
    }
    if (!lotteryGraphDataFromState) {
      getGraphData()
    }
  }, [lotteryGraphDataFromState, lotteryId])

  let prizeInBusd = new BigNumber(NaN)
  if (lotteryNodeData) {
    const { amountCollectedInRoto } = lotteryNodeData
    prizeInBusd = amountCollectedInRoto.times(rotoPriceBusd)
  }

  const getTotalUsers = (): string => {
    if (!lotteryGraphDataFromState && fetchedLotteryGraphData) {
      return fetchedLotteryGraphData?.totalUsers?.toLocaleString()
    }

    if (lotteryGraphDataFromState) {
      return lotteryGraphDataFromState?.totalUsers?.toLocaleString()
    }

    return null
  }

  const getPrizeBalances = () => {
    return (
      <>
        {prizeInBusd.isNaN() ? (
          <Skeleton my="7px" height={40} width={200} />
        ) : (
          <Heading scale="xl" lineHeight="1" color="secondary">
            ~${formatNumber(getBalanceNumber(prizeInBusd), 0, 0)}
          </Heading>
        )}
        {prizeInBusd.isNaN() ? (
          <Skeleton my="2px" height={14} width={90} />
        ) : (
          <Balance
            fontSize="14px"
            color="textSubtle"
            unit=" ROTO"
            value={getBalanceNumber(lotteryNodeData?.amountCollectedInRoto)}
            decimals={0}
          />
        )}
      </>
    )
  }

  return (
    <NextDrawWrapper>
      <Flex mr="24px" flexDirection="column" justifyContent="space-between">
        <Box>
          <Heading>{t('Prize pot')}</Heading>
          {getPrizeBalances()}
        </Box>
        <Box mb="24px">
          <Flex>
            <Text fontSize="14px" display="inline">
              {t('Total players this round')}:{' '}
              {lotteryNodeData && (lotteryGraphDataFromState || fetchedLotteryGraphData) ? (
                getTotalUsers()
              ) : (
                <Skeleton height={14} width={31} />
              )}
            </Text>
          </Flex>
        </Box>
      </Flex>
      <RewardBrackets lotteryNodeData={lotteryNodeData} isHistoricRound />
    </NextDrawWrapper>
  )
}

export default PreviousRoundCardFooter
