import PoweredBy from 'components/layerZero/PoweredBy'
import { LinkExternal } from '@offsideswap/uikit'

const AptosBridgeFooter = () => {
  return (
    <>
      <PoweredBy />
      <LinkExternal m="20px auto" href="https://docs.offsideswap.finance/get-started-aptos/aptos-faq#roto-bridging">
        Need Help?
      </LinkExternal>
      <LinkExternal m="20px auto" href="https://docs.offsideswap.finance/get-started-aptos/aptos-coin-guide">
        Don’t see your assets?
      </LinkExternal>
    </>
  )
}

export default AptosBridgeFooter
