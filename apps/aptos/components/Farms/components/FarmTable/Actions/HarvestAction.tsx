import { TransactionResponse } from '@spaceinvaders-swap/awgmi/core'
import { useTranslation } from '@spaceinvaders-swap/localization'
import { Skeleton, useToast, Farm as FarmUI } from '@spaceinvaders-swap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import useCatchTxError from 'hooks/useCatchTxError'
import { BIG_ZERO } from '@spaceinvaders-swap/utils/bigNumber'
import { getBalanceAmount } from '@spaceinvaders-swap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import { usePriceInvaUsdc } from 'hooks/useStablePrice'
import { FARM_DEFAULT_DECIMALS } from 'components/Farms/constants'
import { FarmWithStakedValue } from '@spaceinvaders-swap/farms'
import useHarvestFarm from '../../../hooks/useHarvestFarm'

const { FarmTableHarvestAction } = FarmUI.FarmTable

interface HarvestActionProps extends FarmWithStakedValue {
  userDataReady: boolean
  onReward: () => Promise<TransactionResponse>
}

export const HarvestActionContainer = ({ children, ...props }) => {
  const { onReward } = useHarvestFarm(props.lpAddress)

  return children({ ...props, onReward })
}

export const HarvestAction: React.FunctionComponent<React.PropsWithChildren<HarvestActionProps>> = ({
  userData,
  userDataReady,
  onReward,
}) => {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const earningsBigNumber = userData?.earnings ? new BigNumber(userData.earnings) : BIG_ZERO
  const invaPrice = usePriceInvaUsdc()
  let earnings = BIG_ZERO
  let earningsBusd = 0
  let displayBalance = userDataReady ? earnings.toFixed(5, BigNumber.ROUND_DOWN) : <Skeleton width={60} />

  // If user didn't connect wallet default balance will be 0
  if (!earningsBigNumber.isZero()) {
    earnings = getBalanceAmount(earningsBigNumber, FARM_DEFAULT_DECIMALS)
    earningsBusd = earnings.multipliedBy(invaPrice).toNumber()
    displayBalance = earnings.toFixed(5, BigNumber.ROUND_DOWN)
  }

  const handleHarvest = async () => {
    const receipt = await fetchWithCatchTxError(() => onReward())
    if (receipt?.status) {
      toastSuccess(
        `${t('Harvested')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your %symbol% earnings have been sent to your wallet!', { symbol: 'INVA' })}
        </ToastDescriptionWithTx>,
      )
    }
  }

  return (
    <FarmTableHarvestAction
      earnings={earnings}
      earningsBusd={earningsBusd}
      displayBalance={displayBalance}
      pendingTx={pendingTx}
      userDataReady={userDataReady}
      handleHarvest={handleHarvest}
    />
  )
}

export default HarvestAction
