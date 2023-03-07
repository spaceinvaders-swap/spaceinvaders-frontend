import { getBalanceNumber } from '@offsideswap/utils/formatBalance'
import { easterPrizes, PrizesConfig } from 'config/constants/trading-competition/prizes'
import BigNumber from 'bignumber.js'
import useBUSDPrice, { useRotoBusdPrice } from 'hooks/useBUSDPrice'
import { bscTokens } from '@offsideswap/tokens'
import { multiplyPriceByAmount } from 'utils/prices'

export const localiseTradingVolume = (value: number, decimals = 0) => {
  return value.toLocaleString('en-US', { maximumFractionDigits: decimals })
}

export const useCompetitionRotoRewards = (userRotoReward: string | number) => {
  const rotoAsBigNumber = new BigNumber(userRotoReward as string)
  const rotoBalance = getBalanceNumber(rotoAsBigNumber)
  const rotoPriceBusd = useRotoBusdPrice()
  return {
    rotoReward: rotoBalance,
    dollarValueOfRotoReward: multiplyPriceByAmount(rotoPriceBusd, rotoBalance),
  }
}

export const useFanTokenCompetitionRewards = ({
  userRotoRewards,
  userLazioRewards,
  userPortoRewards,
  userSantosRewards,
}: {
  userRotoRewards: string | number
  userLazioRewards: string | number
  userPortoRewards: string | number
  userSantosRewards: string | number
}) => {
  const lazioPriceBUSD = useBUSDPrice(bscTokens.lazio)
  const portoPriceBUSD = useBUSDPrice(bscTokens.porto)
  const santosPriceBUSD = useBUSDPrice(bscTokens.santos)
  const rotoAsBigNumber = new BigNumber(userRotoRewards as string)
  const lazioAsBigNumber = new BigNumber(userLazioRewards as string)
  const portoAsBigNumber = new BigNumber(userPortoRewards as string)
  const santosAsBigNumber = new BigNumber(userSantosRewards as string)
  const rotoBalance = getBalanceNumber(rotoAsBigNumber)
  const lazioBalance = getBalanceNumber(lazioAsBigNumber, 8)
  const portoBalance = getBalanceNumber(portoAsBigNumber, 8)
  const santosBalance = getBalanceNumber(santosAsBigNumber, 8)
  const rotoPriceBusd = useRotoBusdPrice()

  const dollarValueOfTokensReward =
    rotoPriceBusd && lazioPriceBUSD && portoPriceBUSD && santosPriceBUSD
      ? multiplyPriceByAmount(rotoPriceBusd, rotoBalance) +
        multiplyPriceByAmount(lazioPriceBUSD, lazioBalance, 8) +
        multiplyPriceByAmount(portoPriceBUSD, portoBalance, 8) +
        multiplyPriceByAmount(santosPriceBUSD, santosBalance, 8)
      : null

  return {
    rotoReward: rotoBalance,
    lazioReward: lazioBalance,
    portoReward: portoBalance,
    santosReward: santosBalance,
    dollarValueOfTokensReward,
  }
}

export const useMoboxCompetitionRewards = ({
  userRotoRewards,
  userMoboxRewards,
}: {
  userRotoRewards: string | number
  userMoboxRewards: string | number
}) => {
  const moboxPriceBUSD = useBUSDPrice(bscTokens.mbox)
  const rotoAsBigNumber = new BigNumber(userRotoRewards as string)
  const moboxAsBigNumber = new BigNumber(userMoboxRewards as string)
  const rotoBalance = getBalanceNumber(rotoAsBigNumber)
  const moboxBalance = getBalanceNumber(moboxAsBigNumber)
  const rotoPriceBusd = useRotoBusdPrice()

  const dollarValueOfTokensReward =
    rotoPriceBusd && moboxPriceBUSD
      ? multiplyPriceByAmount(rotoPriceBusd, rotoBalance) + multiplyPriceByAmount(moboxPriceBUSD, moboxBalance, 8)
      : null

  return {
    rotoReward: rotoBalance,
    moboxReward: moboxBalance,
    dollarValueOfTokensReward,
  }
}

export const useModCompetitionRewards = ({
  userRotoRewards,
  userDarRewards,
}: {
  userRotoRewards: string | number
  userDarRewards: string | number
}) => {
  const darPriceBUSD = useBUSDPrice(bscTokens.dar)
  const rotoAsBigNumber = new BigNumber(userRotoRewards as string)
  const darAsBigNumber = new BigNumber(userDarRewards as string)
  const rotoBalance = getBalanceNumber(rotoAsBigNumber)
  const darBalance = getBalanceNumber(darAsBigNumber, bscTokens.dar.decimals)
  const rotoPriceBusd = useRotoBusdPrice()

  const dollarValueOfTokensReward =
    rotoPriceBusd && darPriceBUSD
      ? multiplyPriceByAmount(rotoPriceBusd, rotoBalance) +
        multiplyPriceByAmount(darPriceBUSD, darBalance, bscTokens.dar.decimals)
      : null

  return {
    rotoReward: rotoBalance,
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
