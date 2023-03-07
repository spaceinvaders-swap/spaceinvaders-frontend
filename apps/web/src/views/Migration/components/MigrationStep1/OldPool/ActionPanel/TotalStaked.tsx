import React, { useMemo } from 'react'
import { Flex, Text, Balance, Pool } from '@offsideswap/uikit'
import styled from 'styled-components'
import { useTranslation } from '@offsideswap/localization'
import BigNumber from 'bignumber.js'
import { getBalanceNumber } from '@offsideswap/utils/formatBalance'
import { Token } from '@offsideswap/sdk'

const Containter = styled(Flex)`
  margin-top: 12px;
  padding: 0;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-top: 0px;
    padding: 0 12px;
  }
`

interface TotalStakedProps {
  pool: Pool.DeserializedPool<Token>
  totalRotoInVault: BigNumber
  rotoInVaults: BigNumber
}

const TotalStaked: React.FC<React.PropsWithChildren<TotalStakedProps>> = ({ pool, totalRotoInVault, rotoInVaults }) => {
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
    <Containter justifyContent="space-between">
      <Text>{t('Total staked')}</Text>
      <Flex height="20px" alignItems="center">
        <Balance fontSize="16px" value={totalStakedBalance} decimals={0} unit={` ${stakingToken.symbol}`} />
      </Flex>
    </Containter>
  )
}

export default TotalStaked
