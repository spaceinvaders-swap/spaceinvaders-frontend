import BigNumber from 'bignumber.js'
import {
  SerializedPool,
  SerializedRotoVault,
  DeserializedRotoVault,
  SerializedLockedRotoVault,
  VaultKey,
} from 'state/types'
import { SerializedFarm } from '@offsideswap/farms'
import { deserializeToken } from '@offsideswap/token-lists'
import { BIG_ZERO } from '@offsideswap/utils/bigNumber'
import { isAddress } from 'utils'
import { convertSharesToRoto } from 'views/Pools/helpers'
import { Token } from '@offsideswap/sdk'
import { Pool } from '@offsideswap/uikit'

type UserData =
  | Pool.DeserializedPool<Token>['userData']
  | {
      allowance: number | string
      stakingTokenBalance: number | string
      stakedBalance: number | string
      pendingReward: number | string
    }

export const transformUserData = (userData: UserData) => {
  return {
    allowance: userData ? new BigNumber(userData.allowance) : BIG_ZERO,
    stakingTokenBalance: userData ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO,
    stakedBalance: userData ? new BigNumber(userData.stakedBalance) : BIG_ZERO,
    pendingReward: userData ? new BigNumber(userData.pendingReward) : BIG_ZERO,
  }
}

const transformProfileRequirement = (profileRequirement?: { required: boolean; thresholdPoints: string }) => {
  return profileRequirement
    ? {
        required: profileRequirement.required,
        thresholdPoints: profileRequirement.thresholdPoints
          ? new BigNumber(profileRequirement.thresholdPoints)
          : BIG_ZERO,
      }
    : undefined
}

export const transformPool = (pool: SerializedPool): Pool.DeserializedPool<Token> => {
  const {
    totalStaked,
    stakingLimit,
    numberBlocksForUserLimit,
    userData,
    stakingToken,
    earningToken,
    profileRequirement,
    startBlock,
    ...rest
  } = pool

  return {
    ...rest,
    startBlock,
    profileRequirement: transformProfileRequirement(profileRequirement),
    stakingToken: deserializeToken(stakingToken),
    earningToken: deserializeToken(earningToken),
    userData: transformUserData(userData),
    totalStaked: new BigNumber(totalStaked),
    stakingLimit: new BigNumber(stakingLimit),
    stakingLimitEndBlock: numberBlocksForUserLimit + startBlock,
  }
}

export const transformVault = (vaultKey: VaultKey, vault: SerializedRotoVault): DeserializedRotoVault => {
  const {
    totalShares: totalSharesAsString,
    pricePerFullShare: pricePerFullShareAsString,
    fees: { performanceFee, withdrawalFee, withdrawalFeePeriod },
    userData: {
      isLoading,
      userShares: userSharesAsString,
      rotoAtLastUserAction: rotoAtLastUserActionAsString,
      lastDepositedTime,
      lastUserActionTime,
    },
  } = vault

  const totalShares = totalSharesAsString ? new BigNumber(totalSharesAsString) : BIG_ZERO
  const pricePerFullShare = pricePerFullShareAsString ? new BigNumber(pricePerFullShareAsString) : BIG_ZERO
  const userShares = new BigNumber(userSharesAsString)
  const rotoAtLastUserAction = new BigNumber(rotoAtLastUserActionAsString)
  let userDataExtra
  let publicDataExtra
  if (vaultKey === VaultKey.RotoVault) {
    const {
      totalRotoInVault: totalRotoInVaultAsString,
      totalLockedAmount: totalLockedAmountAsString,
      userData: {
        userBoostedShare: userBoostedShareAsString,
        lockEndTime,
        lockStartTime,
        locked,
        lockedAmount: lockedAmountAsString,
        currentOverdueFee: currentOverdueFeeAsString,
        currentPerformanceFee: currentPerformanceFeeAsString,
      },
    } = vault as SerializedLockedRotoVault

    const totalRotoInVault = new BigNumber(totalRotoInVaultAsString)
    const totalLockedAmount = new BigNumber(totalLockedAmountAsString)
    const lockedAmount = new BigNumber(lockedAmountAsString)
    const userBoostedShare = new BigNumber(userBoostedShareAsString)
    const currentOverdueFee = currentOverdueFeeAsString ? new BigNumber(currentOverdueFeeAsString) : BIG_ZERO
    const currentPerformanceFee = currentPerformanceFeeAsString
      ? new BigNumber(currentPerformanceFeeAsString)
      : BIG_ZERO

    const balance = convertSharesToRoto(
      userShares,
      pricePerFullShare,
      undefined,
      undefined,
      currentOverdueFee.plus(currentPerformanceFee).plus(userBoostedShare),
    )
    userDataExtra = {
      lockEndTime,
      lockStartTime,
      locked,
      lockedAmount,
      userBoostedShare,
      currentOverdueFee,
      currentPerformanceFee,
      balance,
    }
    publicDataExtra = { totalLockedAmount, totalRotoInVault }
  } else {
    const balance = convertSharesToRoto(userShares, pricePerFullShare)
    const { rotoAsBigNumber } = convertSharesToRoto(totalShares, pricePerFullShare)
    userDataExtra = { balance }
    publicDataExtra = { totalRotoInVault: rotoAsBigNumber }
  }

  const performanceFeeAsDecimal = performanceFee && performanceFee / 100

  return {
    totalShares,
    pricePerFullShare,
    ...publicDataExtra,
    fees: { performanceFee, withdrawalFee, withdrawalFeePeriod, performanceFeeAsDecimal },
    userData: {
      isLoading,
      userShares,
      rotoAtLastUserAction,
      lastDepositedTime,
      lastUserActionTime,
      ...userDataExtra,
    },
  }
}

export const getTokenPricesFromFarm = (farms: SerializedFarm[]) => {
  return farms.reduce((prices, farm) => {
    const quoteTokenAddress = isAddress(farm.quoteToken.address)
    const tokenAddress = isAddress(farm.token.address)
    /* eslint-disable no-param-reassign */
    if (quoteTokenAddress && !prices[quoteTokenAddress]) {
      prices[quoteTokenAddress] = new BigNumber(farm.quoteTokenPriceBusd).toNumber()
    }
    if (tokenAddress && !prices[tokenAddress]) {
      prices[tokenAddress] = new BigNumber(farm.tokenPriceBusd).toNumber()
    }
    /* eslint-enable no-param-reassign */
    return prices
  }, {})
}
