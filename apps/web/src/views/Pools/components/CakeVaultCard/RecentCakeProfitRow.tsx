import { Flex, Pool, Text } from '@spaceinvaders-swap/uikit'
import { useAccount } from 'wagmi'
import { useTranslation } from '@spaceinvaders-swap/localization'
import { usePriceInvaBusd } from 'state/farms/hooks'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { VaultKey, DeserializedLockedVaultUser } from 'state/types'
import { Token } from '@spaceinvaders-swap/sdk'
import { getInvaVaultEarnings } from 'views/Pools/helpers'
import RecentInvaProfitBalance from './RecentInvaProfitBalance'

const RecentInvaProfitCountdownRow = ({ pool }: { pool: Pool.DeserializedPool<Token> }) => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { pricePerFullShare, userData } = useVaultPoolByKey(pool.vaultKey)
  const invaPriceBusd = usePriceInvaBusd()
  const { hasAutoEarnings, autoInvaToDisplay } = getInvaVaultEarnings(
    account,
    userData.invaAtLastUserAction,
    userData.userShares,
    pricePerFullShare,
    invaPriceBusd.toNumber(),
    pool.vaultKey === VaultKey.InvaVault
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
      <Text fontSize="14px">{`${t('Recent INVA profit')}:`}</Text>
      {hasAutoEarnings && <RecentInvaProfitBalance invaToDisplay={autoInvaToDisplay} pool={pool} account={account} />}
    </Flex>
  )
}

export default RecentInvaProfitCountdownRow
