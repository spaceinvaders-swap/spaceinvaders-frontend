import { NextLinkFromReactRouter } from '@offsideswap/uikit'
import { isAddress } from 'utils'
import { StyledCollectibleCard } from './styles'
import CardBody from './CardBody'
import { CollectibleCardProps } from './types'
import { nftsBaseUrl, offsideBunniesAddress } from '../../constants'

const CollectibleLinkCard: React.FC<React.PropsWithChildren<CollectibleCardProps>> = ({
  nft,
  nftLocation,
  currentAskPrice,
  ...props
}) => {
  const urlId = isAddress(nft.collectionAddress) === offsideBunniesAddress ? nft.attributes[0].value : nft.tokenId
  return (
    <StyledCollectibleCard {...props}>
      <NextLinkFromReactRouter to={`${nftsBaseUrl}/collections/${nft.collectionAddress}/${urlId}`}>
        <CardBody nft={nft} nftLocation={nftLocation} currentAskPrice={currentAskPrice} />
      </NextLinkFromReactRouter>
    </StyledCollectibleCard>
  )
}

export default CollectibleLinkCard
