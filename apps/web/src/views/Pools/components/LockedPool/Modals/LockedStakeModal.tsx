import { useState, useMemo } from 'react'
import { Modal, Box } from '@spaceinvaders-swap/uikit'
import useTheme from 'hooks/useTheme'
import { useBUSDInvaAmount } from 'hooks/useBUSDPrice'
import { VaultKey } from 'state/types'
import { getDecimalAmount } from '@spaceinvaders-swap/utils/formatBalance'
import { useTranslation } from '@spaceinvaders-swap/localization'
import _toNumber from 'lodash/toNumber'
import BigNumber from 'bignumber.js'
import { GenericModalProps } from '../types'
import BalanceField from '../Common/BalanceField'
import LockedBodyModal from '../Common/LockedModalBody'
import RoiCalculatorModalProvider from './RoiCalculatorModalProvider'
import { useCheckVaultApprovalStatus } from '../../../hooks/useApprove'

const LockedStakeModal: React.FC<React.PropsWithChildren<GenericModalProps>> = ({
  onDismiss,
  currentBalance,
  stakingToken,
  stakingTokenBalance,
}) => {
  const { theme } = useTheme()
  const [lockedAmount, setLockedAmount] = useState('')
  const { t } = useTranslation()

  const usdValueStaked = useBUSDInvaAmount(_toNumber(lockedAmount))

  const { allowance } = useCheckVaultApprovalStatus(VaultKey.InvaVault)
  const needApprove = useMemo(() => {
    const amount = getDecimalAmount(new BigNumber(lockedAmount))
    return amount.gt(allowance)
  }, [allowance, lockedAmount])

  return (
    <RoiCalculatorModalProvider lockedAmount={lockedAmount}>
      <Modal title={t('Lock INVA')} onDismiss={onDismiss} headerBackground={theme.colors.gradientCardHeader}>
        <Box mb="16px">
          <BalanceField
            stakingAddress={stakingToken.address}
            stakingSymbol={stakingToken.symbol}
            stakingDecimals={stakingToken.decimals}
            lockedAmount={lockedAmount}
            usedValueStaked={usdValueStaked}
            stakingMax={currentBalance}
            setLockedAmount={setLockedAmount}
            stakingTokenBalance={stakingTokenBalance}
            needApprove={needApprove}
          />
        </Box>
        <LockedBodyModal
          currentBalance={currentBalance}
          stakingToken={stakingToken}
          onDismiss={onDismiss}
          lockedAmount={new BigNumber(lockedAmount)}
        />
      </Modal>
    </RoiCalculatorModalProvider>
  )
}

export default LockedStakeModal
