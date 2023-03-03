import { Pool } from '@spaceinvaders-swap/uikit'
import { Coin } from '@spaceinvaders-swap/aptos-swap-sdk'
import InvaCollectModal from './InvaCollectModal'
import InvaStakeModal from './InvaStakeModal'

const HarvestActions = Pool.withCollectModalCardAction(InvaCollectModal)
const StakeActions = Pool.withStakeActions(InvaStakeModal)

export default Pool.withCardActions<Coin>(HarvestActions, StakeActions)
