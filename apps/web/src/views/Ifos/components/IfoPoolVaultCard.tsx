import { useMemo } from 'react'
import { Flex, useMatchBreakpoints, Pool } from '@spaceinvaders-swap/uikit'
import InvaVaultCard from 'views/Pools/components/InvaVaultCard'
import { usePoolsWithVault } from 'state/pools/hooks'
import { Token } from '@spaceinvaders-swap/sdk'
import IfoPoolVaultCardMobile from './IfoPoolVaultCardMobile'
import IfoVesting from './IfoVesting/index'

const IfoPoolVaultCard = () => {
  const { isXl, isLg, isMd, isXs, isSm } = useMatchBreakpoints()
  const isSmallerThanXl = isXl || isLg || isMd || isXs || isSm
  const { pools } = usePoolsWithVault()
  const invaPool = useMemo(
    () => pools.find((pool) => pool.userData && pool.sousId === 0),
    [pools],
  ) as Pool.DeserializedPool<Token>

  return (
    <Flex width="100%" maxWidth={400} alignItems="center" flexDirection="column">
      {isSmallerThanXl ? (
        <IfoPoolVaultCardMobile pool={invaPool} />
      ) : (
        <InvaVaultCard pool={invaPool} showSkeleton={false} showStakedOnly={false} showIInva />
      )}
      <IfoVesting pool={invaPool} />
    </Flex>
  )
}

export default IfoPoolVaultCard
