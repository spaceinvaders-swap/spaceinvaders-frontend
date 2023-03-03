import { Token } from '@spaceinvaders-swap/sdk'
import { Pool } from '@spaceinvaders-swap/uikit'
import StakeModal from './StakeModal'

export default Pool.withStakeActions<Token>(StakeModal)
