import styled from 'styled-components'
import { useAccount } from 'wagmi'
import {
  Box,
  Card,
  CardHeader,
  ExpandableButton,
  Flex,
  Text,
  TokenPairImage as UITokenPairImage,
  Balance,
  Pool,
} from '@spaceinvaders-swap/uikit'
import { useVaultPoolByKey, useIfoCredit } from 'state/pools/hooks'
import { useTranslation } from '@spaceinvaders-swap/localization'
import { vaultPoolConfig } from 'config/constants/pools'
import { VaultKey } from 'state/types'
import { getBalanceNumber } from '@spaceinvaders-swap/utils/formatBalance'
import { useConfig } from 'views/Ifos/contexts/IfoContext'
import { InvaVaultDetail } from 'views/Pools/components/InvaVaultCard'
import { Token } from '@spaceinvaders-swap/sdk'

const StyledCardMobile = styled(Card)`
  max-width: 400px;
  width: 100%;
`

const StyledTokenContent = styled(Flex)`
  ${Text} {
    line-height: 1.2;
    white-space: nowrap;
  }
`

interface IfoPoolVaultCardMobileProps {
  pool: Pool.DeserializedPool<Token>
}

const IfoPoolVaultCardMobile: React.FC<React.PropsWithChildren<IfoPoolVaultCardMobileProps>> = ({ pool }) => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const credit = useIfoCredit()
  const { isExpanded, setIsExpanded } = useConfig()
  const invaAsNumberBalance = getBalanceNumber(credit)

  const vaultPool = useVaultPoolByKey(pool.vaultKey)

  const {
    userData: { userShares, isLoading: isVaultUserDataLoading },
    fees: { performanceFeeAsDecimal },
  } = vaultPool

  const accountHasSharesStaked = userShares && userShares.gt(0)
  const isLoading = !pool.userData || isVaultUserDataLoading

  return (
    <StyledCardMobile isActive>
      <CardHeader p="16px">
        <Flex justifyContent="space-between" alignItems="center">
          <StyledTokenContent alignItems="center" flex={1}>
            <UITokenPairImage width={24} height={24} {...vaultPoolConfig[VaultKey.InvaVault].tokenImage} />
            <Box ml="8px" width="180px">
              <Text small bold>
                {vaultPoolConfig[VaultKey.InvaVault].name}
              </Text>
              <Text color="textSubtle" fontSize="12px">
                {vaultPoolConfig[VaultKey.InvaVault].description}
              </Text>
            </Box>
          </StyledTokenContent>
          <StyledTokenContent flexDirection="column" flex={1}>
            <Text color="textSubtle" fontSize="12px">
              {t('iINVA')}
            </Text>
            <Balance small bold decimals={3} value={invaAsNumberBalance} />
          </StyledTokenContent>
          <ExpandableButton expanded={isExpanded} onClick={() => setIsExpanded((prev) => !prev)} />
        </Flex>
      </CardHeader>
      {isExpanded && (
        <InvaVaultDetail
          showIInva
          isLoading={isLoading}
          account={account}
          pool={pool}
          vaultPool={vaultPool}
          accountHasSharesStaked={accountHasSharesStaked}
          performanceFeeAsDecimal={performanceFeeAsDecimal}
        />
      )}
    </StyledCardMobile>
  )
}

export default IfoPoolVaultCardMobile
