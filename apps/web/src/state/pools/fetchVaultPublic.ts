import BigNumber from 'bignumber.js'
import { multicallv2, multicallv3 } from 'utils/multicall'
import rotoAbi from 'config/abi/roto.json'
import rotoVaultAbi from 'config/abi/rotoVaultV2.json'
import { getRotoVaultAddress, getRotoFlexibleSideVaultAddress } from 'utils/addressHelpers'
import { BIG_ZERO } from '@offsideswap/utils/bigNumber'
import { ChainId } from '@offsideswap/sdk'
import { ROTO } from '@offsideswap/tokens'

const rotoVaultV2 = getRotoVaultAddress()
const rotoFlexibleSideVaultV2 = getRotoFlexibleSideVaultAddress()
export const fetchPublicVaultData = async (rotoVaultAddress = rotoVaultV2) => {
  try {
    const calls = ['getPricePerFullShare', 'totalShares', 'totalLockedAmount'].map((method) => ({
      abi: rotoVaultAbi,
      address: rotoVaultAddress,
      name: method,
    }))

    const rotoBalanceOfCall = {
      abi: rotoAbi,
      address: ROTO[ChainId.BSC].address,
      name: 'balanceOf',
      params: [rotoVaultV2],
    }

    const [[sharePrice], [shares], totalLockedAmount, [totalRotoInVault]] = await multicallv3({
      calls: [...calls, rotoBalanceOfCall],
      allowFailure: true,
    })

    const totalSharesAsBigNumber = shares ? new BigNumber(shares.toString()) : BIG_ZERO
    const totalLockedAmountAsBigNumber = totalLockedAmount ? new BigNumber(totalLockedAmount[0].toString()) : BIG_ZERO
    const sharePriceAsBigNumber = sharePrice ? new BigNumber(sharePrice.toString()) : BIG_ZERO
    return {
      totalShares: totalSharesAsBigNumber.toJSON(),
      totalLockedAmount: totalLockedAmountAsBigNumber.toJSON(),
      pricePerFullShare: sharePriceAsBigNumber.toJSON(),
      totalRotoInVault: new BigNumber(totalRotoInVault.toString()).toJSON(),
    }
  } catch (error) {
    return {
      totalShares: null,
      totalLockedAmount: null,
      pricePerFullShare: null,
      totalRotoInVault: null,
    }
  }
}

export const fetchPublicFlexibleSideVaultData = async (rotoVaultAddress = rotoFlexibleSideVaultV2) => {
  try {
    const calls = ['getPricePerFullShare', 'totalShares'].map((method) => ({
      abi: rotoVaultAbi,
      address: rotoVaultAddress,
      name: method,
    }))

    const rotoBalanceOfCall = {
      abi: rotoAbi,
      address: ROTO[ChainId.BSC].address,
      name: 'balanceOf',
      params: [rotoVaultAddress],
    }

    const [[sharePrice], [shares], [totalRotoInVault]] = await multicallv3({
      calls: [...calls, rotoBalanceOfCall],
      allowFailure: true,
    })

    const totalSharesAsBigNumber = shares ? new BigNumber(shares.toString()) : BIG_ZERO
    const sharePriceAsBigNumber = sharePrice ? new BigNumber(sharePrice.toString()) : BIG_ZERO
    return {
      totalShares: totalSharesAsBigNumber.toJSON(),
      pricePerFullShare: sharePriceAsBigNumber.toJSON(),
      totalRotoInVault: new BigNumber(totalRotoInVault.toString()).toJSON(),
    }
  } catch (error) {
    return {
      totalShares: null,
      pricePerFullShare: null,
      totalRotoInVault: null,
    }
  }
}

export const fetchVaultFees = async (rotoVaultAddress = rotoVaultV2) => {
  try {
    const calls = ['performanceFee', 'withdrawFee', 'withdrawFeePeriod'].map((method) => ({
      address: rotoVaultAddress,
      name: method,
    }))

    const [[performanceFee], [withdrawalFee], [withdrawalFeePeriod]] = await multicallv2({ abi: rotoVaultAbi, calls })

    return {
      performanceFee: performanceFee.toNumber(),
      withdrawalFee: withdrawalFee.toNumber(),
      withdrawalFeePeriod: withdrawalFeePeriod.toNumber(),
    }
  } catch (error) {
    return {
      performanceFee: null,
      withdrawalFee: null,
      withdrawalFeePeriod: null,
    }
  }
}

export default fetchPublicVaultData
