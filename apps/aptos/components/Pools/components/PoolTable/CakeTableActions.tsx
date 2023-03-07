import { Pool } from '@offsideswap/uikit'
import { Coin } from '@offsideswap/aptos-swap-sdk'
import { ConnectWalletButton } from 'components/ConnectWalletButton'

import RotoCollectModal from '../PoolCard/RotoCollectModal'
import RotoStakeModal from '../PoolCard/RotoStakeModal'

const StakeActions = Pool.withStakeActions(RotoStakeModal)

const StakeActionContainer = Pool.withStakeActionContainer(StakeActions, ConnectWalletButton)

export default Pool.withTableActions<Coin>(Pool.withCollectModalTableAction(RotoCollectModal), StakeActionContainer)
