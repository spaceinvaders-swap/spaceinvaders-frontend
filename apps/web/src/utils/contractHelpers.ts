import type { Signer } from '@ethersproject/abstract-signer'
import type { Provider } from '@ethersproject/providers'
import { provider } from 'utils/wagmi'
import { Contract } from '@ethersproject/contracts'
import poolsConfig from 'config/constants/pools'
import { PoolCategory } from 'config/constants/types'
import { INVA } from '@spaceinvaders-swap/tokens'

// Addresses
import {
  getAddress,
  getSpaceinvadersProfileAddress,
  getSpaceinvadersBunniesAddress,
  getBunnyFactoryAddress,
  getBunnySpecialAddress,
  getLotteryV2Address,
  getMasterChefAddress,
  getMasterChefV1Address,
  getPointCenterIfoAddress,
  getClaimRefundAddress,
  getTradingCompetitionAddressEaster,
  getEasterNftAddress,
  getInvaVaultAddress,
  getMulticallAddress,
  getBunnySpecialInvaVaultAddress,
  getBunnySpecialPredictionAddress,
  getBunnySpecialLotteryAddress,
  getFarmAuctionAddress,
  getAnniversaryAchievement,
  getNftMarketAddress,
  getNftSaleAddress,
  getSpaceinvadersSquadAddress,
  getTradingCompetitionAddressFanToken,
  getTradingCompetitionAddressMobox,
  getTradingCompetitionAddressMoD,
  getBunnySpecialXmasAddress,
  getIInvaAddress,
  getPotteryDrawAddress,
  getInvaFlexibleSideVaultAddress,
  getPredictionsV1Address,
  getBInvaFarmBoosterAddress,
  getBInvaFarmBoosterProxyFactoryAddress,
  getNonBscVaultAddress,
  getCrossFarmingSenderAddress,
  getCrossFarmingReceiverAddress,
  getMMLinkedPoolAddress,
  getStableSwapNativeHelperAddress,
} from 'utils/addressHelpers'

// ABI
import profileABI from 'config/abi/spaceinvadersProfile.json'
import spaceinvadersBunniesAbi from 'config/abi/spaceinvadersBunnies.json'
import bunnyFactoryAbi from 'config/abi/bunnyFactory.json'
import bunnySpecialAbi from 'config/abi/bunnySpecial.json'
import bep20Abi from 'config/abi/erc20.json'
import erc721Abi from 'config/abi/erc721.json'
import lpTokenAbi from 'config/abi/lpToken.json'
import invaAbi from 'config/abi/inva.json'
import ifoV1Abi from 'config/abi/ifoV1.json'
import ifoV2Abi from 'config/abi/ifoV2.json'
import pointCenterIfo from 'config/abi/pointCenterIfo.json'
import lotteryV2Abi from 'config/abi/lotteryV2.json'
import masterChef from 'config/abi/masterchef.json'
import masterChefV1 from 'config/abi/masterchefV1.json'
import sousChef from 'config/abi/sousChef.json'
import sousChefV2 from 'config/abi/sousChefV2.json'
import sousChefBnb from 'config/abi/sousChefBnb.json'
import claimRefundAbi from 'config/abi/claimRefund.json'
import tradingCompetitionEasterAbi from 'config/abi/tradingCompetitionEaster.json'
import tradingCompetitionFanTokenAbi from 'config/abi/tradingCompetitionFanToken.json'
import tradingCompetitionMoboxAbi from 'config/abi/tradingCompetitionMobox.json'
import tradingCompetitionMoDAbi from 'config/abi/tradingCompetitionMoD.json'
import easterNftAbi from 'config/abi/easterNft.json'
import invaVaultV2Abi from 'config/abi/invaVaultV2.json'
import invaFlexibleSideVaultV2Abi from 'config/abi/invaFlexibleSideVaultV2.json'
import predictionsAbi from 'config/abi/predictions.json'
import predictionsV1Abi from 'config/abi/predictionsV1.json'
import chainlinkOracleAbi from 'config/abi/chainlinkOracle.json'
import MultiCallAbi from 'config/abi/Multicall.json'
import bunnySpecialInvaVaultAbi from 'config/abi/bunnySpecialInvaVault.json'
import bunnySpecialPredictionAbi from 'config/abi/bunnySpecialPrediction.json'
import bunnySpecialLotteryAbi from 'config/abi/bunnySpecialLottery.json'
import bunnySpecialXmasAbi from 'config/abi/bunnySpecialXmas.json'
import farmAuctionAbi from 'config/abi/farmAuction.json'
import anniversaryAchievementAbi from 'config/abi/anniversaryAchievement.json'
import nftMarketAbi from 'config/abi/nftMarket.json'
import nftSaleAbi from 'config/abi/nftSale.json'
import spaceinvadersSquadAbi from 'config/abi/spaceinvadersSquad.json'
import erc721CollectionAbi from 'config/abi/erc721collection.json'
import potteryVaultAbi from 'config/abi/potteryVaultAbi.json'
import potteryDrawAbi from 'config/abi/potteryDrawAbi.json'
import iInvaAbi from 'config/abi/iInva.json'
import ifoV3Abi from 'config/abi/ifoV3.json'
import invaPredictionsAbi from 'config/abi/invaPredictions.json'
import bInvaFarmBoosterAbi from 'config/abi/bInvaFarmBooster.json'
import bInvaFarmBoosterProxyFactoryAbi from 'config/abi/bInvaFarmBoosterProxyFactory.json'
import bInvaProxyAbi from 'config/abi/bInvaProxy.json'
import nonBscVault from 'config/abi/nonBscVault.json'
import crossFarmingSenderAbi from 'config/abi/crossFarmingSender.json'
import crossFarmingReceiverAbi from 'config/abi/crossFarmingReceiver.json'
import crossFarmingProxyAbi from 'config/abi/crossFarmingProxy.json'
import mmLinkedPoolAbi from 'config/abi/mmLinkedPool.json'
import stableSwapNativeHelperAbi from 'config/abi/stableSwapNativeHelper.json'

