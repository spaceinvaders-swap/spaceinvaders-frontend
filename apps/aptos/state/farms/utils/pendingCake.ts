import BigNumber from 'bignumber.js'
import { MapFarmResource, FarmResourcePoolInfo } from 'state/farms/types'

const ACC_ROTO_PRECISION = 1000000000000
const TOTAL_ROTO_RATE_PRECISION = 100000

export function calcPendingRewardRoto(userAmount, userRewardDebt, accRotoPerShare) {
  // ((user_info.amount * acc_roto_per_share / ACC_ROTO_PRECISION - user_info.reward_debt) as u64)
  return new BigNumber(userAmount).times(accRotoPerShare).dividedBy(ACC_ROTO_PRECISION).minus(userRewardDebt)
}

export function calcRewardRotoPerShare(masterChef: MapFarmResource, pid: string | number, getNow: () => number) {
  const poolInfo: FarmResourcePoolInfo = masterChef.pool_info[pid]
  const currentTimestamp = getNow() / 1000
  const lastRewardTimestamp = Number(poolInfo?.last_reward_timestamp)
  const endTimestamp = Number(masterChef.end_timestamp)
  const lastUpkeepTimestamp = Number(masterChef.last_upkeep_timestamp)

  if (poolInfo) {
    let rotoReward = 0
    let accRotoPerShare = Number(poolInfo.acc_roto_per_share)

    if (currentTimestamp > lastRewardTimestamp) {
      let totalAllocPoint = 0
      let rotoRate = 0

      if (poolInfo.is_regular) {
        totalAllocPoint = Number(masterChef.total_regular_alloc_point)
        rotoRate = Number(masterChef.roto_rate_to_regular)
      } else {
        totalAllocPoint = Number(masterChef.total_special_alloc_point)
        rotoRate = Number(masterChef.roto_rate_to_special)
      }

      const supply = Number(poolInfo.total_amount)
      let multiplier = 0

      if (endTimestamp <= lastRewardTimestamp) {
        multiplier = 0
      } else if (currentTimestamp <= endTimestamp) {
        multiplier = new BigNumber(currentTimestamp).minus(max(lastRewardTimestamp, lastUpkeepTimestamp)).toNumber()
      } else {
        multiplier = new BigNumber(endTimestamp).minus(max(lastRewardTimestamp, lastUpkeepTimestamp)).toNumber()
      }

      if (supply > 0 && totalAllocPoint > 0) {
        const reward = new BigNumber(masterChef.roto_per_second)
          .times(rotoRate)
          .times(poolInfo.alloc_point)
          .div(totalAllocPoint)
        rotoReward = new BigNumber(multiplier).times(reward).div(TOTAL_ROTO_RATE_PRECISION).toNumber()
        const perShare = new BigNumber(rotoReward).times(ACC_ROTO_PRECISION).div(supply)
        accRotoPerShare = new BigNumber(poolInfo.acc_roto_per_share).plus(perShare).toNumber()
      }
      return accRotoPerShare
    }
  }
  return 0
}

const max = (a: number, b: number): number => {
  return a >= b ? a : b
}
