import { useAccount } from 'wagmi'
import BigNumber from 'bignumber.js'
import useSWR from 'swr'
import { useIfoCreditAddressContract } from 'hooks/useContract'
import { ChainId } from '@offsideswap/sdk'
import { getBalanceNumber } from '@offsideswap/utils/formatBalance'
import { useTranslation } from '@offsideswap/localization'
import { useChainCurrentBlock } from 'state/block/hooks'
import { getVaultPosition, VaultPosition } from 'utils/rotoPool'
import { getRotoVaultAddress, getAddress } from 'utils/addressHelpers'
import { multicallv2 } from 'utils/multicall'
import { getActivePools } from 'utils/calls'
import rotoVaultAbi from 'config/abi/rotoVaultV2.json'
import { BIG_ZERO } from '@offsideswap/utils/bigNumber'
import { convertSharesToRoto } from '../../../../views/Pools/helpers'
import { getScores } from '../../../../views/Voting/getScores'
import { OFFSIDE_SPACE } from '../../../../views/Voting/config'
import * as strategies from '../../../../views/Voting/strategies'

const useRotoBenefits = () => {
  const { address: account } = useAccount()
  const {
    currentLanguage: { locale },
  } = useTranslation()
  const ifoCreditAddressContract = useIfoCreditAddressContract()
  const rotoVaultAddress = getRotoVaultAddress()
  const currentBscBlock = useChainCurrentBlock(ChainId.BSC)

  const { data, status } = useSWR(account && currentBscBlock && ['rotoBenefits', account], async () => {
    const userVaultCalls = ['userInfo', 'calculatePerformanceFee', 'calculateOverdueFee'].map((method) => ({
      address: rotoVaultAddress,
      name: method,
      params: [account],
    }))

    const pricePerFullShareCall = [
      {
        address: rotoVaultAddress,
        name: 'getPricePerFullShare',
      },
    ]

    const [userContractResponse, [currentPerformanceFee], [currentOverdueFee], sharePrice] = await multicallv2({
      abi: rotoVaultAbi,
      calls: [...userVaultCalls, ...pricePerFullShareCall],
    })
    const currentPerformanceFeeAsBigNumber = new BigNumber(currentPerformanceFee.toString())
    const currentOverdueFeeAsBigNumber = new BigNumber(currentOverdueFee.toString())
    const sharePriceAsBigNumber = sharePrice ? new BigNumber(sharePrice.toString()) : BIG_ZERO
    const userBoostedSharesAsBignumber = new BigNumber(userContractResponse.userBoostedShare.toString())
    const userSharesAsBignumber = new BigNumber(userContractResponse.shares.toString())
    const lockPosition = getVaultPosition({
      userShares: userSharesAsBignumber,
      locked: userContractResponse.locked,
      lockEndTime: userContractResponse.lockEndTime.toString(),
    })
    const lockedRoto = [VaultPosition.None, VaultPosition.Flexible].includes(lockPosition)
      ? '0.00'
      : convertSharesToRoto(
          userSharesAsBignumber,
          sharePriceAsBigNumber,
          undefined,
          undefined,
          currentOverdueFeeAsBigNumber.plus(currentPerformanceFeeAsBigNumber).plus(userBoostedSharesAsBignumber),
        ).rotoAsNumberBalance.toLocaleString('en', { maximumFractionDigits: 3 })

    let iRoto = ''
    let vRoto = { vaultScore: '0', totalScore: '0' }
    if (lockPosition === VaultPosition.Locked) {
      const credit = await ifoCreditAddressContract.getUserCredit(account)
      iRoto = getBalanceNumber(new BigNumber(credit.toString())).toLocaleString('en', { maximumFractionDigits: 3 })

      const eligiblePools = await getActivePools(currentBscBlock)
      const poolAddresses = eligiblePools.map(({ contractAddress }) => getAddress(contractAddress, ChainId.BSC))

      const [rotoVaultBalance, total] = await getScores(
        OFFSIDE_SPACE,
        [strategies.rotoPoolBalanceStrategy('v1'), strategies.createTotalStrategy(poolAddresses, 'v1')],
        ChainId.BSC.toString(),
        [account],
        currentBscBlock,
      )
      vRoto = {
        vaultScore: rotoVaultBalance[account]
          ? rotoVaultBalance[account].toLocaleString('en', { maximumFractionDigits: 3 })
          : '0',
        totalScore: total[account] ? total[account].toLocaleString('en', { maximumFractionDigits: 3 }) : '0',
      }
    }

    return {
      lockedRoto,
      lockPosition,
      lockedEndTime: new Date(parseInt(userContractResponse.lockEndTime.toString()) * 1000).toLocaleString(locale, {
        month: 'short',
        year: 'numeric',
        day: 'numeric',
      }),
      iRoto,
      vRoto,
    }
  })

  return { data, status }
}

export default useRotoBenefits
