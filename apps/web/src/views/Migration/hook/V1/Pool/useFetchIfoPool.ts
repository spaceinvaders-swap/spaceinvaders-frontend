import BigNumber from 'bignumber.js'
import { useAccount } from 'wagmi'
import fetchIfoPoolUser from 'views/Migration/hook/V1/Pool/fetchIfoPoolUser'
import { fetchPublicIfoPoolData, fetchIfoPoolFeesData } from 'views/Migration/hook/V1/Pool/fetchIfoPoolPublic'
import { initialPoolVaultState } from 'state/pools/index'
import useSWR from 'swr'
import { fetchVaultFees } from 'state/pools/fetchVaultPublic'
import type { Signer } from '@ethersproject/abstract-signer'
import type { Provider } from '@ethersproject/providers'
import { Contract } from '@ethersproject/contracts'
import { bscRpcProvider } from 'utils/providers'
import invaVaultAbi from 'config/abi/invaVault.json'
import { FAST_INTERVAL } from 'config/constants'
import { VaultKey } from 'state/types'
import { fetchPublicVaultData } from './fetchPublicVaultData'

export const ifoPoolV1Contract = '0x1B2A2f6ed4A1401E8C73B4c2B6172455ce2f78E8'
export const invaVaultAddress = '0xa80240Eb5d7E05d3F250cF000eEc0891d00b51CC'

const getInvaVaultContract = (signer?: Signer | Provider) => {
  const signerOrProvider = signer ?? bscRpcProvider
  return new Contract(invaVaultAddress, invaVaultAbi, signerOrProvider) as any
}

const fetchVaultUserV1 = async (account: string) => {
  const contract = getInvaVaultContract()
  try {
    const userContractResponse = await contract.userInfo(account)
    return {
      isLoading: false,
      userShares: new BigNumber(userContractResponse.shares.toString()).toJSON(),
      lastDepositedTime: userContractResponse.lastDepositedTime.toString(),
      lastUserActionTime: userContractResponse.lastUserActionTime.toString(),
      invaAtLastUserAction: new BigNumber(userContractResponse.invaAtLastUserAction.toString()).toJSON(),
    }
  } catch (error) {
    return {
      isLoading: true,
      userShares: null,
      lastDepositedTime: null,
      lastUserActionTime: null,
      invaAtLastUserAction: null,
    }
  }
}

const getIfoPoolData = async (account) => {
  const [ifoData, userData, feesData] = await Promise.all([
    fetchPublicIfoPoolData(ifoPoolV1Contract),
    fetchIfoPoolUser(account, ifoPoolV1Contract),
    fetchIfoPoolFeesData(ifoPoolV1Contract),
  ])
  const ifoPoolData = {
    ...ifoData,
    fees: { ...feesData },
    userData: { ...userData, isLoading: false },
  }
  return transformData(ifoPoolData)
}

const getInvaPoolData = async (account) => {
  const [vaultData, userData, feesData] = await Promise.all([
    fetchPublicVaultData(invaVaultAddress),
    fetchVaultUserV1(account),
    fetchVaultFees(invaVaultAddress),
  ])
  const invaData = {
    ...vaultData,
    fees: { ...feesData },
    userData: { ...userData, isLoading: false },
  }
  return transformData(invaData)
}

const transformData = ({
  totalShares,
  pricePerFullShare,
  totalInvaInVault,
  fees: { performanceFee, withdrawalFee, withdrawalFeePeriod },
  userData: { isLoading, userShares, invaAtLastUserAction, lastDepositedTime, lastUserActionTime },
}) => {
  return {
    totalShares: new BigNumber(totalShares),
    pricePerFullShare: new BigNumber(pricePerFullShare),
    totalInvaInVault: new BigNumber(totalInvaInVault),
    fees: {
      performanceFeeAsDecimal: performanceFee && performanceFee / 100,
      performanceFee,
      withdrawalFee,
      withdrawalFeePeriod,
    },
    userData: {
      isLoading,
      userShares: new BigNumber(userShares),
      invaAtLastUserAction: new BigNumber(invaAtLastUserAction),
      lastDepositedTime,
      lastUserActionTime,
    },
  }
}

export const useVaultPoolByKeyV1 = (key: VaultKey) => {
  const { address: account } = useAccount()
  const { data, mutate } = useSWR(
    account ? [key, 'v1'] : null,
    async () => {
      if (key === VaultKey.IfoPool) {
        return getIfoPoolData(account)
      }
      return getInvaPoolData(account)
    },
    {
      revalidateOnFocus: false,
      refreshInterval: FAST_INTERVAL,
      dedupingInterval: FAST_INTERVAL,
    },
  )

  return {
    vaultPoolData: data || initialPoolVaultState,
    fetchPoolData: mutate,
  }
}
