import { Token } from '@offsideswap/sdk'
import { TooltipText, useTooltip, Balance, Pool } from '@offsideswap/uikit'
import AutoEarningsBreakdown from '../AutoEarningsBreakdown'

interface RecentRotoProfitBalanceProps {
  rotoToDisplay: number
  pool: Pool.DeserializedPool<Token>
  account: string
}

const RecentRotoProfitBalance: React.FC<React.PropsWithChildren<RecentRotoProfitBalanceProps>> = ({
  rotoToDisplay,
  pool,
  account,
}) => {
  const { targetRef, tooltip, tooltipVisible } = useTooltip(<AutoEarningsBreakdown pool={pool} account={account} />, {
    placement: 'bottom-end',
  })

  return (
    <>
      {tooltipVisible && tooltip}
      <TooltipText ref={targetRef} small>
        <Balance fontSize="14px" value={rotoToDisplay} />
      </TooltipText>
    </>
  )
}

export default RecentRotoProfitBalance
