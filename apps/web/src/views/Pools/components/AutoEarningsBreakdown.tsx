import { Text, Box, Pool } from '@spaceinvaders-swap/uikit'
import { useTranslation } from '@spaceinvaders-swap/localization'
import { differenceInHours } from 'date-fns'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { VaultKey, DeserializedLockedVaultUser } from 'state/types'
import { Token } from '@spaceinvaders-swap/sdk'
import { getInvaVaultEarnings } from '../helpers'

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
  const { autoInvaToDisplay, autoUsdToDisplay } = getInvaVaultEarnings(
    account,
    userData.invaAtLastUserAction,
    userData.userShares,
    pricePerFullShare,
    earningTokenPrice,
    pool.vaultKey === VaultKey.InvaVault
      ? (userData as DeserializedLockedVaultUser).currentPerformanceFee
          .plus((userData as DeserializedLockedVaultUser).currentOverdueFee)
          .plus((userData as DeserializedLockedVaultUser).userBoostedShare)
      : null,
  )

  const lastActionInMs = userData.lastUserActionTime ? parseInt(userData.lastUserActionTime) * 1000 : 0
  const hourDiffSinceLastAction = differenceInHours(Date.now(), lastActionInMs)
  const earnedInvaPerHour = hourDiffSinceLastAction ? autoInvaToDisplay / hourDiffSinceLastAction : 0
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
            {earnedInvaPerHour < 0.01 ? '<0.01' : earnedInvaPerHour.toFixed(2)} INVA
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
