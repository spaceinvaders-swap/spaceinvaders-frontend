import BigNumber from 'bignumber.js'
import { convertSharesToRoto } from 'views/Pools/helpers'
import { multicallv2 } from 'utils/multicall'
import rotoVaultAbi from 'config/abi/rotoVaultV2.json'
import { BIG_ZERO } from '@offsideswap/utils/bigNumber'

export const fetchPublicVaultData = async (rotoVaultAddress: string) => {
  try {
    const calls = ['getPricePerFullShare', 'totalShares', 'totalLockedAmount'].map((method) => ({
      address: rotoVaultAddress,
      name: method,
    }))
    const [[sharePrice], [shares], totalLockedAmount] = await multicallv2({
      abi: rotoVaultAbi,
      calls,
      options: { requireSuccess: false },
    })
    const totalSharesAsBigNumber = shares ? new BigNumber(shares.toString()) : BIG_ZERO
    const totalLockedAmountAsBigNumber = totalLockedAmount ? new BigNumber(totalLockedAmount[0].toString()) : BIG_ZERO
    const sharePriceAsBigNumber = sharePrice ? new BigNumber(sharePrice.toString()) : BIG_ZERO
    const totalRotoInVaultEstimate = convertSharesToRoto(totalSharesAsBigNumber, sharePriceAsBigNumber)

    return {
      totalShares: totalSharesAsBigNumber.toJSON(),
      totalLockedAmount: totalLockedAmountAsBigNumber.toJSON(),
      pricePerFullShare: sharePriceAsBigNumber.toJSON(),
      totalRotoInVault: totalRotoInVaultEstimate.rotoAsBigNumber.toJSON(),
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
