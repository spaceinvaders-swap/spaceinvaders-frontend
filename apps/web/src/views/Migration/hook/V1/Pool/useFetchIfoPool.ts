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
import rotoVaultAbi from 'config/abi/rotoVault.json'
import { FAST_INTERVAL } from 'config/constants'
import { VaultKey } from 'state/types'
import { fetchPublicVaultData } from './fetchPublicVaultData'

export const ifoPoolV1Contract = '0x1B2A2f6ed4A1401E8C73B4c2B6172455ce2f78E8'
export const rotoVaultAddress = '0xa80240Eb5d7E05d3F250cF000eEc0891d00b51CC'

const getRotoVaultContract = (signer?: Signer | Provider) => {
  const signerOrProvider = signer ?? bscRpcProvider
  return new Contract(rotoVaultAddress, rotoVaultAbi, signerOrProvider) as any
}

const fetchVaultUserV1 = async (account: string) => {
  const contract = getRotoVaultContract()
  try {
    const userContractResponse = await contract.userInfo(account)
    return {
      isLoading: false,
      userShares: new BigNumber(userContractResponse.shares.toString()).toJSON(),
      lastDepositedTime: userContractResponse.lastDepositedTime.toString(),
      lastUserActionTime: userContractResponse.lastUserActionTime.toString(),
      rotoAtLastUserAction: new BigNumber(userContractResponse.rotoAtLastUserAction.toString()).toJSON(),
    }
  } catch (error) {
    return {
      isLoading: true,
      userShares: null,
      lastDepositedTime: null,
      lastUserActionTime: null,
      rotoAtLastUserAction: null,
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

const getRotoPoolData = async (account) => {
  const [vaultData, userData, feesData] = await Promise.all([
    fetchPublicVaultData(rotoVaultAddress),
    fetchVaultUserV1(account),
    fetchVaultFees(rotoVaultAddress),
  ])
  const rotoData = {
    ...vaultData,
    fees: { ...feesData },
    userData: { ...userData, isLoading: false },
  }
  return transformData(rotoData)
}

const transformData = ({
  totalShares,
  pricePerFullShare,
  totalRotoInVault,
  fees: { performanceFee, withdrawalFee, withdrawalFeePeriod },
  userData: { isLoading, userShares, rotoAtLastUserAction, lastDepositedTime, lastUserActionTime },
}) => {
  return {
    totalShares: new BigNumber(totalShares),
    pricePerFullShare: new BigNumber(pricePerFullShare),
    totalRotoInVault: new BigNumber(totalRotoInVault),
    fees: {
      performanceFeeAsDecimal: performanceFee && performanceFee / 100,
      performanceFee,
      withdrawalFee,
      withdrawalFeePeriod,
    },
    userData: {
      isLoading,
      userShares: new BigNumber(userShares),
      rotoAtLastUserAction: new BigNumber(rotoAtLastUserAction),
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
      return getRotoPoolData(account)
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
