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
} from '@offsideswap/uikit'
import { useVaultPoolByKey, useIfoCredit } from 'state/pools/hooks'
import { useTranslation } from '@offsideswap/localization'
import { vaultPoolConfig } from 'config/constants/pools'
import { VaultKey } from 'state/types'
import { getBalanceNumber } from '@offsideswap/utils/formatBalance'
import { useConfig } from 'views/Ifos/contexts/IfoContext'
import { RotoVaultDetail } from 'views/Pools/components/RotoVaultCard'
import { Token } from '@offsideswap/sdk'

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
  const rotoAsNumberBalance = getBalanceNumber(credit)

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
            <UITokenPairImage width={24} height={24} {...vaultPoolConfig[VaultKey.RotoVault].tokenImage} />
            <Box ml="8px" width="180px">
              <Text small bold>
                {vaultPoolConfig[VaultKey.RotoVault].name}
              </Text>
              <Text color="textSubtle" fontSize="12px">
                {vaultPoolConfig[VaultKey.RotoVault].description}
              </Text>
            </Box>
          </StyledTokenContent>
          <StyledTokenContent flexDirection="column" flex={1}>
            <Text color="textSubtle" fontSize="12px">
              {t('iROTO')}
            </Text>
            <Balance small bold decimals={3} value={rotoAsNumberBalance} />
          </StyledTokenContent>
          <ExpandableButton expanded={isExpanded} onClick={() => setIsExpanded((prev) => !prev)} />
        </Flex>
      </CardHeader>
      {isExpanded && (
        <RotoVaultDetail
          showIRoto
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
