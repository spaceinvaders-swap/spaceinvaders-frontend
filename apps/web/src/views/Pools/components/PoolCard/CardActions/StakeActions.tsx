import { Token } from '@offsideswap/sdk'
import { Pool } from '@offsideswap/uikit'
import StakeModal from '../../Modals/StakeModal'

export default Pool.withStakeActions<Token>(StakeModal)
