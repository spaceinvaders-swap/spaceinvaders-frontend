import React, { useMemo } from 'react'
import { Flex, Text, Skeleton, Balance, Pool } from '@spaceinvaders-swap/uikit'
import styled from 'styled-components'
import { useTranslation } from '@spaceinvaders-swap/localization'
import BigNumber from 'bignumber.js'
import { getBalanceNumber } from '@spaceinvaders-swap/utils/formatBalance'
import { Token } from '@spaceinvaders-swap/sdk'

interface TotalStakedCellProps {
  pool: Pool.DeserializedPool<Token>
  totalInvaInVault: BigNumber
  invaInVaults: BigNumber
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
  totalInvaInVault,
  invaInVaults,
}) => {
  const { t } = useTranslation()
  const { sousId, stakingToken, totalStaked, vaultKey } = pool

  const isManualInvaPool = sousId === 0

  const totalStakedBalance = useMemo(() => {
    if (vaultKey) {
      return getBalanceNumber(totalInvaInVault, stakingToken.decimals)
    }
    if (isManualInvaPool) {
      const manualInvaTotalMinusAutoVault = new BigNumber(totalStaked).minus(invaInVaults)
      return getBalanceNumber(manualInvaTotalMinusAutoVault, stakingToken.decimals)
    }
    return getBalanceNumber(totalStaked, stakingToken.decimals)
  }, [vaultKey, totalInvaInVault, isManualInvaPool, totalStaked, stakingToken.decimals, invaInVaults])

  return (
    <StyledCell role="cell">
      <Pool.CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {t('Total staked')}
        </Text>
        <Flex height="20px" alignItems="center">
          {totalInvaInVault && totalInvaInVault.gte(0) ? (
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
