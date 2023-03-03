import { Token } from '@spaceinvaders-swap/sdk'
import { TooltipText, useTooltip, Balance, Pool } from '@spaceinvaders-swap/uikit'
import AutoEarningsBreakdown from '../AutoEarningsBreakdown'

interface RecentInvaProfitBalanceProps {
  invaToDisplay: number
  pool: Pool.DeserializedPool<Token>
  account: string
}

const RecentInvaProfitBalance: React.FC<React.PropsWithChildren<RecentInvaProfitBalanceProps>> = ({
  invaToDisplay,
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
        <Balance fontSize="14px" value={invaToDisplay} />
      </TooltipText>
    </>
  )
}

export default RecentInvaProfitBalance
