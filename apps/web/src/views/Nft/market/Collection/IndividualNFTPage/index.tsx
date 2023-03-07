import { useRouter } from 'next/router'
import PageLoader from 'components/Loader/PageLoader'
import { isAddress } from 'utils'
import { offsideBunniesAddress } from '../../constants'
import IndividualOffsideBunnyPage from './OffsideBunnyPage'
import IndividualNFTPage from './OneOfAKindNftPage'

const IndividualNFTPageRouter = () => {
  const router = useRouter()
  // For OffsideBunnies tokenId in url is really bunnyId
  const { collectionAddress, tokenId } = router.query

  if (router.isFallback) {
    return <PageLoader />
  }

  const isPBCollection = isAddress(String(collectionAddress)) === offsideBunniesAddress
  if (isPBCollection) {
    return <IndividualOffsideBunnyPage bunnyId={String(tokenId)} />
  }

  return <IndividualNFTPage collectionAddress={String(collectionAddress)} tokenId={String(tokenId)} />
}

export default IndividualNFTPageRouter
