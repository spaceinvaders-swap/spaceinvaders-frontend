import BigNumber from 'bignumber.js'
import { multicallv2, multicallv3 } from 'utils/multicall'
import invaAbi from 'config/abi/inva.json'
import invaVaultAbi from 'config/abi/invaVaultV2.json'
import { getInvaVaultAddress, getInvaFlexibleSideVaultAddress } from 'utils/addressHelpers'
import { BIG_ZERO } from '@spaceinvaders-swap/utils/bigNumber'
import { ChainId } from '@spaceinvaders-swap/sdk'
import { INVA } from '@spaceinvaders-swap/tokens'

const invaVaultV2 = getInvaVaultAddress()
const invaFlexibleSideVaultV2 = getInvaFlexibleSideVaultAddress()
export const fetchPublicVaultData = async (invaVaultAddress = invaVaultV2) => {
  try {
    const calls = ['getPricePerFullShare', 'totalShares', 'totalLockedAmount'].map((method) => ({
      abi: invaVaultAbi,
      address: invaVaultAddress,
      name: method,
    }))

    const invaBalanceOfCall = {
      abi: invaAbi,
      address: INVA[ChainId.BSC].address,
      name: 'balanceOf',
      params: [invaVaultV2],
    }

    const [[sharePrice], [shares], totalLockedAmount, [totalInvaInVault]] = await multicallv3({
      calls: [...calls, invaBalanceOfCall],
      allowFailure: true,
    })

    const totalSharesAsBigNumber = shares ? new BigNumber(shares.toString()) : BIG_ZERO
    const totalLockedAmountAsBigNumber = totalLockedAmount ? new BigNumber(totalLockedAmount[0].toString()) : BIG_ZERO
    const sharePriceAsBigNumber = sharePrice ? new BigNumber(sharePrice.toString()) : BIG_ZERO
    return {
      totalShares: totalSharesAsBigNumber.toJSON(),
      totalLockedAmount: totalLockedAmountAsBigNumber.toJSON(),
      pricePerFullShare: sharePriceAsBigNumber.toJSON(),
      totalInvaInVault: new BigNumber(totalInvaInVault.toString()).toJSON(),
    }
  } catch (error) {
    return {
      totalShares: null,
      totalLockedAmount: null,
      pricePerFullShare: null,
      totalInvaInVault: null,
    }
  }
}

export const fetchPublicFlexibleSideVaultData = async (invaVaultAddress = invaFlexibleSideVaultV2) => {
  try {
    const calls = ['getPricePerFullShare', 'totalShares'].map((method) => ({
      abi: invaVaultAbi,
      address: invaVaultAddress,
      name: method,
    }))

    const invaBalanceOfCall = {
      abi: invaAbi,
      address: INVA[ChainId.BSC].address,
      name: 'balanceOf',
      params: [invaVaultAddress],
    }

    const [[sharePrice], [shares], [totalInvaInVault]] = await multicallv3({
      calls: [...calls, invaBalanceOfCall],
      allowFailure: true,
    })

    const totalSharesAsBigNumber = shares ? new BigNumber(shares.toString()) : BIG_ZERO
    const sharePriceAsBigNumber = sharePrice ? new BigNumber(sharePrice.toString()) : BIG_ZERO
    return {
      totalShares: totalSharesAsBigNumber.toJSON(),
      pricePerFullShare: sharePriceAsBigNumber.toJSON(),
      totalInvaInVault: new BigNumber(totalInvaInVault.toString()).toJSON(),
    }
  } catch (error) {
    return {
      totalShares: null,
      pricePerFullShare: null,
      totalInvaInVault: null,
    }
  }
}

export const fetchVaultFees = async (invaVaultAddress = invaVaultV2) => {
  try {
    const calls = ['performanceFee', 'withdrawFee', 'withdrawFeePeriod'].map((method) => ({
      address: invaVaultAddress,
      name: method,
    }))

    const [[performanceFee], [withdrawalFee], [withdrawalFeePeriod]] = await multicallv2({ abi: invaVaultAbi, calls })

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
