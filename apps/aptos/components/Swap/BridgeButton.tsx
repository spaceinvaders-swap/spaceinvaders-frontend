import { useTranslation } from '@offsideswap/localization'
import { IconButton, useTooltip, BridgeIcon } from '@offsideswap/uikit'

interface BridgeInfo {
  platform: string
  symbol: string
  url: string
}

export const bridgeInfo: BridgeInfo[] = [
  {
    platform: 'Offside Bridge',
    symbol: 'ROTO',
    url: 'https://bridge.offsideswap.finance/aptos',
  },
  {
    platform: 'LayerZero Bridge',
    symbol: 'lz',
    url: 'https://theaptosbridge.com/bridge',
  },
  {
    platform: 'Celer cBridge',
    symbol: 'ce',
    url: 'https://cbridge.celer.network',
  },
  {
    platform: 'Wormhole Bridge',
    symbol: 'wh',
    url: 'https://www.portalbridge.com/#/transfer',
  },
]

export function BridgeButton({ url }: { url: string }) {
  const { t } = useTranslation()
  const { tooltip, tooltipVisible, targetRef } = useTooltip(t('Bridge this asset'), {
    placement: 'bottom',
    trigger: 'hover',
  })

  const handleClick = () => {
    window.open(url, '_blank', 'noopener noreferrer')
  }

  return (
    <>
      <div ref={targetRef}>
        <IconButton scale="sm" variant="text" style={{ width: 'auto' }} onClick={handleClick}>
          <BridgeIcon color="textSubtle" />
        </IconButton>
      </div>
      {tooltipVisible && tooltip}
    </>
  )
}
