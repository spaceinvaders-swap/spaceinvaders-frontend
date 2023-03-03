import PoweredBy from 'components/layerZero/PoweredBy'
import { LinkExternal } from '@spaceinvaders-swap/uikit'

const AptosBridgeFooter = () => {
  return (
    <>
      <PoweredBy />
      <LinkExternal m="20px auto" href="https://docs.spaceinvaders-swap.finance/get-started-aptos/aptos-faq#inva-bridging">
        Need Help?
      </LinkExternal>
      <LinkExternal m="20px auto" href="https://docs.spaceinvaders-swap.finance/get-started-aptos/aptos-coin-guide">
        Don’t see your assets?
      </LinkExternal>
    </>
  )
}

export default AptosBridgeFooter
