import { useState, useEffect } from 'react'
import { Text, Flex, Skeleton, Image, Balance } from '@offsideswap/uikit'
import { useFarmAuctionContract } from 'hooks/useContract'
import { useIntersectionObserver } from '@offsideswap/hooks'
import { useTranslation } from '@offsideswap/localization'
import { usePriceRotoBusd } from 'state/farms/hooks'
import { getBalanceNumber } from '@offsideswap/utils/formatBalance'
import { ethersToBigNumber } from '@offsideswap/utils/bigNumber'
import styled from 'styled-components'

const BurnedText = styled(Text)`
  font-size: 52px;

  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 64px;
  }
`

const AuctionRotoBurn: React.FC<React.PropsWithChildren> = () => {
  const [burnedRotoAmount, setBurnedRotoAmount] = useState(0)
  const { t } = useTranslation()
  const farmAuctionContract = useFarmAuctionContract(false)
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const rotoPriceBusd = usePriceRotoBusd()

  const burnedAmountAsUSD = rotoPriceBusd.times(burnedRotoAmount)

  useEffect(() => {
    const fetchBurnedRotoAmount = async () => {
      try {
        const amount = await farmAuctionContract.totalCollected()
        const amountAsBN = ethersToBigNumber(amount)
        setBurnedRotoAmount(getBalanceNumber(amountAsBN))
      } catch (error) {
        console.error('Failed to fetch burned auction roto', error)
      }
    }
    if (isIntersecting && burnedRotoAmount === 0) {
      fetchBurnedRotoAmount()
    }
  }, [isIntersecting, burnedRotoAmount, farmAuctionContract])
  return (
    <Flex flexDirection={['column-reverse', null, 'row']}>
      <Flex flexDirection="column" flex="2" ref={observerRef}>
        {burnedRotoAmount !== 0 ? (
          <Balance fontSize="64px" bold value={burnedRotoAmount} decimals={0} unit=" ROTO" />
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
      <Image width={350} height={320} src="/images/burnt-roto.png" alt={t('Burnt ROTO')} />
    </Flex>
  )
}

export default AuctionRotoBurn
