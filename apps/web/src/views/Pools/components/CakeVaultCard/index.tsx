import { Box, CardBody, CardProps, Flex, Text, TokenPairImage, FlexGap, Skeleton, Pool } from '@spaceinvaders-swap/uikit'
import { useAccount } from 'wagmi'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { vaultPoolConfig } from 'config/constants/pools'
import { useTranslation } from '@spaceinvaders-swap/localization'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { VaultKey, DeserializedLockedInvaVault, DeserializedInvaVault } from 'state/types'
import styled from 'styled-components'
import { Token } from '@spaceinvaders-swap/sdk'

import CardFooter from '../PoolCard/CardFooter'
import { VaultPositionTagWithLabel } from '../Vault/VaultPositionTag'
import UnstakingFeeCountdownRow from './UnstakingFeeCountdownRow'
import RecentInvaProfitRow from './RecentInvaProfitRow'
import { StakingApy } from './StakingApy'
import VaultCardActions from './VaultCardActions'
import LockedStakingApy from '../LockedPool/LockedStakingApy'

const StyledCardBody = styled(CardBody)<{ isLoading: boolean }>`
  min-height: ${({ isLoading }) => (isLoading ? '0' : '254px')};
`

interface InvaVaultProps extends CardProps {
  pool: Pool.DeserializedPool<Token>
  showStakedOnly: boolean
  defaultFooterExpanded?: boolean
  showIInva?: boolean
  showSkeleton?: boolean
}

interface InvaVaultDetailProps {
  isLoading?: boolean
  account: string
  pool: Pool.DeserializedPool<Token>
  vaultPool: DeserializedInvaVault
  accountHasSharesStaked: boolean
  defaultFooterExpanded?: boolean
  showIInva?: boolean
  performanceFeeAsDecimal: number
}

export const InvaVaultDetail: React.FC<React.PropsWithChildren<InvaVaultDetailProps>> = ({
  isLoading = false,
  account,
  pool,
  vaultPool,
  accountHasSharesStaked,
  showIInva,
  performanceFeeAsDecimal,
  defaultFooterExpanded,
}) => {
  const { t } = useTranslation()

  const isLocked = (vaultPool as DeserializedLockedInvaVault).userData.locked

  return (
    <>
      <StyledCardBody isLoading={isLoading}>
        {account && pool.vaultKey === VaultKey.InvaVault && (
          <VaultPositionTagWithLabel userData={(vaultPool as DeserializedLockedInvaVault).userData} />
        )}
        {account && pool.vaultKey === VaultKey.InvaVault && isLocked ? (
          <LockedStakingApy
            userData={(vaultPool as DeserializedLockedInvaVault).userData}
            stakingToken={pool?.stakingToken}
            stakingTokenBalance={pool?.userData?.stakingTokenBalance}
            showIInva={showIInva}
          />
        ) : (
          <>
            <StakingApy pool={pool} />
            <FlexGap mt="16px" gap="24px" flexDirection={accountHasSharesStaked ? 'column-reverse' : 'column'}>
              <Box>
                {account && (
                  <Box mb="8px">
                    <UnstakingFeeCountdownRow vaultKey={pool.vaultKey} />
                  </Box>
                )}
                <RecentInvaProfitRow pool={pool} />
              </Box>
              <Flex flexDirection="column">
                {account ? (
                  <VaultCardActions
                    pool={pool}
                    accountHasSharesStaked={accountHasSharesStaked}
                    isLoading={isLoading}
                    performanceFee={performanceFeeAsDecimal}
                  />
                ) : (
                  <>
                    <Text mb="10px" textTransform="uppercase" fontSize="12px" color="textSubtle" bold>
                      {t('Start earning')}
                    </Text>
                    <ConnectWalletButton />
                  </>
                )}
              </Flex>
            </FlexGap>
          </>
        )}
      </StyledCardBody>
      <CardFooter isLocked={isLocked} defaultExpanded={defaultFooterExpanded} pool={pool} account={account} />
    </>
  )
}

const InvaVaultCard: React.FC<React.PropsWithChildren<InvaVaultProps>> = ({
  pool,
  showStakedOnly,
  defaultFooterExpanded,
  showIInva = false,
  showSkeleton = true,
  ...props
}) => {
  const { address: account } = useAccount()

  const vaultPool = useVaultPoolByKey(pool.vaultKey)
  const { totalStaked } = pool

  const {
    userData: { userShares, isLoading: isVaultUserDataLoading },
    fees: { performanceFeeAsDecimal },
  } = vaultPool

  const accountHasSharesStaked = userShares && userShares.gt(0)
  const isLoading = !pool.userData || isVaultUserDataLoading

  if (showStakedOnly && !accountHasSharesStaked) {
    return null
  }

  return (
    <Pool.StyledCard isActive {...props}>
      <Pool.PoolCardHeader isStaking={accountHasSharesStaked}>
        {!showSkeleton || (totalStaked && totalStaked.gte(0)) ? (
          <>
            <Pool.PoolCardHeaderTitle
              title={vaultPoolConfig[pool.vaultKey].name}
              subTitle={vaultPoolConfig[pool.vaultKey].description}
            />
            <TokenPairImage {...vaultPoolConfig[pool.vaultKey].tokenImage} width={64} height={64} />
          </>
        ) : (
          <Flex width="100%" justifyContent="space-between">
            <Flex flexDirection="column">
              <Skeleton width={100} height={26} mb="4px" />
              <Skeleton width={65} height={20} />
            </Flex>
            <Skeleton width={58} height={58} variant="circle" />
          </Flex>
        )}
      </Pool.PoolCardHeader>
      <InvaVaultDetail
        isLoading={isLoading}
        account={account}
        pool={pool}
        vaultPool={vaultPool}
        accountHasSharesStaked={accountHasSharesStaked}
        showIInva={showIInva}
        performanceFeeAsDecimal={performanceFeeAsDecimal}
        defaultFooterExpanded={defaultFooterExpanded}
      />
    </Pool.StyledCard>
  )
}

export default InvaVaultCard
