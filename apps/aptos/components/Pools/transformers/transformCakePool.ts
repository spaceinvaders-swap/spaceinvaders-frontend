import { PoolCategory } from 'config/constants/types'
import BigNumber from 'bignumber.js'
import _toNumber from 'lodash/toNumber'
import _get from 'lodash/get'
import { FixedNumber } from '@ethersproject/bignumber'
import { BIG_ZERO } from '@spaceinvaders-swap/utils/bigNumber'
import { SECONDS_IN_YEAR } from 'config'

import { INVA_PID } from 'config/constants'
import { calcRewardInvaPerShare, calcPendingRewardInva } from 'state/farms/utils/pendingInva'

export const getPoolApr = ({ rewardTokenPrice, stakingTokenPrice, tokenPerSecond, totalStaked }) => {
  const totalRewardPricePerYear = new BigNumber(rewardTokenPrice).times(tokenPerSecond).times(SECONDS_IN_YEAR)
  const totalStakingTokenInPool = new BigNumber(stakingTokenPrice).times(totalStaked)
  const apr = totalRewardPricePerYear.div(totalStakingTokenInPool).times(100)
  return apr.isNaN() || !apr.isFinite() ? null : apr.toNumber()
}

export function getRewardPerSecondOfInvaFarm({
  invaPerSecond,
  specialRate,
  regularRate,
  allocPoint,
  specialAllocPoint,
}) {
  const fSpecialRate = FixedNumber.from(specialRate)
  const fRegularRate = FixedNumber.from(regularRate)

  const invaRate = fSpecialRate.divUnsafe(fSpecialRate.addUnsafe(fRegularRate))

  return FixedNumber.from(invaPerSecond)
    .mulUnsafe(invaRate.mulUnsafe(FixedNumber.from(allocPoint)).divUnsafe(FixedNumber.from(specialAllocPoint)))
    .toString()
}

const transformInvaPool = ({
  balances,
  invaPoolInfo,
  userInfo,
  masterChefData,
  invaFarm,
  chainId,
  earningTokenPrice,
  getNow,
}) => {
  const userStakedAmount = _get(userInfo, 'amount', '0')

  const rewardPerSecond = getRewardPerSecondOfInvaFarm({
    invaPerSecond: masterChefData.inva_per_second,
    specialRate: masterChefData.inva_rate_to_special,
    regularRate: masterChefData.inva_rate_to_regular,
    allocPoint: invaPoolInfo.alloc_point,
    specialAllocPoint: masterChefData.total_special_alloc_point,
  })

  let userData = {
    allowance: BIG_ZERO,
    pendingReward: BIG_ZERO,
    stakedBalance: BIG_ZERO,
    stakingTokenBalance: BIG_ZERO,
  }

  const foundStakingBalance = balances?.find(
    (balance) => balance.type === `0x1::coin::CoinStore<${invaFarm.token.address}>`,
  )

  const amount = _toNumber(_get(foundStakingBalance, 'data.coin.value', '0'))

  if (amount) {
    userData = { ...userData, stakingTokenBalance: new BigNumber(amount) }
  }

  const totalStaked = _get(invaPoolInfo, 'total_amount', '0')

  if (_toNumber(userStakedAmount) && _toNumber(totalStaked)) {
    const rewardDebt = _get(userInfo, 'reward_debt', '0')

    const accInvaPerShare = calcRewardInvaPerShare(masterChefData, INVA_PID, getNow)
    const pendingReward = calcPendingRewardInva(userStakedAmount, rewardDebt, accInvaPerShare)

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
    sousId: invaFarm.pid,
    contractAddress: {
      [chainId]: invaFarm.lpAddress,
    },
    stakingToken: invaFarm.token,
    earningToken: invaFarm.token,
    apr,
    earningTokenPrice: _toNumber(earningTokenPrice),
    stakingTokenPrice: _toNumber(earningTokenPrice),

    isFinished: false,
    poolCategory: PoolCategory.CORE,
    startBlock: 0,
    tokenPerBlock: rewardPerSecond,
    stakingLimit: BIG_ZERO,
    totalStaked: new BigNumber(invaPoolInfo.total_amount),

    userData,

    profileRequirement: undefined,
  }
}

export default transformInvaPool
