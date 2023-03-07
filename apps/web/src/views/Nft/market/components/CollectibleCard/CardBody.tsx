import { Box, CardBody, Flex, Text } from '@offsideswap/uikit'
import { useTranslation } from '@offsideswap/localization'
import { useBNBBusdPrice } from 'hooks/useBUSDPrice'
import { isAddress } from 'utils'
import PreviewImage from './PreviewImage'
import { CostLabel, LowestPriceMetaRow, MetaRow } from './styles'
import LocationTag from './LocationTag'
import { CollectibleCardProps } from './types'
import { useGetLowestPriceFromNft } from '../../hooks/useGetLowestPrice'
import { offsideBunniesAddress } from '../../constants'
import NFTMedia from '../NFTMedia'

const CollectibleCardBody: React.FC<React.PropsWithChildren<CollectibleCardProps>> = ({
  nft,
  nftLocation,
  currentAskPrice,
  isUserNft,
}) => {
  const { t } = useTranslation()
  const { name } = nft
  const bnbBusdPrice = useBNBBusdPrice()
  const isOffsideBunny = isAddress(nft.collectionAddress) === offsideBunniesAddress
  const { isFetching, lowestPrice } = useGetLowestPriceFromNft(nft)

  return (
    <CardBody p="8px">
      <NFTMedia as={PreviewImage} nft={nft} height={320} width={320} mb="8px" borderRadius="8px" />
      <Flex alignItems="center" justifyContent="space-between">
        {nft?.collectionName && (
          <Text fontSize="12px" color="textSubtle" mb="8px">
            {nft?.collectionName}
          </Text>
        )}
        {nftLocation && <LocationTag nftLocation={nftLocation} />}
      </Flex>
      <Text as="h4" fontWeight="600" mb="8px">
        {name}
      </Text>
      <Box borderTop="1px solid" borderTopColor="cardBorder" pt="8px">
        {isOffsideBunny && (
          <LowestPriceMetaRow lowestPrice={lowestPrice} isFetching={isFetching} bnbBusdPrice={bnbBusdPrice} />
        )}
        {currentAskPrice && (
          <MetaRow title={isUserNft ? t('Your price') : t('Asking price')}>
            <CostLabel cost={currentAskPrice} bnbBusdPrice={bnbBusdPrice} />
          </MetaRow>
        )}
      </Box>
    </CardBody>
  )
}

export default CollectibleCardBody
