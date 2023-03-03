import { useRouter } from 'next/router'
import { isAddress } from 'utils'
import Container from 'components/Layout/Container'
import SpaceinvadersBunniesTraits from './SpaceinvadersBunniesTraits'
import { spaceinvadersBunniesAddress } from '../../constants'
import CollectionTraits from './CollectionTraits'

const Traits = () => {
  const collectionAddress = useRouter().query.collectionAddress as string

  return (
    <>
      <Container py="40px">
        {isAddress(collectionAddress) === spaceinvadersBunniesAddress ? (
          <SpaceinvadersBunniesTraits collectionAddress={collectionAddress} />
        ) : (
          <CollectionTraits collectionAddress={collectionAddress} />
        )}
      </Container>
    </>
  )
}

export default Traits
