import React, { useMemo } from 'react'
import { Flex, Text, Balance, Pool } from '@spaceinvaders-swap/uikit'
import styled from 'styled-components'
import { useTranslation } from '@spaceinvaders-swap/localization'
import BigNumber from 'bignumber.js'
import { getBalanceNumber } from '@spaceinvaders-swap/utils/formatBalance'
import { Token } from '@spaceinvaders-swap/sdk'

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
  totalInvaInVault: BigNumber
  invaInVaults: BigNumber
}

const TotalStaked: React.FC<React.PropsWithChildren<TotalStakedProps>> = ({ pool, totalInvaInVault, invaInVaults }) => {
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
    <Containter justifyContent="space-between">
      <Text>{t('Total staked')}</Text>
      <Flex height="20px" alignItems="center">
        <Balance fontSize="16px" value={totalStakedBalance} decimals={0} unit={` ${stakingToken.symbol}`} />
      </Flex>
    </Containter>
  )
}

export default TotalStaked
