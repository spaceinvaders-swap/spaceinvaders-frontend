import React from 'react'
import styled from 'styled-components'
import { useTranslation } from '@spaceinvaders-swap/localization'
import { Flex, Text, Balance, Pool } from '@spaceinvaders-swap/uikit'
import { ActionContainer, ActionContent, ActionTitles } from 'views/Pools/components/PoolsTable/ActionPanel/styles'
import BigNumber from 'bignumber.js'
import { useVaultPoolByKeyV1 } from 'views/Migration/hook/V1/Pool/useFetchIfoPool'
import { BIG_ZERO } from '@spaceinvaders-swap/utils/bigNumber'
import { getBalanceNumber } from '@spaceinvaders-swap/utils/formatBalance'
import { convertSharesToInva } from 'views/Pools/helpers'
import { Token } from '@spaceinvaders-swap/sdk'
import UnstakeButton from '../UnstakeButton'

const Container = styled(ActionContainer)`
  flex: 3;
`

interface StackedActionProps {
  pool: Pool.DeserializedPool<Token>
}

const Staked: React.FC<React.PropsWithChildren<StackedActionProps>> = ({ pool }) => {
  const { stakingToken, userData, stakingTokenPrice, vaultKey } = pool
  const { t } = useTranslation()

  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO

  const stakedTokenBalance = getBalanceNumber(stakedBalance, stakingToken.decimals)
  const stakedTokenDollarBalance = getBalanceNumber(
    stakedBalance.multipliedBy(stakingTokenPrice),
    stakingToken.decimals,
  )

  const { vaultPoolData } = useVaultPoolByKeyV1(pool.vaultKey)
  const { pricePerFullShare } = vaultPoolData
  const { userShares } = vaultPoolData.userData

  let invaAsBigNumber = BIG_ZERO
  let invaAsNumberBalance = 0
  if (pricePerFullShare) {
    const { invaAsBigNumber: invaBigBumber, invaAsNumberBalance: invaBalance } = convertSharesToInva(
      userShares,
      pricePerFullShare,
    )
    invaAsBigNumber = invaBigBumber
    invaAsNumberBalance = invaBalance
  }

  const stakedAutoDollarValue = getBalanceNumber(invaAsBigNumber.multipliedBy(stakingTokenPrice), stakingToken.decimals)

  const balance = vaultKey ? (Number.isNaN(invaAsNumberBalance) ? 0 : invaAsNumberBalance) : stakedTokenBalance
  const isBalanceZero = balance === 0

  return (
    <Container>
      <ActionTitles>
        <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
          {`${pool.stakingToken.symbol} ${t('Staked')}`}
        </Text>
      </ActionTitles>
      <ActionContent>
        <Flex flex="1" pt="16px" flexDirection="column" alignSelf="flex-start">
          <Balance
            lineHeight="1"
            bold
            color={isBalanceZero ? 'textDisabled' : 'text'}
            fontSize="20px"
            decimals={5}
            value={balance}
          />
          <Balance
            fontSize="12px"
            display="inline"
            color={isBalanceZero ? 'textDisabled' : 'textSubtle'}
            decimals={2}
            value={vaultKey ? stakedAutoDollarValue : stakedTokenDollarBalance}
            unit=" USD"
            prefix="~"
          />
        </Flex>
        <UnstakeButton pool={pool} />
      </ActionContent>
    </Container>
  )
}

export default Staked
