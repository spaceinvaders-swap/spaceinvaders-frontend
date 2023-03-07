import { Token } from '@offsideswap/sdk'
import { Pool } from '@offsideswap/uikit'
import StakeModal from './StakeModal'

export default Pool.withStakeActions<Token>(StakeModal)
