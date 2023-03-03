import { Pool } from '@spaceinvaders-swap/uikit'
import { Coin } from '@spaceinvaders-swap/aptos-swap-sdk'
import StakeActions from './StakeActions'
import HarvestActions from './HarvestActions'

export default Pool.withCardActions<Coin>(HarvestActions, StakeActions)
