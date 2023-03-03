import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { ArrowForwardIcon, Button, Flex, Heading, Skeleton, Text, NextLinkFromReactRouter } from '@spaceinvaders-swap/uikit'
import { useTranslation } from '@spaceinvaders-swap/localization'
import { formatLocalisedCompactNumber } from '@spaceinvaders-swap/utils/formatBalance'
import { useIntersectionObserver } from '@spaceinvaders-swap/hooks'
import { getTotalWon } from 'state/predictions/helpers'
import { useBNBBusdPrice, useInvaBusdPrice } from 'hooks/useBUSDPrice'
import { multiplyPriceByAmount } from 'utils/prices'
import useSWR from 'swr'
import { SLOW_INTERVAL } from 'config/constants'

const StyledLink = styled(NextLinkFromReactRouter)`
  width: 100%;
`

const PredictionCardHeader: React.FC<React.PropsWithChildren<{ preText: string; won: string }>> = ({
  preText,
  won,
}) => {
  return (
    <Heading color="#280D5F" my="8px" scale="xl" bold>
      {preText}
      {won}
    </Heading>
  )
}

const PredictionCardContent = () => {
  const { t } = useTranslation()
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const [loadData, setLoadData] = useState(false)
  const bnbBusdPrice = useBNBBusdPrice({ forceMainnet: true })
  const invaPriceBusd = useInvaBusdPrice({ forceMainnet: true })

  const { data } = useSWR(loadData ? ['prediction', 'tokenWon'] : null, getTotalWon, {
    refreshInterval: SLOW_INTERVAL,
  })

  const bnbWonInUsd = multiplyPriceByAmount(bnbBusdPrice, data?.totalWonBNB || 0)
  const invaWonInUsd = multiplyPriceByAmount(invaPriceBusd, data?.totalWonINVA || 0)

  const localisedBnbUsdString = formatLocalisedCompactNumber(bnbWonInUsd + invaWonInUsd)
  const bnbWonText = t('$%wonInUsd% in BNB + INVA won so far', { wonInUsd: localisedBnbUsdString })
  const [pretext, wonSoFar] = bnbWonText.split(localisedBnbUsdString)

  useEffect(() => {
    if (isIntersecting) {
      setLoadData(true)
    }
  }, [isIntersecting])

  return (
    <>
      <Flex flexDirection="column" mt="48px">
        <Text color="#280D5F" bold fontSize="16px">
          {t('Prediction')}
        </Text>
        {bnbWonInUsd ? (
          <PredictionCardHeader preText={pretext} won={localisedBnbUsdString} />
        ) : (
          <>
            <Skeleton width={230} height={40} my="8px" />
            <div ref={observerRef} />
          </>
        )}
        <Text color="#280D5F" mb="24px" bold fontSize="16px">
          {wonSoFar}
        </Text>
        <Text color="#280D5F" mb="40px">
          {t('Predict the price trend of BNB or INVA to win')}
        </Text>
      </Flex>
      <Flex alignItems="center" justifyContent="center">
        <StyledLink to="/prediction" id="homepage-prediction-cta">
          <Button width="100%">
            <Text bold color="invertedContrast">
              {t('Play')}
            </Text>
            <ArrowForwardIcon ml="4px" color="invertedContrast" />
          </Button>
        </StyledLink>
      </Flex>
    </>
  )
}

export default PredictionCardContent
