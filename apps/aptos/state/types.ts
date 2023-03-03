import BigNumber from 'bignumber.js'
import { DeserializedPoolConfig } from 'config/constants/types'

export enum VaultKey {
  InvaVaultV1 = 'invaVaultV1',
  InvaVault = 'invaVault',
  InvaFlexibleSideVault = 'invaFlexibleSideVault',
  IfoPool = 'ifoPool',
}

interface CorePoolProps {
  startBlock?: number
  endBlock?: number
  apr?: number
  rawApr?: number
  stakingTokenPrice?: number
  earningTokenPrice?: number
  vaultKey?: VaultKey
}

export interface DeserializedPool extends DeserializedPoolConfig, CorePoolProps {
  totalStaked?: BigNumber
  stakingLimit?: BigNumber
  stakingLimitEndBlock?: number
  userDataLoaded?: boolean
  userData?: {
    allowance: BigNumber
    stakingTokenBalance: BigNumber
    stakedBalance: BigNumber
    pendingReward: BigNumber
  }
}
