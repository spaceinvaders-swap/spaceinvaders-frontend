import { PoolCategory } from 'config/constants/types'
import BigNumber from 'bignumber.js'
import _toNumber from 'lodash/toNumber'
import _get from 'lodash/get'
import { FixedNumber } from '@ethersproject/bignumber'
import { BIG_ZERO } from '@offsideswap/utils/bigNumber'
import { SECONDS_IN_YEAR } from 'config'

import { ROTO_PID } from 'config/constants'
import { calcRewardRotoPerShare, calcPendingRewardRoto } from 'state/farms/utils/pendingRoto'

export const getPoolApr = ({ rewardTokenPrice, stakingTokenPrice, tokenPerSecond, totalStaked }) => {
  const totalRewardPricePerYear = new BigNumber(rewardTokenPrice).times(tokenPerSecond).times(SECONDS_IN_YEAR)
  const totalStakingTokenInPool = new BigNumber(stakingTokenPrice).times(totalStaked)
  const apr = totalRewardPricePerYear.div(totalStakingTokenInPool).times(100)
  return apr.isNaN() || !apr.isFinite() ? null : apr.toNumber()
}

export function getRewardPerSecondOfRotoFarm({
  rotoPerSecond,
  specialRate,
  regularRate,
  allocPoint,
  specialAllocPoint,
}) {
  const fSpecialRate = FixedNumber.from(specialRate)
  const fRegularRate = FixedNumber.from(regularRate)

  const rotoRate = fSpecialRate.divUnsafe(fSpecialRate.addUnsafe(fRegularRate))

  return FixedNumber.from(rotoPerSecond)
    .mulUnsafe(rotoRate.mulUnsafe(FixedNumber.from(allocPoint)).divUnsafe(FixedNumber.from(specialAllocPoint)))
    .toString()
}

const transformRotoPool = ({
  balances,
  rotoPoolInfo,
  userInfo,
  masterChefData,
  rotoFarm,
  chainId,
  earningTokenPrice,
  getNow,
}) => {
  const userStakedAmount = _get(userInfo, 'amount', '0')

  const rewardPerSecond = getRewardPerSecondOfRotoFarm({
    rotoPerSecond: masterChefData.roto_per_second,
    specialRate: masterChefData.roto_rate_to_special,
    regularRate: masterChefData.roto_rate_to_regular,
    allocPoint: rotoPoolInfo.alloc_point,
    specialAllocPoint: masterChefData.total_special_alloc_point,
  })

  let userData = {
    allowance: BIG_ZERO,
    pendingReward: BIG_ZERO,
    stakedBalance: BIG_ZERO,
    stakingTokenBalance: BIG_ZERO,
  }

  const foundStakingBalance = balances?.find(
    (balance) => balance.type === `0x1::coin::CoinStore<${rotoFarm.token.address}>`,
  )

  const amount = _toNumber(_get(foundStakingBalance, 'data.coin.value', '0'))

  if (amount) {
    userData = { ...userData, stakingTokenBalance: new BigNumber(amount) }
  }

  const totalStaked = _get(rotoPoolInfo, 'total_amount', '0')

  if (_toNumber(userStakedAmount) && _toNumber(totalStaked)) {
    const rewardDebt = _get(userInfo, 'reward_debt', '0')

    const accRotoPerShare = calcRewardRotoPerShare(masterChefData, ROTO_PID, getNow)
    const pendingReward = calcPendingRewardRoto(userStakedAmount, rewardDebt, accRotoPerShare)

    userData = {
      ...userData,
      pendingReward,
      stakedBalance: new BigNumber(userStakedAmount),
    }
  }

  const apr = getPoolApr({
    rewardTokenPrice: _toNumber(earningTokenPrice),
    stakingTokenPrice: _toNumber(earningTokenPrice),
    tokenPerSecond: rewardPerSecond,
    totalStaked,
  })

  return {
    sousId: rotoFarm.pid,
    contractAddress: {
      [chainId]: rotoFarm.lpAddress,
    },
    stakingToken: rotoFarm.token,
    earningToken: rotoFarm.token,
    apr,
    earningTokenPrice: _toNumber(earningTokenPrice),
    stakingTokenPrice: _toNumber(earningTokenPrice),

    isFinished: false,
    poolCategory: PoolCategory.CORE,
    startBlock: 0,
    tokenPerBlock: rewardPerSecond,
    stakingLimit: BIG_ZERO,
    totalStaked: new BigNumber(rotoPoolInfo.total_amount),

    userData,

    profileRequirement: undefined,
  }
}

export default transformRotoPool
