import BigNumber from 'bignumber.js'
import { convertSharesToInva } from 'views/Pools/helpers'
import { multicallv2 } from 'utils/multicall'
import invaVaultAbi from 'config/abi/invaVaultV2.json'
import { BIG_ZERO } from '@spaceinvaders-swap/utils/bigNumber'

export const fetchPublicVaultData = async (invaVaultAddress: string) => {
  try {
    const calls = ['getPricePerFullShare', 'totalShares', 'totalLockedAmount'].map((method) => ({
      address: invaVaultAddress,
      name: method,
    }))
    const [[sharePrice], [shares], totalLockedAmount] = await multicallv2({
      abi: invaVaultAbi,
      calls,
      options: { requireSuccess: false },
    })
    const totalSharesAsBigNumber = shares ? new BigNumber(shares.toString()) : BIG_ZERO
    const totalLockedAmountAsBigNumber = totalLockedAmount ? new BigNumber(totalLockedAmount[0].toString()) : BIG_ZERO
    const sharePriceAsBigNumber = sharePrice ? new BigNumber(sharePrice.toString()) : BIG_ZERO
    const totalInvaInVaultEstimate = convertSharesToInva(totalSharesAsBigNumber, sharePriceAsBigNumber)

    return {
      totalShares: totalSharesAsBigNumber.toJSON(),
      totalLockedAmount: totalLockedAmountAsBigNumber.toJSON(),
      pricePerFullShare: sharePriceAsBigNumber.toJSON(),
      totalInvaInVault: totalInvaInVaultEstimate.invaAsBigNumber.toJSON(),
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
