import { Text, Box, Pool } from '@offsideswap/uikit'
import { useTranslation } from '@offsideswap/localization'
import { differenceInHours } from 'date-fns'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { VaultKey, DeserializedLockedVaultUser } from 'state/types'
import { Token } from '@offsideswap/sdk'
import { getRotoVaultEarnings } from '../helpers'

interface AutoEarningsBreakdownProps {
  pool: Pool.DeserializedPool<Token>
  account: string
}

const AutoEarningsBreakdown: React.FC<React.PropsWithChildren<AutoEarningsBreakdownProps>> = ({ pool, account }) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const { earningTokenPrice } = pool
  const { pricePerFullShare, userData } = useVaultPoolByKey(pool.vaultKey)
  const { autoRotoToDisplay, autoUsdToDisplay } = getRotoVaultEarnings(
    account,
    userData.rotoAtLastUserAction,
    userData.userShares,
    pricePerFullShare,
    earningTokenPrice,
    pool.vaultKey === VaultKey.RotoVault
      ? (userData as DeserializedLockedVaultUser).currentPerformanceFee
          .plus((userData as DeserializedLockedVaultUser).currentOverdueFee)
          .plus((userData as DeserializedLockedVaultUser).userBoostedShare)
      : null,
  )

  const lastActionInMs = userData.lastUserActionTime ? parseInt(userData.lastUserActionTime) * 1000 : 0
  const hourDiffSinceLastAction = differenceInHours(Date.now(), lastActionInMs)
  const earnedRotoPerHour = hourDiffSinceLastAction ? autoRotoToDisplay / hourDiffSinceLastAction : 0
  const earnedUsdPerHour = hourDiffSinceLastAction ? autoUsdToDisplay / hourDiffSinceLastAction : 0

  return (
    <>
      <Text>{t('Earned since your last action')}:</Text>
      <Text bold>
        {new Date(lastActionInMs).toLocaleString(locale, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })}
      </Text>
      {hourDiffSinceLastAction ? (
        <Box mt="12px">
          <Text>{t('Hourly Average')}:</Text>
          <Text bold>
            {earnedRotoPerHour < 0.01 ? '<0.01' : earnedRotoPerHour.toFixed(2)} ROTO
            <Text display="inline-block" ml="5px">
              ({earnedUsdPerHour < 0.01 ? '<0.01' : `~${earnedUsdPerHour.toFixed(2)}`} USD)
            </Text>
          </Text>
        </Box>
      ) : null}
    </>
  )
}

export default AutoEarningsBreakdown