// Types
import type {
  ChainlinkOracle,
  FarmAuction,
  Predictions,
  AnniversaryAchievement,
  IfoV1,
  IfoV2,
  Erc20,
  Erc721,
  Inva,
  BunnyFactory,
  SpaceinvadersBunnies,
  SpaceinvadersProfile,
  LotteryV2,
  Masterchef,
  MasterchefV1,
  SousChef,
  SousChefV2,
  BunnySpecial,
  LpToken,
  ClaimRefund,
  TradingCompetitionEaster,
  TradingCompetitionFanToken,
  EasterNft,
  Multicall,
  BunnySpecialInvaVault,
  BunnySpecialPrediction,
  BunnySpecialLottery,
  NftMarket,
  NftSale,
  SpaceinvadersSquad,
  Erc721collection,
  PointCenterIfo,
  InvaVaultV2,
  InvaFlexibleSideVaultV2,
  TradingCompetitionMobox,
  IInva,
  TradingCompetitionMoD,
  PotteryVaultAbi,
  PotteryDrawAbi,
  PredictionsV1,
  BInvaFarmBooster,
  BInvaFarmBoosterProxyFactory,
  BInvaProxy,
  NonBscVault,
  CrossFarmingSender,
  CrossFarmingReceiver,
  CrossFarmingProxy,
  MmLinkedPool,
  StableSwapNativeHelper,
} from 'config/abi/types'
import { ChainId } from '@spaceinvaders-swap/sdk'

export const getContract = ({
  abi,
  address,
  chainId = ChainId.BSC,
  signer,
}: {
  abi: any
  address: string
  chainId?: ChainId
  signer?: Signer | Provider
}) => {
  const signerOrProvider = signer ?? provider({ chainId })
  return new Contract(address, abi, signerOrProvider)
}

export const getBep20Contract = (address: string, signer?: Signer | Provider) => {
  return getContract({ abi: bep20Abi, address, signer }) as Erc20
}
export const getErc721Contract = (address: string, signer?: Signer | Provider) => {
  return getContract({ abi: erc721Abi, address, signer }) as Erc721
}
export const getLpContract = (address: string, chainId?: number, signer?: Signer | Provider) => {
  return getContract({ abi: lpTokenAbi, address, signer, chainId }) as LpToken
}
export const getIfoV1Contract = (address: string, signer?: Signer | Provider) => {
  return getContract({ abi: ifoV1Abi, address, signer }) as IfoV1
}
export const getIfoV2Contract = (address: string, signer?: Signer | Provider) => {
  return getContract({ abi: ifoV2Abi, address, signer }) as IfoV2
}
export const getIfoV3Contract = (address: string, signer?: Signer | Provider) => {
  return getContract({ abi: ifoV3Abi, address, signer })
}
export const getMMLinkedPoolContract = (signer?: Signer | Provider, chainId?: number) => {
  return getContract({ abi: mmLinkedPoolAbi, address: getMMLinkedPoolAddress(chainId), signer }) as MmLinkedPool
}
export const getSouschefContract = (id: number, signer?: Signer | Provider) => {
  const config = poolsConfig.find((pool) => pool.sousId === id)
  const abi = config.poolCategory === PoolCategory.BINANCE ? sousChefBnb : sousChef
  return getContract({ abi, address: getAddress(config.contractAddress), signer }) as SousChef
}
export const getSouschefV2Contract = (id: number, signer?: Signer | Provider) => {
  const config = poolsConfig.find((pool) => pool.sousId === id)
  return getContract({ abi: sousChefV2, address: getAddress(config.contractAddress), signer }) as SousChefV2
}

