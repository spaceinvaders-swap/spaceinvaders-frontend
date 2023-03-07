import { Flex, Text, IconButton, AddIcon, MinusIcon, useModal, Skeleton, Box, Balance, Pool } from '@offsideswap/uikit'
import BigNumber from 'bignumber.js'
import { getBalanceNumber } from '@offsideswap/utils/formatBalance'
import { VaultKey } from 'state/types'
import { usePriceRotoBusd } from 'state/farms/hooks'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { Token } from '@offsideswap/sdk'
import NotEnoughTokensModal from '../../Modals/NotEnoughTokensModal'
import VaultStakeModal from '../VaultStakeModal'
import ConvertToLock from '../../LockedPool/Common/ConvertToLock'

interface HasStakeActionProps {
  pool: Pool.DeserializedPool<Token>
  stakingTokenBalance: BigNumber
  performanceFee: number
}

const HasSharesActions: React.FC<React.PropsWithChildren<HasStakeActionProps>> = ({
  pool,
  stakingTokenBalance,
  performanceFee,
}) => {
  const {
    userData: {
      balance: { rotoAsBigNumber, rotoAsNumberBalance },
    },
  } = useVaultPoolByKey(pool.vaultKey)

  const { stakingToken } = pool

  const rotoPriceBusd = usePriceRotoBusd()
  const stakedDollarValue = rotoPriceBusd.gt(0)
    ? getBalanceNumber(rotoAsBigNumber.multipliedBy(rotoPriceBusd), stakingToken.decimals)
    : 0

  const [onPresentTokenRequired] = useModal(<NotEnoughTokensModal tokenSymbol={stakingToken.symbol} />)
  const [onPresentStake] = useModal(
    <VaultStakeModal stakingMax={stakingTokenBalance} performanceFee={performanceFee} pool={pool} />,
  )
  const [onPresentUnstake] = useModal(
    <VaultStakeModal stakingMax={rotoAsBigNumber} pool={pool} isRemovingStake />,
    true,
    true,
    `withdraw-vault-${pool.sousId}-${pool.vaultKey}`,
  )

  return (
    <>
      <Flex mb="16px" justifyContent="space-between" alignItems="center">
        <Flex flexDirection="column">
          <Balance fontSize="20px" bold value={rotoAsNumberBalance} decimals={5} />
          <Text as={Flex} fontSize="12px" color="textSubtle" flexWrap="wrap">
            {rotoPriceBusd.gt(0) ? (
              <Balance
                value={stakedDollarValue}
                fontSize="12px"
                color="textSubtle"
                decimals={2}
                prefix="~"
                unit=" USD"
              />
            ) : (
              <Skeleton mt="1px" height={16} width={64} />
            )}
          </Text>
        </Flex>
        <Flex>
          <IconButton
            variant="secondary"
            onClick={() => {
              onPresentUnstake()
            }}
            mr="6px"
          >
            <MinusIcon color="primary" width="24px" />
          </IconButton>
          <IconButton variant="secondary" onClick={stakingTokenBalance.gt(0) ? onPresentStake : onPresentTokenRequired}>
            <AddIcon color="primary" width="24px" height="24px" />
          </IconButton>
        </Flex>
      </Flex>
      {pool.vaultKey === VaultKey.RotoVault && (
        <Box mb="16px">
          <ConvertToLock stakingToken={stakingToken} currentStakedAmount={rotoAsNumberBalance} />
        </Box>
      )}
    </>
  )
}

export default HasSharesActions
