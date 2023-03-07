import { useTranslation } from '@offsideswap/localization'
import { Button, AutoRenewIcon } from '@offsideswap/uikit'
import { useWithdrawPottery } from 'views/Pottery/hooks/useWithdrawPottery'
import { PotteryDepositStatus } from 'state/types'
import BigNumber from 'bignumber.js'
import { useMemo } from 'react'

interface WithdrawButtonProps {
  status: PotteryDepositStatus
  rotoNumber: BigNumber
  redeemShare: string
  potteryVaultAddress: string
  balanceOf: string
}

const WithdrawButton: React.FC<React.PropsWithChildren<WithdrawButtonProps>> = ({
  status,
  rotoNumber,
  redeemShare,
  potteryVaultAddress,
  balanceOf,
}) => {
  const { t } = useTranslation()
  const { isPending, handleWithdraw } = useWithdrawPottery(redeemShare, potteryVaultAddress)

  const isDisabled = useMemo(() => {
    return (
      isPending ||
      rotoNumber.lte(0) ||
      rotoNumber.isNaN() ||
      new BigNumber(balanceOf).lte(0) ||
      status !== PotteryDepositStatus.UNLOCK
    )
  }, [isPending, rotoNumber, balanceOf, status])

  return (
    <Button
      width={['110px', '110px', '162px']}
      ml="auto"
      variant="secondary"
      disabled={isDisabled}
      endIcon={isPending ? <AutoRenewIcon spin color="currentColor" /> : null}
      onClick={handleWithdraw}
    >
      {t('Withdraw')}
    </Button>
  )
}

export default WithdrawButton