export const getPointCenterIfoContract = (signer?: Signer | Provider) => {
  return getContract({ abi: pointCenterIfo, address: getPointCenterIfoAddress(), signer }) as PointCenterIfo
}
export const getInvaContract = (signer?: Signer | Provider, chainId?: number) => {
  return getContract({
    abi: invaAbi,
    address: chainId ? INVA[chainId].address : INVA[ChainId.BSC].address,
    signer,
  }) as Inva
}
export const getProfileContract = (signer?: Signer | Provider) => {
  return getContract({ abi: profileABI, address: getSpaceinvadersProfileAddress(), signer }) as SpaceinvadersProfile
}
export const getSpaceinvadersBunniesContract = (signer?: Signer | Provider) => {
  return getContract({ abi: spaceinvadersBunniesAbi, address: getSpaceinvadersBunniesAddress(), signer }) as SpaceinvadersBunnies
}
export const getBunnyFactoryContract = (signer?: Signer | Provider) => {
  return getContract({ abi: bunnyFactoryAbi, address: getBunnyFactoryAddress(), signer }) as BunnyFactory
}
export const getBunnySpecialContract = (signer?: Signer | Provider) => {
  return getContract({ abi: bunnySpecialAbi, address: getBunnySpecialAddress(), signer }) as BunnySpecial
}
export const getLotteryV2Contract = (signer?: Signer | Provider) => {
  return getContract({ abi: lotteryV2Abi, address: getLotteryV2Address(), signer }) as LotteryV2
}
export const getMasterchefContract = (signer?: Signer | Provider, chainId?: number) => {
  return getContract({ abi: masterChef, address: getMasterChefAddress(chainId), signer }) as Masterchef
}
export const getMasterchefV1Contract = (signer?: Signer | Provider) => {
  return getContract({ abi: masterChefV1, address: getMasterChefV1Address(), signer }) as MasterchefV1
}
export const getClaimRefundContract = (signer?: Signer | Provider) => {
  return getContract({ abi: claimRefundAbi, address: getClaimRefundAddress(), signer }) as ClaimRefund
}
export const getTradingCompetitionContractEaster = (signer?: Signer | Provider) => {
  return getContract({
    abi: tradingCompetitionEasterAbi,
    address: getTradingCompetitionAddressEaster(),
    signer,
  }) as TradingCompetitionEaster
}

export const getTradingCompetitionContractFanToken = (signer?: Signer | Provider) => {
  return getContract({
    abi: tradingCompetitionFanTokenAbi,
    address: getTradingCompetitionAddressFanToken(),
    signer,
  }) as TradingCompetitionFanToken
}
export const getTradingCompetitionContractMobox = (signer?: Signer | Provider) => {
  return getContract({
    abi: tradingCompetitionMoboxAbi,
    address: getTradingCompetitionAddressMobox(),
    signer,
  }) as TradingCompetitionMobox
}

export const getTradingCompetitionContractMoD = (signer?: Signer | Provider) => {
  return getContract({
    abi: tradingCompetitionMoDAbi,
    address: getTradingCompetitionAddressMoD(),
    signer,
  }) as TradingCompetitionMoD
}

export const getEasterNftContract = (signer?: Signer | Provider) => {
  return getContract({ abi: easterNftAbi, address: getEasterNftAddress(), signer }) as EasterNft
}
export const getInvaVaultV2Contract = (signer?: Signer | Provider) => {
  return getContract({ abi: invaVaultV2Abi, address: getInvaVaultAddress(), signer }) as InvaVaultV2
}

export const getInvaFlexibleSideVaultV2Contract = (signer?: Signer | Provider) => {
  return getContract({
    abi: invaFlexibleSideVaultV2Abi,
    address: getInvaFlexibleSideVaultAddress(),
    signer,
  }) as InvaFlexibleSideVaultV2
}

export const getPredictionsContract = (address: string, signer?: Signer | Provider) => {
  return getContract({ abi: predictionsAbi, address, signer }) as Predictions
}

export const getPredictionsV1Contract = (signer?: Signer | Provider) => {
  return getContract({ abi: predictionsV1Abi, address: getPredictionsV1Address(), signer }) as PredictionsV1
}

export const getInvaPredictionsContract = (address: string, signer?: Signer | Provider) => {
  return getContract({ abi: invaPredictionsAbi, address, signer }) as Predictions
}

