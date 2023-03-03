import { useRouter } from 'next/router'
import PageLoader from 'components/Loader/PageLoader'
import SpaceinvadersCollectibles from './SpaceinvadersCollectibles'

const SpaceinvadersCollectiblesPageRouter = () => {
  const router = useRouter()

  if (router.isFallback) {
    return <PageLoader />
  }

  return <SpaceinvadersCollectibles />
}

export default SpaceinvadersCollectiblesPageRouter
