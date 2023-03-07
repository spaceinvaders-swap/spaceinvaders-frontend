import { useMemo } from 'react'
import { Flex, useMatchBreakpoints, Pool } from '@offsideswap/uikit'
import RotoVaultCard from 'views/Pools/components/RotoVaultCard'
import { usePoolsWithVault } from 'state/pools/hooks'
import { Token } from '@offsideswap/sdk'
import IfoPoolVaultCardMobile from './IfoPoolVaultCardMobile'
import IfoVesting from './IfoVesting/index'

const IfoPoolVaultCard = () => {
  const { isXl, isLg, isMd, isXs, isSm } = useMatchBreakpoints()
  const isSmallerThanXl = isXl || isLg || isMd || isXs || isSm
  const { pools } = usePoolsWithVault()
  const rotoPool = useMemo(
    () => pools.find((pool) => pool.userData && pool.sousId === 0),
    [pools],
  ) as Pool.DeserializedPool<Token>

  return (
    <Flex width="100%" maxWidth={400} alignItems="center" flexDirection="column">
      {isSmallerThanXl ? (
        <IfoPoolVaultCardMobile pool={rotoPool} />
      ) : (
        <RotoVaultCard pool={rotoPool} showSkeleton={false} showStakedOnly={false} showIRoto />
      )}
      <IfoVesting pool={rotoPool} />
    </Flex>
  )
}

export default IfoPoolVaultCard
