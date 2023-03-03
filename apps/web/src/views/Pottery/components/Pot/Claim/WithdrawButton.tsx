import { useTranslation } from '@spaceinvaders-swap/localization'
import { Button, AutoRenewIcon } from '@spaceinvaders-swap/uikit'
import { useWithdrawPottery } from 'views/Pottery/hooks/useWithdrawPottery'
import { PotteryDepositStatus } from 'state/types'
import BigNumber from 'bignumber.js'
import { useMemo } from 'react'

interface WithdrawButtonProps {
  status: PotteryDepositStatus
  invaNumber: BigNumber
  redeemShare: string
  potteryVaultAddress: string
  balanceOf: string
}

const WithdrawButton: React.FC<React.PropsWithChildren<WithdrawButtonProps>> = ({
  status,
  invaNumber,
  redeemShare,
  potteryVaultAddress,
  balanceOf,
}) => {
  const { t } = useTranslation()
  const { isPending, handleWithdraw } = useWithdrawPottery(redeemShare, potteryVaultAddress)

  const isDisabled = useMemo(() => {
    return (
      isPending ||
      invaNumber.lte(0) ||
      invaNumber.isNaN() ||
      new BigNumber(balanceOf).lte(0) ||
      status !== PotteryDepositStatus.UNLOCK
    )
  }, [isPending, invaNumber, balanceOf, status])

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
