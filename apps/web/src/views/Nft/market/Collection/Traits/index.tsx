import { useRouter } from 'next/router'
import { isAddress } from 'utils'
import Container from 'components/Layout/Container'
import OffsideBunniesTraits from './OffsideBunniesTraits'
import { offsideBunniesAddress } from '../../constants'
import CollectionTraits from './CollectionTraits'

const Traits = () => {
  const collectionAddress = useRouter().query.collectionAddress as string

  return (
    <>
      <Container py="40px">
        {isAddress(collectionAddress) === offsideBunniesAddress ? (
          <OffsideBunniesTraits collectionAddress={collectionAddress} />
        ) : (
          <CollectionTraits collectionAddress={collectionAddress} />
        )}
      </Container>
    </>
  )
}

export default Traits
