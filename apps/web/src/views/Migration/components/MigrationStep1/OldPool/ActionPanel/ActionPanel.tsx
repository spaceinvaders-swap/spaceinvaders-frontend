import React from 'react'
import styled, { keyframes, css } from 'styled-components'
import { VaultKey } from 'state/types'
import { useVaultPoolByKeyV1 } from 'views/Migration/hook/V1/Pool/useFetchIfoPool'
import { BIG_ZERO } from '@spaceinvaders-swap/utils/bigNumber'
import { getInvaVaultEarnings } from 'views/Pools/helpers'
import { Token } from '@spaceinvaders-swap/sdk'
import { Pool } from '@spaceinvaders-swap/uikit'

import Staked from './Stake'
import AutoEarning from './AutoEarning'
import Earning from './Earning'
import TotalStaked from './TotalStaked'

const expandAnimation = keyframes`
  from {
    opacity: 0;
    max-height: 0px;
  }
  to {
    opacity: 1;
    max-height: 700px;
  }
`

const collapseAnimation = keyframes`
  from {
    opacity: 1;
    max-height: 700px;
  }
  to {
    opacity: 0;
    max-height: 0px;
  }
`

const StyledActionPanel = styled.div<{ expanded: boolean }>`
  opacity: 1;
  animation: ${({ expanded }) =>
    expanded
      ? css`
          ${expandAnimation} 300ms linear forwards
        `
      : css`
          ${collapseAnimation} linear forwards
        `};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.dropdown};
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 24px 16px;

  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
    padding: 12px 10px;
  }
`

const ActionContainer = styled.div`
  display: flex;
  flex-direction: column-reverse;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    align-items: center;
    flex-grow: 1;
    flex-basis: 0;
    margin-bottom: 24px;
  }
`

interface ActionPanelProps {
  pool: Pool.DeserializedPool<Token>
  account: string
  expanded: boolean
}

const ActionPanel: React.FC<React.PropsWithChildren<ActionPanelProps>> = ({ pool, account, expanded }) => {
  const { vaultPoolData } = useVaultPoolByKeyV1(pool.vaultKey)
  const { totalInvaInVault, pricePerFullShare } = vaultPoolData
  const { invaAtLastUserAction, userShares } = vaultPoolData.userData

  const vaultPools = {
    [VaultKey.InvaVaultV1]: useVaultPoolByKeyV1(VaultKey.InvaVaultV1).vaultPoolData,
    [VaultKey.IfoPool]: useVaultPoolByKeyV1(VaultKey.IfoPool).vaultPoolData,
  }
  const invaInVaults = Object.values(vaultPools).reduce((total, vault) => {
    return total.plus(vault.totalInvaInVault)
  }, BIG_ZERO)

  // Auto Earning
  let earningTokenBalance = 0
  let earningTokenDollarBalance = 0
  if (pricePerFullShare) {
    const { autoInvaToDisplay, autoUsdToDisplay } = getInvaVaultEarnings(
      account,
      invaAtLastUserAction,
      userShares,
      pricePerFullShare,
      pool.earningTokenPrice,
    )
    earningTokenBalance = autoInvaToDisplay
    earningTokenDollarBalance = autoUsdToDisplay
  }

  return (
    <StyledActionPanel expanded={expanded}>
      <ActionContainer>
        {pool.vaultKey ? (
          <AutoEarning
            earningTokenBalance={earningTokenBalance}
            earningTokenDollarBalance={earningTokenDollarBalance}
            earningTokenPrice={pool.earningTokenPrice}
          />
        ) : (
          <Earning {...pool} />
        )}
        <Staked pool={pool} />
      </ActionContainer>
      <TotalStaked pool={pool} totalInvaInVault={totalInvaInVault} invaInVaults={invaInVaults} />
    </StyledActionPanel>
  )
}

export default ActionPanel
