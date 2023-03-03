import { Flex, Link, LinkExternal, Skeleton, Text, TimerIcon, Balance, Pool } from '@spaceinvaders-swap/uikit'
import AddToWalletButton, { AddToWalletTextOptions } from 'components/AddToWallet/AddToWalletButton'
import { bsc } from 'wagmi/chains'
import { useTranslation } from '@spaceinvaders-swap/localization'
import { Token } from '@spaceinvaders-swap/sdk'
import { BIG_ZERO } from '@spaceinvaders-swap/utils/bigNumber'
import { memo } from 'react'
import { useCurrentBlock } from 'state/block/hooks'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { VaultKey } from 'state/types'
import { getBlockExploreLink } from 'utils'
import { getAddress, getVaultPoolAddress } from 'utils/addressHelpers'
import { getPoolBlockInfo } from 'views/Pools/helpers'
import MaxStakeRow from './MaxStakeRow'
import { AprInfo, DurationAvg, PerformanceFee, TotalLocked } from './Stat'

interface ExpandedFooterProps {
  pool: Pool.DeserializedPool<Token>
  account: string
  showTotalStaked?: boolean
  alignLinksToRight?: boolean
}

const PoolStatsInfo: React.FC<React.PropsWithChildren<ExpandedFooterProps>> = ({
  pool,
  account,
  showTotalStaked = true,
  alignLinksToRight = true,
}) => {
  const { t } = useTranslation()
  const currentBlock = useCurrentBlock()

  const {
    stakingToken,
    earningToken,
    totalStaked,
    startBlock,
    endBlock,
    stakingLimit,
    stakingLimitEndBlock,
    contractAddress,
    vaultKey,
    profileRequirement,
    isFinished,
    userData: poolUserData,
  } = pool

  const stakedBalance = poolUserData?.stakedBalance ? poolUserData.stakedBalance : BIG_ZERO

  const {
    totalInvaInVault,
    totalLockedAmount,
    fees: { performanceFeeAsDecimal },
    userData,
  } = useVaultPoolByKey(vaultKey)

  const tokenAddress = earningToken.address || ''
  const poolContractAddress = getAddress(contractAddress)
  const invaVaultContractAddress = getVaultPoolAddress(vaultKey)

  const { shouldShowBlockCountdown, blocksUntilStart, blocksRemaining, hasPoolStarted, blocksToDisplay } =
    getPoolBlockInfo(pool, currentBlock)

  return (
    <>
      {profileRequirement && (profileRequirement.required || profileRequirement.thresholdPoints.gt(0)) && (
        <Flex mb="8px" justifyContent="space-between">
          <Text small>{t('Requirement')}:</Text>
          <Text small textAlign="right">
            {profileRequirement.required && t('Spaceinvaders Profile')}{' '}
            {profileRequirement.thresholdPoints.gt(0) && (
              <Text small>
                {profileRequirement.thresholdPoints.toNumber().toLocaleString()} {t('Profile Points')}
              </Text>
            )}
          </Text>
        </Flex>
      )}
      {!vaultKey && <AprInfo pool={pool} stakedBalance={stakedBalance} />}
      {showTotalStaked && (
        <Pool.TotalStaked
          totalStaked={vaultKey ? totalInvaInVault : totalStaked}
          tokenDecimals={stakingToken.decimals}
          symbol={stakingToken.symbol}
          decimalsToShow={0}
        />
      )}
      {vaultKey === VaultKey.InvaVault && <TotalLocked totalLocked={totalLockedAmount} lockedToken={stakingToken} />}
      {vaultKey === VaultKey.InvaVault && <DurationAvg />}
      {!isFinished && stakingLimit && stakingLimit.gt(0) && (
        <MaxStakeRow
          small
          currentBlock={currentBlock}
          hasPoolStarted={hasPoolStarted}
          stakingLimit={stakingLimit}
          stakingLimitEndBlock={stakingLimitEndBlock}
          stakingToken={stakingToken}
          endBlock={endBlock}
        />
      )}
      {shouldShowBlockCountdown && (
        <Flex mb="2px" justifyContent="space-between" alignItems="center">
          <Text small>{hasPoolStarted ? t('Ends in') : t('Starts in')}:</Text>
          {blocksRemaining || blocksUntilStart ? (
            <Flex alignItems="center">
              <Link external href={getBlockExploreLink(hasPoolStarted ? endBlock : startBlock, 'countdown')}>
                <Balance small value={blocksToDisplay} decimals={0} color="primary" />
                <Text small ml="4px" color="primary" textTransform="lowercase">
                  {t('Blocks')}
                </Text>
                <TimerIcon ml="4px" color="primary" />
              </Link>
            </Flex>
          ) : (
            <Skeleton width="54px" height="21px" />
          )}
        </Flex>
      )}
      {vaultKey && <PerformanceFee userData={userData} performanceFeeAsDecimal={performanceFeeAsDecimal} />}
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <LinkExternal href={`/info/token/${earningToken.address}`} bold={false} small>
          {t('See Token Info')}
        </LinkExternal>
      </Flex>
      {!vaultKey && (
        <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <LinkExternal href={earningToken.projectLink} bold={false} small>
            {t('View Project Site')}
          </LinkExternal>
        </Flex>
      )}
      {vaultKey && (
        <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <LinkExternal href="https://docs.spaceinvaders-swap.finance/products/syrup-pool/new-inva-pool" bold={false} small>
            {t('View Tutorial')}
          </LinkExternal>
        </Flex>
      )}
      {poolContractAddress && (
        <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <LinkExternal
            isBscScan
            href={`${bsc.blockExplorers.default.url}/address/${
              vaultKey ? invaVaultContractAddress : poolContractAddress
            }`}
            bold={false}
            small
          >
            {t('View Contract')}
          </LinkExternal>
        </Flex>
      )}
      {account && tokenAddress && (
        <Flex justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <AddToWalletButton
            variant="text"
            p="0"
            height="auto"
            style={{ fontSize: '14px', fontWeight: '400', lineHeight: 'normal' }}
            marginTextBetweenLogo="4px"
            textOptions={AddToWalletTextOptions.TEXT}
            tokenAddress={tokenAddress}
            tokenSymbol={earningToken.symbol}
            tokenDecimals={earningToken.decimals}
            tokenLogo={`https://tokens.spaceinvaders-swap.finance/images/${tokenAddress}.png`}
          />
        </Flex>
      )}
    </>
  )
}

export default memo(PoolStatsInfo)
