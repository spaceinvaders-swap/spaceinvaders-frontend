import { ChainId } from '@spaceinvaders-swap/sdk'
import { Pool } from '@spaceinvaders-swap/uikit'
import addresses from 'config/constants/contracts'
import { VaultKey } from 'state/types'

export const getAddress = (address: Pool.Address, chainId?: number): string => {
  return address[chainId] ? address[chainId] : address[ChainId.BSC]
}

export const getMasterChefAddress = (chainId?: number) => {
  return getAddress(addresses.masterChef, chainId)
}
export const getMasterChefV1Address = () => {
  return getAddress(addresses.masterChefV1)
}
export const getMulticallAddress = (chainId?: number) => {
  return getAddress(addresses.multiCall, chainId)
}
export const getLotteryV2Address = () => {
  return getAddress(addresses.lotteryV2)
}
export const getSpaceinvadersProfileAddress = () => {
  return getAddress(addresses.spaceinvadersProfile)
}
export const getSpaceinvadersBunniesAddress = () => {
  return getAddress(addresses.spaceinvadersBunnies)
}
export const getBunnyFactoryAddress = () => {
  return getAddress(addresses.bunnyFactory)
}
export const getPredictionsV1Address = () => {
  return getAddress(addresses.predictionsV1)
}
export const getClaimRefundAddress = () => {
  return getAddress(addresses.claimRefund)
}
export const getPointCenterIfoAddress = () => {
  return getAddress(addresses.pointCenterIfo)
}
export const getBunnySpecialAddress = () => {
  return getAddress(addresses.bunnySpecial)
}
export const getTradingCompetitionAddressEaster = () => {
  return getAddress(addresses.tradingCompetitionEaster)
}
export const getTradingCompetitionAddressFanToken = () => {
  return getAddress(addresses.tradingCompetitionFanToken)
}

export const getTradingCompetitionAddressMobox = () => {
  return getAddress(addresses.tradingCompetitionMobox)
}

export const getTradingCompetitionAddressMoD = () => {
  return getAddress(addresses.tradingCompetitionMoD)
}

export const getEasterNftAddress = () => {
  return getAddress(addresses.easterNft)
}

export const getVaultPoolAddress = (vaultKey: VaultKey) => {
  if (!vaultKey) {
    return null
  }
  return getAddress(addresses[vaultKey])
}

export const getInvaVaultAddress = () => {
  return getAddress(addresses.invaVault)
}

export const getInvaFlexibleSideVaultAddress = () => {
  return getAddress(addresses.invaFlexibleSideVault)
}

export const getBunnySpecialInvaVaultAddress = () => {
  return getAddress(addresses.bunnySpecialInvaVault)
}
export const getBunnySpecialPredictionAddress = () => {
  return getAddress(addresses.bunnySpecialPrediction)
}
export const getBunnySpecialLotteryAddress = () => {
  return getAddress(addresses.bunnySpecialLottery)
}
export const getBunnySpecialXmasAddress = () => {
  return getAddress(addresses.bunnySpecialXmas)
}
export const getFarmAuctionAddress = () => {
  return getAddress(addresses.farmAuction)
}
export const getAnniversaryAchievement = () => {
  return getAddress(addresses.AnniversaryAchievement)
}

export const getNftMarketAddress = () => {
  return getAddress(addresses.nftMarket)
}
export const getNftSaleAddress = () => {
  return getAddress(addresses.nftSale)
}
export const getSpaceinvadersSquadAddress = () => {
  return getAddress(addresses.spaceinvadersSquad)
}
export const getPotteryDrawAddress = () => {
  return getAddress(addresses.potteryDraw)
}

export const getZapAddress = (chainId?: number) => {
  return getAddress(addresses.zap, chainId)
}
export const getIInvaAddress = () => {
  return getAddress(addresses.iInva)
}

export const getBInvaFarmBoosterAddress = () => {
  return getAddress(addresses.bInvaFarmBooster)
}

export const getBInvaFarmBoosterProxyFactoryAddress = () => {
  return getAddress(addresses.bInvaFarmBoosterProxyFactory)
}

export const getNonBscVaultAddress = (chainId?: number) => {
  return getAddress(addresses.nonBscVault, chainId)
}

export const getCrossFarmingSenderAddress = (chainId?: number) => {
  return getAddress(addresses.crossFarmingSender, chainId)
}

export const getCrossFarmingReceiverAddress = (chainId?: number) => {
  return getAddress(addresses.crossFarmingReceiver, chainId)
}

export const getMMLinkedPoolAddress = (chainId?: number) => {
  return getAddress(addresses.mmLinkedPool, chainId)
}

export const getStableSwapNativeHelperAddress = (chainId?: number) => {
  return getAddress(addresses.stableSwapNativeHelper, chainId)
}
