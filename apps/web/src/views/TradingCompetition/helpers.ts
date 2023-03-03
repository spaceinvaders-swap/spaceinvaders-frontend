import { getBalanceNumber } from '@spaceinvaders-swap/utils/formatBalance'
import { easterPrizes, PrizesConfig } from 'config/constants/trading-competition/prizes'
import BigNumber from 'bignumber.js'
import useBUSDPrice, { useInvaBusdPrice } from 'hooks/useBUSDPrice'
import { bscTokens } from '@spaceinvaders-swap/tokens'
import { multiplyPriceByAmount } from 'utils/prices'

export const localiseTradingVolume = (value: number, decimals = 0) => {
  return value.toLocaleString('en-US', { maximumFractionDigits: decimals })
}

export const useCompetitionInvaRewards = (userInvaReward: string | number) => {
  const invaAsBigNumber = new BigNumber(userInvaReward as string)
  const invaBalance = getBalanceNumber(invaAsBigNumber)
  const invaPriceBusd = useInvaBusdPrice()
  return {
    invaReward: invaBalance,
    dollarValueOfInvaReward: multiplyPriceByAmount(invaPriceBusd, invaBalance),
  }
}

export const useFanTokenCompetitionRewards = ({
  userInvaRewards,
  userLazioRewards,
  userPortoRewards,
  userSantosRewards,
}: {
  userInvaRewards: string | number
  userLazioRewards: string | number
  userPortoRewards: string | number
  userSantosRewards: string | number
}) => {
  const lazioPriceBUSD = useBUSDPrice(bscTokens.lazio)
  const portoPriceBUSD = useBUSDPrice(bscTokens.porto)
  const santosPriceBUSD = useBUSDPrice(bscTokens.santos)
  const invaAsBigNumber = new BigNumber(userInvaRewards as string)
  const lazioAsBigNumber = new BigNumber(userLazioRewards as string)
  const portoAsBigNumber = new BigNumber(userPortoRewards as string)
  const santosAsBigNumber = new BigNumber(userSantosRewards as string)
  const invaBalance = getBalanceNumber(invaAsBigNumber)
  const lazioBalance = getBalanceNumber(lazioAsBigNumber, 8)
  const portoBalance = getBalanceNumber(portoAsBigNumber, 8)
  const santosBalance = getBalanceNumber(santosAsBigNumber, 8)
  const invaPriceBusd = useInvaBusdPrice()

  const dollarValueOfTokensReward =
    invaPriceBusd && lazioPriceBUSD && portoPriceBUSD && santosPriceBUSD
      ? multiplyPriceByAmount(invaPriceBusd, invaBalance) +
        multiplyPriceByAmount(lazioPriceBUSD, lazioBalance, 8) +
        multiplyPriceByAmount(portoPriceBUSD, portoBalance, 8) +
        multiplyPriceByAmount(santosPriceBUSD, santosBalance, 8)
      : null

  return {
    invaReward: invaBalance,
    lazioReward: lazioBalance,
    portoReward: portoBalance,
    santosReward: santosBalance,
    dollarValueOfTokensReward,
  }
}

export const useMoboxCompetitionRewards = ({
  userInvaRewards,
  userMoboxRewards,
}: {
  userInvaRewards: string | number
  userMoboxRewards: string | number
}) => {
  const moboxPriceBUSD = useBUSDPrice(bscTokens.mbox)
  const invaAsBigNumber = new BigNumber(userInvaRewards as string)
  const moboxAsBigNumber = new BigNumber(userMoboxRewards as string)
  const invaBalance = getBalanceNumber(invaAsBigNumber)
  const moboxBalance = getBalanceNumber(moboxAsBigNumber)
  const invaPriceBusd = useInvaBusdPrice()

  const dollarValueOfTokensReward =
    invaPriceBusd && moboxPriceBUSD
      ? multiplyPriceByAmount(invaPriceBusd, invaBalance) + multiplyPriceByAmount(moboxPriceBUSD, moboxBalance, 8)
      : null

  return {
    invaReward: invaBalance,
    moboxReward: moboxBalance,
    dollarValueOfTokensReward,
  }
}

export const useModCompetitionRewards = ({
  userInvaRewards,
  userDarRewards,
}: {
  userInvaRewards: string | number
  userDarRewards: string | number
}) => {
  const darPriceBUSD = useBUSDPrice(bscTokens.dar)
  const invaAsBigNumber = new BigNumber(userInvaRewards as string)
  const darAsBigNumber = new BigNumber(userDarRewards as string)
  const invaBalance = getBalanceNumber(invaAsBigNumber)
  const darBalance = getBalanceNumber(darAsBigNumber, bscTokens.dar.decimals)
  const invaPriceBusd = useInvaBusdPrice()

  const dollarValueOfTokensReward =
    invaPriceBusd && darPriceBUSD
      ? multiplyPriceByAmount(invaPriceBusd, invaBalance) +
        multiplyPriceByAmount(darPriceBUSD, darBalance, bscTokens.dar.decimals)
      : null

  return {
    invaReward: invaBalance,
    darReward: darBalance,
    dollarValueOfTokensReward,
  }
}

// 1 is a reasonable teamRank default: accessing the first team in the config.
// We use the smart contract userPointReward to get a users' points
// Achievement keys are consistent across different teams regardless of team team rank
// If a teamRank value isn't passed, this helper can be used to return achievement keys for a given userRewardGroup
export const getEasterRewardGroupAchievements = (userRewardGroup: string, teamRank = 1) => {
  const userGroup = easterPrizes[teamRank].filter((prizeGroup) => {
    return prizeGroup.group === userRewardGroup
  })[0]
  return userGroup?.achievements || {}
}

// given we have userPointReward and userRewardGroup, we can find the specific reward because no Rank has same two values.
export const getRewardGroupAchievements = (prizes: PrizesConfig, userRewardGroup: string, userPointReward: string) => {
  const prize = Object.values(prizes)
    .flat()
    .find((rank) => rank.achievements.points === Number(userPointReward) && rank.group === userRewardGroup)
  return prize && prize.achievements
}

export default localiseTradingVolume
