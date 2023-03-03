import { useTranslation } from '@spaceinvaders-swap/localization'
import {
  AddIcon,
  Button,
  IconButton,
  MinusIcon,
  useMatchBreakpoints,
  useModal,
  useToast,
  Farm as FarmUI,
} from '@spaceinvaders-swap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import { BASE_ADD_LIQUIDITY_URL } from 'config'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useCatchTxError from 'hooks/useCatchTxError'
import { useERC20 } from 'hooks/useContract'
import React, { useCallback, useState } from 'react'
import { useAppDispatch } from 'state'
import { fetchFarmUserDataAsync } from 'state/farms'
import { useFarmUser, usePriceInvaBusd, useFarmFromPid } from 'state/farms/hooks'
import styled from 'styled-components'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import { FarmWithStakedValue } from '@spaceinvaders-swap/farms'
import useApproveFarm from 'views/Farms/hooks/useApproveFarm'
import useStakeFarms from 'views/Farms/hooks/useStakeFarms'
import useUnstakeFarms from 'views/Farms/hooks/useUnstakeFarms'
import BInvaCalculator from 'views/Farms/components/YieldBooster/components/BInvaCalculator'

const IconButtonWrapper = styled.div`
  display: flex;
`

interface StackedActionProps extends FarmWithStakedValue {
  lpLabel?: string
  displayApr?: string
}

const StakeButton: React.FC<React.PropsWithChildren<StackedActionProps>> = ({
  pid,
  vaultPid,
  apr,
  multiplier,
  lpSymbol,
  lpLabel,
  lpTokenPrice,
  lpAddress,
  quoteToken,
  token,
  displayApr,
  lpTotalSupply,
}) => {
  const { t } = useTranslation()
  const { account, chainId } = useActiveWeb3React()
  const { isDesktop } = useMatchBreakpoints()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const stakedPid = vaultPid ?? pid
  const { allowance, tokenBalance, stakedBalance } = useFarmUser(pid)
  const { onStake } = useStakeFarms(stakedPid)
  const { onUnstake } = useUnstakeFarms(stakedPid)
  const invaPrice = usePriceInvaBusd()
  const { lpTokenStakedAmount } = useFarmFromPid(pid)
  const [bInvaMultiplier, setBInvaMultiplier] = useState<number | null>(() => null)

  const isApproved = account && allowance && allowance.isGreaterThan(0)

  const liquidityUrlPathParts = getLiquidityUrlPathParts({
    quoteTokenAddress: quoteToken.address,
    tokenAddress: token.address,
    chainId,
  })
  const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`

  const handleStake = async (amount: string) => {
    const receipt = await fetchWithCatchTxError(() => {
      return onStake(amount)
    })
    if (receipt?.status) {
      toastSuccess(
        `${t('Staked')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your funds have been staked in the farm')}
        </ToastDescriptionWithTx>,
      )
      dispatch(fetchFarmUserDataAsync({ account, pids: [pid], chainId }))
    }
  }

  const handleUnstake = async (amount: string) => {
    const receipt = await fetchWithCatchTxError(() => {
      return onUnstake(amount)
    })
    if (receipt?.status) {
      toastSuccess(
        `${t('Unstaked')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your earnings have also been harvested to your wallet')}
        </ToastDescriptionWithTx>,
      )
      dispatch(fetchFarmUserDataAsync({ account, pids: [pid], chainId }))
    }
  }

  const bInvaCalculatorSlot = (calculatorBalance) => (
    <BInvaCalculator
      targetInputBalance={calculatorBalance}
      earningTokenPrice={invaPrice.toNumber()}
      lpTokenStakedAmount={lpTokenStakedAmount}
      setBInvaMultiplier={setBInvaMultiplier}
    />
  )

  const [onPresentDeposit] = useModal(
    <FarmUI.DepositModal
      account={account}
      pid={pid}
      lpTotalSupply={lpTotalSupply}
      max={tokenBalance}
      lpPrice={lpTokenPrice}
      lpLabel={lpLabel}
      apr={apr}
      displayApr={displayApr}
      stakedBalance={stakedBalance}
      onConfirm={handleStake}
      tokenName={lpSymbol}
      multiplier={multiplier}
      addLiquidityUrl={addLiquidityUrl}
      invaPrice={invaPrice}
      bInvaMultiplier={bInvaMultiplier}
      decimals={18}
      bInvaCalculatorSlot={bInvaCalculatorSlot}
    />,
  )
  const [onPresentWithdraw] = useModal(
    <FarmUI.WithdrawModal max={stakedBalance} onConfirm={handleUnstake} tokenName={lpSymbol} decimals={18} />,
  )
  const lpContract = useERC20(lpAddress)
  const dispatch = useAppDispatch()
  const { onApprove } = useApproveFarm(lpContract, chainId)

  const handleApprove = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    handlePoolApprove()
  }

  const handlePoolApprove = useCallback(async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return onApprove()
    })
    if (receipt?.status) {
      toastSuccess(t('Contract Enabled'), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
      dispatch(fetchFarmUserDataAsync({ account, pids: [pid], chainId }))
    }
  }, [onApprove, dispatch, chainId, account, pid, t, toastSuccess, fetchWithCatchTxError])

  const handleDeposit = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    onPresentDeposit()
  }

  const handleWithdraw = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    onPresentWithdraw()
  }

  if (isApproved) {
    if (stakedBalance.gt(0)) {
      return (
        <IconButtonWrapper>
          <IconButton variant="secondary" onClick={handleWithdraw} mr="6px">
            <MinusIcon color="primary" width="14px" />
          </IconButton>
          <IconButton variant="secondary" onClick={handleDeposit}>
            <AddIcon color="primary" width="14px" />
          </IconButton>
        </IconButtonWrapper>
      )
    }

    return (
      <Button width={isDesktop ? '142px' : '120px'} onClick={onPresentDeposit} marginLeft="auto">
        {t('Stake')}
      </Button>
    )
  }

  return (
    <Button
      disabled={pendingTx}
      onClick={handleApprove}
      variant="tertiary"
      marginLeft="auto"
      width={isDesktop ? '142px' : '120px'}
    >
      {t('Enable')}
    </Button>
  )
}

export default StakeButton
