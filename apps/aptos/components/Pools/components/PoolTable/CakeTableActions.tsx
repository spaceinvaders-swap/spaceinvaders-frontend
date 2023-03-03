import { Pool } from '@spaceinvaders-swap/uikit'
import { Coin } from '@spaceinvaders-swap/aptos-swap-sdk'
import { ConnectWalletButton } from 'components/ConnectWalletButton'

import InvaCollectModal from '../PoolCard/InvaCollectModal'
import InvaStakeModal from '../PoolCard/InvaStakeModal'

const StakeActions = Pool.withStakeActions(InvaStakeModal)

const StakeActionContainer = Pool.withStakeActionContainer(StakeActions, ConnectWalletButton)

export default Pool.withTableActions<Coin>(Pool.withCollectModalTableAction(InvaCollectModal), StakeActionContainer)
