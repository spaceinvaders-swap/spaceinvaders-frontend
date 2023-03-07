import { Pool } from '@offsideswap/uikit'
import { Coin } from '@offsideswap/aptos-swap-sdk'
import RotoCollectModal from './RotoCollectModal'
import RotoStakeModal from './RotoStakeModal'

const HarvestActions = Pool.withCollectModalCardAction(RotoCollectModal)
const StakeActions = Pool.withStakeActions(RotoStakeModal)

export default Pool.withCardActions<Coin>(HarvestActions, StakeActions)
