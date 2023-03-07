import { Pool } from '@offsideswap/uikit'
import { Coin } from '@offsideswap/aptos-swap-sdk'
import StakeActions from './StakeActions'
import HarvestActions from './HarvestActions'

export default Pool.withCardActions<Coin>(HarvestActions, StakeActions)
