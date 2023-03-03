import { useAccount } from 'wagmi'
import BigNumber from 'bignumber.js'
import useSWR from 'swr'
import { useIfoCreditAddressContract } from 'hooks/useContract'
import { ChainId } from '@spaceinvaders-swap/sdk'
import { getBalanceNumber } from '@spaceinvaders-swap/utils/formatBalance'
import { useTranslation } from '@spaceinvaders-swap/localization'
import { useChainCurrentBlock } from 'state/block/hooks'
import { getVaultPosition, VaultPosition } from 'utils/invaPool'
import { getInvaVaultAddress, getAddress } from 'utils/addressHelpers'
import { multicallv2 } from 'utils/multicall'
import { getActivePools } from 'utils/calls'
import invaVaultAbi from 'config/abi/invaVaultV2.json'
import { BIG_ZERO } from '@spaceinvaders-swap/utils/bigNumber'
import { convertSharesToInva } from '../../../../views/Pools/helpers'
import { getScores } from '../../../../views/Voting/getScores'
import { SPACEINVADERS_SPACE } from '../../../../views/Voting/config'
import * as strategies from '../../../../views/Voting/strategies'

const useInvaBenefits = () => {
  const { address: account } = useAccount()
  const {
    currentLanguage: { locale },
  } = useTranslation()
  const ifoCreditAddressContract = useIfoCreditAddressContract()
  const invaVaultAddress = getInvaVaultAddress()
  const currentBscBlock = useChainCurrentBlock(ChainId.BSC)

  const { data, status } = useSWR(account && currentBscBlock && ['invaBenefits', account], async () => {
    const userVaultCalls = ['userInfo', 'calculatePerformanceFee', 'calculateOverdueFee'].map((method) => ({
      address: invaVaultAddress,
      name: method,
      params: [account],
    }))

    const pricePerFullShareCall = [
      {
        address: invaVaultAddress,
        name: 'getPricePerFullShare',
      },
    ]

    const [userContractResponse, [currentPerformanceFee], [currentOverdueFee], sharePrice] = await multicallv2({
      abi: invaVaultAbi,
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
    const lockedInva = [VaultPosition.None, VaultPosition.Flexible].includes(lockPosition)
      ? '0.00'
      : convertSharesToInva(
          userSharesAsBignumber,
          sharePriceAsBigNumber,
          undefined,
          undefined,
          currentOverdueFeeAsBigNumber.plus(currentPerformanceFeeAsBigNumber).plus(userBoostedSharesAsBignumber),
        ).invaAsNumberBalance.toLocaleString('en', { maximumFractionDigits: 3 })

    let iInva = ''
    let vInva = { vaultScore: '0', totalScore: '0' }
    if (lockPosition === VaultPosition.Locked) {
      const credit = await ifoCreditAddressContract.getUserCredit(account)
      iInva = getBalanceNumber(new BigNumber(credit.toString())).toLocaleString('en', { maximumFractionDigits: 3 })

      const eligiblePools = await getActivePools(currentBscBlock)
      const poolAddresses = eligiblePools.map(({ contractAddress }) => getAddress(contractAddress, ChainId.BSC))

      const [invaVaultBalance, total] = await getScores(
        SPACEINVADERS_SPACE,
        [strategies.invaPoolBalanceStrategy('v1'), strategies.createTotalStrategy(poolAddresses, 'v1')],
        ChainId.BSC.toString(),
        [account],
        currentBscBlock,
      )
      vInva = {
        vaultScore: invaVaultBalance[account]
          ? invaVaultBalance[account].toLocaleString('en', { maximumFractionDigits: 3 })
          : '0',
        totalScore: total[account] ? total[account].toLocaleString('en', { maximumFractionDigits: 3 }) : '0',
      }
    }

    return {
      lockedInva,
      lockPosition,
      lockedEndTime: new Date(parseInt(userContractResponse.lockEndTime.toString()) * 1000).toLocaleString(locale, {
        month: 'short',
        year: 'numeric',
        day: 'numeric',
      }),
      iInva,
      vInva,
    }
  })

  return { data, status }
}

export default useInvaBenefits
