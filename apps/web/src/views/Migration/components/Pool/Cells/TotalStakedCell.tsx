import React, { useMemo } from 'react'
import { Flex, Text, Skeleton, Balance, Pool } from '@offsideswap/uikit'
import styled from 'styled-components'
import { useTranslation } from '@offsideswap/localization'
import BigNumber from 'bignumber.js'
import { getBalanceNumber } from '@offsideswap/utils/formatBalance'
import { Token } from '@offsideswap/sdk'

interface TotalStakedCellProps {
  pool: Pool.DeserializedPool<Token>
  totalRotoInVault: BigNumber
  rotoInVaults: BigNumber
}

const StyledCell = styled(Pool.BaseCell)`
  display: none;
  flex: 2 0 100px;
  ${({ theme }) => theme.mediaQueries.lg} {
    display: block;
  }
`

const TotalStakedCell: React.FC<React.PropsWithChildren<TotalStakedCellProps>> = ({
  pool,
  totalRotoInVault,
  rotoInVaults,
}) => {
  const { t } = useTranslation()
  const { sousId, stakingToken, totalStaked, vaultKey } = pool

  const isManualRotoPool = sousId === 0

  const totalStakedBalance = useMemo(() => {
    if (vaultKey) {
      return getBalanceNumber(totalRotoInVault, stakingToken.decimals)
    }
    if (isManualRotoPool) {
      const manualRotoTotalMinusAutoVault = new BigNumber(totalStaked).minus(rotoInVaults)
      return getBalanceNumber(manualRotoTotalMinusAutoVault, stakingToken.decimals)
    }
    return getBalanceNumber(totalStaked, stakingToken.decimals)
  }, [vaultKey, totalRotoInVault, isManualRotoPool, totalStaked, stakingToken.decimals, rotoInVaults])

  return (
    <StyledCell role="cell">
      <Pool.CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {t('Total staked')}
        </Text>
        <Flex height="20px" alignItems="center">
          {totalRotoInVault && totalRotoInVault.gte(0) ? (
            <Balance fontSize="16px" value={totalStakedBalance} decimals={0} unit={` ${stakingToken.symbol}`} />
          ) : (
            <Skeleton width="80px" height="16px" />
          )}
        </Flex>
      </Pool.CellContent>
    </StyledCell>
  )
}

export default TotalStakedCell
