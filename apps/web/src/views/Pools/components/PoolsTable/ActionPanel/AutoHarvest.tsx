import { Text, Flex, Skeleton, Heading, Box, useMatchBreakpoints, BalanceWithLoading, Pool } from '@spaceinvaders-swap/uikit'
import { useAccount } from 'wagmi'
import { getInvaVaultEarnings } from 'views/Pools/helpers'
import { useTranslation } from '@spaceinvaders-swap/localization'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { VaultKey, DeserializedLockedInvaVault } from 'state/types'
import { getVaultPosition, VaultPosition } from 'utils/invaPool'
import { useVaultApy } from 'hooks/useVaultApy'
import { Token } from '@spaceinvaders-swap/sdk'

import { ActionContainer, ActionTitles, ActionContent, RowActionContainer } from './styles'
import UnstakingFeeCountdownRow from '../../InvaVaultCard/UnstakingFeeCountdownRow'
import useUserDataInVaultPresenter from '../../LockedPool/hooks/useUserDataInVaultPresenter'

const AutoHarvestAction: React.FunctionComponent<React.PropsWithChildren<Pool.DeserializedPool<Token>>> = ({
  userDataLoaded,
  earningTokenPrice,
  vaultKey,
}) => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { isMobile } = useMatchBreakpoints()

  const vaultData = useVaultPoolByKey(vaultKey)
  const {
    userData: { userShares, invaAtLastUserAction },
    pricePerFullShare,
  } = vaultData
  const { hasAutoEarnings, autoInvaToDisplay, autoUsdToDisplay } = getInvaVaultEarnings(
    account,
    invaAtLastUserAction,
    userShares,
    pricePerFullShare,
    earningTokenPrice,
    vaultKey === VaultKey.InvaVault
      ? (vaultData as DeserializedLockedInvaVault).userData.currentPerformanceFee
          .plus((vaultData as DeserializedLockedInvaVault).userData.currentOverdueFee)
          .plus((vaultData as DeserializedLockedInvaVault).userData.userBoostedShare)
      : null,
  )

  const { secondDuration, weekDuration } = useUserDataInVaultPresenter({
    lockStartTime:
      vaultKey === VaultKey.InvaVault ? (vaultData as DeserializedLockedInvaVault).userData?.lockStartTime ?? '0' : '0',
    lockEndTime:
      vaultKey === VaultKey.InvaVault ? (vaultData as DeserializedLockedInvaVault).userData?.lockEndTime ?? '0' : '0',
  })

  const { boostFactor } = useVaultApy({ duration: secondDuration })

  const vaultPosition = getVaultPosition(vaultData.userData)

  const actionTitle = (
    <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
      {t('Recent INVA profit')}
    </Text>
  )

  if (!account) {
    return (
      <ActionContainer>
        <ActionTitles>{actionTitle}</ActionTitles>
        <ActionContent>
          <Heading>0</Heading>
        </ActionContent>
      </ActionContainer>
    )
  }

  if (!userDataLoaded) {
    return (
      <ActionContainer>
        <ActionTitles>{actionTitle}</ActionTitles>
        <ActionContent>
          <Skeleton width={180} height="32px" marginTop={14} />
        </ActionContent>
      </ActionContainer>
    )
  }

  return (
    <RowActionContainer justifyContent="space-between">
      <Box width="100%">
        <ActionTitles>{actionTitle}</ActionTitles>
        <ActionContent>
          <Flex flex="1" flexDirection="column" alignSelf="flex-start">
            <>
              {hasAutoEarnings ? (
                <>
                  <BalanceWithLoading lineHeight="1" bold fontSize="20px" decimals={5} value={autoInvaToDisplay} />
                  {Number.isFinite(earningTokenPrice) && earningTokenPrice > 0 && (
                    <BalanceWithLoading
                      display="inline"
                      fontSize="12px"
                      color="textSubtle"
                      decimals={2}
                      prefix="~"
                      value={autoUsdToDisplay}
                      unit=" USD"
                    />
                  )}
                </>
              ) : (
                <>
                  <Heading color="textDisabled">0</Heading>
                  <Text fontSize="12px" color="textDisabled">
                    0 USD
                  </Text>
                </>
              )}
            </>
          </Flex>
          <Flex flex="1.3" flexDirection="column" alignSelf="flex-start" alignItems="flex-start">
            {[VaultPosition.Flexible, VaultPosition.None].includes(vaultPosition) && (
              <UnstakingFeeCountdownRow vaultKey={vaultKey} isTableVariant />
            )}
            {/* IFO credit here */}
          </Flex>
        </ActionContent>
      </Box>
      {!isMobile && vaultKey === VaultKey.InvaVault && (vaultData as DeserializedLockedInvaVault).userData.locked && (
        <Box minWidth="123px">
          <ActionTitles>
            <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
              {t('Yield boost')}
            </Text>
          </ActionTitles>
          <ActionContent>
            <Flex flex="1" flexDirection="column" alignSelf="flex-start">
              <BalanceWithLoading
                color="text"
                lineHeight="1"
                bold
                fontSize="20px"
                value={boostFactor ? boostFactor?.toString() : '0'}
                decimals={2}
                unit="x"
              />
              <Text fontSize="12px" color="textSubtle">
                {t('Lock for %duration%', { duration: weekDuration })}
              </Text>
            </Flex>
          </ActionContent>
        </Box>
      )}
    </RowActionContainer>
  )
}

export default AutoHarvestAction
