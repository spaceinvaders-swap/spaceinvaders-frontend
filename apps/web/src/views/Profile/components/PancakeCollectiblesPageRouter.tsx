import { useRouter } from 'next/router'
import PageLoader from 'components/Loader/PageLoader'
import OffsideCollectibles from './OffsideCollectibles'

const OffsideCollectiblesPageRouter = () => {
  const router = useRouter()

  if (router.isFallback) {
    return <PageLoader />
  }

  return <OffsideCollectibles />
}

export default OffsideCollectiblesPageRouter
