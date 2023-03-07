import { Flex, Pool, Text } from '@offsideswap/uikit'
import { useAccount } from 'wagmi'
import { useTranslation } from '@offsideswap/localization'
import { usePriceRotoBusd } from 'state/farms/hooks'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { VaultKey, DeserializedLockedVaultUser } from 'state/types'
import { Token } from '@offsideswap/sdk'
import { getRotoVaultEarnings } from 'views/Pools/helpers'
import RecentRotoProfitBalance from './RecentRotoProfitBalance'

const RecentRotoProfitCountdownRow = ({ pool }: { pool: Pool.DeserializedPool<Token> }) => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { pricePerFullShare, userData } = useVaultPoolByKey(pool.vaultKey)
  const rotoPriceBusd = usePriceRotoBusd()
  const { hasAutoEarnings, autoRotoToDisplay } = getRotoVaultEarnings(
    account,
    userData.rotoAtLastUserAction,
    userData.userShares,
    pricePerFullShare,
    rotoPriceBusd.toNumber(),
    pool.vaultKey === VaultKey.RotoVault
      ? (userData as DeserializedLockedVaultUser).currentPerformanceFee.plus(
          (userData as DeserializedLockedVaultUser).currentOverdueFee,
        )
      : null,
  )

  if (!(userData.userShares.gt(0) && account)) {
    return null
  }

  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Text fontSize="14px">{`${t('Recent ROTO profit')}:`}</Text>
      {hasAutoEarnings && <RecentRotoProfitBalance rotoToDisplay={autoRotoToDisplay} pool={pool} account={account} />}
    </Flex>
  )
}

export default RecentRotoProfitCountdownRow