export const getChainlinkOracleContract = (address: string, signer?: Signer | Provider, chainId?: number) => {
  return getContract({ abi: chainlinkOracleAbi, address, signer, chainId }) as ChainlinkOracle
}
export const getMulticallContract = (chainId: ChainId) => {
  return getContract({ abi: MultiCallAbi, address: getMulticallAddress(chainId), chainId }) as Multicall
}
export const getBunnySpecialInvaVaultContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: bunnySpecialInvaVaultAbi,
    address: getBunnySpecialInvaVaultAddress(),
    signer,
  }) as BunnySpecialInvaVault
}
export const getBunnySpecialPredictionContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: bunnySpecialPredictionAbi,
    address: getBunnySpecialPredictionAddress(),
    signer,
  }) as BunnySpecialPrediction
}
export const getBunnySpecialLotteryContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: bunnySpecialLotteryAbi,
    address: getBunnySpecialLotteryAddress(),
    signer,
  }) as BunnySpecialLottery
}
export const getBunnySpecialXmasContract = (signer?: Signer | Provider) => {
  return getContract({ abi: bunnySpecialXmasAbi, address: getBunnySpecialXmasAddress(), signer })
}
export const getFarmAuctionContract = (signer?: Signer | Provider) => {
  return getContract({ abi: farmAuctionAbi, address: getFarmAuctionAddress(), signer }) as unknown as FarmAuction
}
export const getAnniversaryAchievementContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: anniversaryAchievementAbi,
    address: getAnniversaryAchievement(),
    signer,
  }) as AnniversaryAchievement
}

export const getNftMarketContract = (signer?: Signer | Provider) => {
  return getContract({ abi: nftMarketAbi, address: getNftMarketAddress(), signer }) as NftMarket
}
export const getNftSaleContract = (signer?: Signer | Provider) => {
  return getContract({ abi: nftSaleAbi, address: getNftSaleAddress(), signer }) as NftSale
}
export const getSpaceinvadersSquadContract = (signer?: Signer | Provider) => {
  return getContract({ abi: spaceinvadersSquadAbi, address: getSpaceinvadersSquadAddress(), signer }) as SpaceinvadersSquad
}
export const getErc721CollectionContract = (signer?: Signer | Provider, address?: string) => {
  return getContract({ abi: erc721CollectionAbi, address, signer }) as Erc721collection
}

export const getPotteryVaultContract = (address: string, signer?: Signer | Provider) => {
  return getContract({ abi: potteryVaultAbi, address, signer }) as PotteryVaultAbi
}

export const getPotteryDrawContract = (signer?: Signer | Provider) => {
  return getContract({ abi: potteryDrawAbi, address: getPotteryDrawAddress(), signer }) as PotteryDrawAbi
}

export const getIfoCreditAddressContract = (signer?: Signer | Provider) => {
  return getContract({ abi: iInvaAbi, address: getIInvaAddress(), signer }) as IInva
}

export const getBInvaFarmBoosterContract = (signer?: Signer | Provider) => {
  return getContract({ abi: bInvaFarmBoosterAbi, address: getBInvaFarmBoosterAddress(), signer }) as BInvaFarmBooster
}

export const getBInvaFarmBoosterProxyFactoryContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: bInvaFarmBoosterProxyFactoryAbi,
    address: getBInvaFarmBoosterProxyFactoryAddress(),
    signer,
  }) as BInvaFarmBoosterProxyFactory
}

export const getBInvaProxyContract = (proxyContractAddress: string, signer?: Signer | Provider) => {
  return getContract({ abi: bInvaProxyAbi, address: proxyContractAddress, signer }) as BInvaProxy
}

export const getNonBscVaultContract = (signer?: Signer | Provider, chainId?: number) => {
  return getContract({ abi: nonBscVault, address: getNonBscVaultAddress(chainId), chainId, signer }) as NonBscVault
}

export const getCrossFarmingSenderContract = (signer?: Signer | Provider, chainId?: number) => {
  return getContract({
    abi: crossFarmingSenderAbi,
    address: getCrossFarmingSenderAddress(chainId),
    chainId,
    signer,
  }) as CrossFarmingSender
}

export const getCrossFarmingReceiverContract = (signer?: Signer | Provider, chainId?: number) => {
  return getContract({
    abi: crossFarmingReceiverAbi,
    address: getCrossFarmingReceiverAddress(chainId),
    chainId,
    signer,
  }) as CrossFarmingReceiver
}

export const getCrossFarmingProxyContract = (
  proxyContractAddress: string,
  signer?: Signer | Provider,
  chainId?: number,
) => {
  return getContract({ abi: crossFarmingProxyAbi, address: proxyContractAddress, chainId, signer }) as CrossFarmingProxy
}

export const getStableSwapNativeHelperContract = (signer?: Signer | Provider, chainId?: number) => {
  return getContract({
    abi: stableSwapNativeHelperAbi,
    address: getStableSwapNativeHelperAddress(chainId),
    chainId,
    signer,
  }) as StableSwapNativeHelper
}
