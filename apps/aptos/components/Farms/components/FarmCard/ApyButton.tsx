import { useTranslation } from '@offsideswap/localization'
import { Text, TooltipText, useModal, useTooltip, Farm as FarmUI, RoiCalculatorModal } from '@offsideswap/uikit'
import BigNumber from 'bignumber.js'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { BIG_ZERO } from '@offsideswap/utils/bigNumber'
import { useFarmUserInfoCache } from 'state/farms/hook'
import { useAccountBalance } from '@offsideswap/awgmi'
import { FARM_DEFAULT_DECIMALS } from '../../constants'

export interface ApyButtonProps {
  variant: 'text' | 'text-and-button'
  pid: number
  lpAddress: string
  lpSymbol: string
  lpLabel?: string
  multiplier: string
  lpTokenPrice: BigNumber
  rotoPrice?: BigNumber
  apr?: number
  displayApr?: string
  lpRewardsApr?: number
  addLiquidityUrl?: string
  useTooltipText?: boolean
  hideButton?: boolean
}

const ApyButton: React.FC<React.PropsWithChildren<ApyButtonProps>> = ({
  variant,
  pid,
  lpLabel = '',
  lpSymbol,
  lpAddress,
  lpTokenPrice,
  rotoPrice = BIG_ZERO,
  apr = 0,
  multiplier,
  displayApr,
  lpRewardsApr,
  addLiquidityUrl = '',
  useTooltipText,
  hideButton,
}) => {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()
  const { data: userInfo } = useFarmUserInfoCache(String(pid))
  const { data: tokenBalance = BIG_ZERO } = useAccountBalance({
    watch: true,
    address: account,
    coin: lpAddress,
    select: (d) => new BigNumber(d.value),
  })

  let userBalanceInFarm = BIG_ZERO
  if (userInfo) {
    userBalanceInFarm = new BigNumber(userInfo.amount).plus(tokenBalance)
  }

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Text>
        {t('APR (incl. LP rewards)')}: <Text style={{ display: 'inline-block' }}>{`${displayApr}%`}</Text>
      </Text>
      <Text ml="5px">
        *{t('Base APR (ROTO yield only)')}: {`${apr.toFixed(2)}%`}
      </Text>
      <Text ml="5px">
        *{t('LP Rewards APR')}: {lpRewardsApr === 0 ? '-' : lpRewardsApr}%
      </Text>
    </>,
    {
      placement: 'top',
    },
  )

  const [onPresentApyModal] = useModal(
    <RoiCalculatorModal
      account={account || ''}
      pid={pid}
      linkLabel={t('Get %symbol%', { symbol: lpLabel })}
      stakingTokenBalance={userBalanceInFarm}
      stakingTokenSymbol={lpSymbol}
      stakingTokenPrice={lpTokenPrice.toNumber()}
      stakingTokenDecimals={FARM_DEFAULT_DECIMALS}
      earningTokenPrice={rotoPrice.toNumber()}
      apr={apr}
      multiplier={multiplier}
      displayApr={displayApr}
      linkHref={addLiquidityUrl}
      isFarm
      rewardRotoPerSecond
    />,
    false,
    true,
    `FarmModal${pid}`,
  )

  const handleClickButton = (event): void => {
    event.stopPropagation()
    onPresentApyModal()
  }

  return (
    <FarmUI.FarmApyButton variant={variant} hideButton={hideButton} handleClickButton={handleClickButton}>
      {useTooltipText ? (
        <>
          <TooltipText ref={targetRef} decorationColor="secondary">
            {displayApr}%
          </TooltipText>
          {tooltipVisible && tooltip}
        </>
      ) : (
        <>{displayApr}%</>
      )}
    </FarmUI.FarmApyButton>
  )
}

export default ApyButton
