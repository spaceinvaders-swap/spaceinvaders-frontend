import { useState, useEffect } from 'react'
import { Text, Flex, Skeleton, Image, Balance } from '@spaceinvaders-swap/uikit'
import { useFarmAuctionContract } from 'hooks/useContract'
import { useIntersectionObserver } from '@spaceinvaders-swap/hooks'
import { useTranslation } from '@spaceinvaders-swap/localization'
import { usePriceInvaBusd } from 'state/farms/hooks'
import { getBalanceNumber } from '@spaceinvaders-swap/utils/formatBalance'
import { ethersToBigNumber } from '@spaceinvaders-swap/utils/bigNumber'
import styled from 'styled-components'

const BurnedText = styled(Text)`
  font-size: 52px;

  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 64px;
  }
`

const AuctionInvaBurn: React.FC<React.PropsWithChildren> = () => {
  const [burnedInvaAmount, setBurnedInvaAmount] = useState(0)
  const { t } = useTranslation()
  const farmAuctionContract = useFarmAuctionContract(false)
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const invaPriceBusd = usePriceInvaBusd()

  const burnedAmountAsUSD = invaPriceBusd.times(burnedInvaAmount)

  useEffect(() => {
    const fetchBurnedInvaAmount = async () => {
      try {
        const amount = await farmAuctionContract.totalCollected()
        const amountAsBN = ethersToBigNumber(amount)
        setBurnedInvaAmount(getBalanceNumber(amountAsBN))
      } catch (error) {
        console.error('Failed to fetch burned auction inva', error)
      }
    }
    if (isIntersecting && burnedInvaAmount === 0) {
      fetchBurnedInvaAmount()
    }
  }, [isIntersecting, burnedInvaAmount, farmAuctionContract])
  return (
    <Flex flexDirection={['column-reverse', null, 'row']}>
      <Flex flexDirection="column" flex="2" ref={observerRef}>
        {burnedInvaAmount !== 0 ? (
          <Balance fontSize="64px" bold value={burnedInvaAmount} decimals={0} unit=" INVA" />
        ) : (
          <Skeleton width="256px" height="64px" />
        )}
        <BurnedText textTransform="uppercase" bold color="secondary">
          {t('Burned')}
        </BurnedText>
        <Text fontSize="24px" bold>
          {t('through community auctions so far!')}
        </Text>
        {!burnedAmountAsUSD.isNaN() && !burnedAmountAsUSD.isZero() ? (
          <Text color="textSubtle">
            ~${burnedAmountAsUSD.toNumber().toLocaleString('en', { maximumFractionDigits: 0 })}
          </Text>
        ) : (
          <Skeleton width="128px" />
        )}
      </Flex>
      <Image width={350} height={320} src="/images/burnt-inva.png" alt={t('Burnt INVA')} />
    </Flex>
  )
}

export default AuctionInvaBurn
