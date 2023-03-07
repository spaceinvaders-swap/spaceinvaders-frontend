import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import { useRoto } from 'hooks/useContract'
import { useSWRContract, UseSWRContractKey } from 'hooks/useSWRContract'
import BigNumber from 'bignumber.js'

// TODO: refactor as useTokenApprovalStatus for generic use

export const useRotoApprovalStatus = (spender) => {
  const { address: account } = useAccount()
  const { reader: rotoContract } = useRoto()

  const key = useMemo<UseSWRContractKey>(
    () =>
      account && spender
        ? {
            contract: rotoContract,
            methodName: 'allowance',
            params: [account, spender],
          }
        : null,
    [account, rotoContract, spender],
  )

  const { data, mutate } = useSWRContract(key)

  return {
    isVaultApproved: data ? data.gt(0) : false,
    allowance: new BigNumber(data?.toString()),
    setLastUpdated: mutate,
  }
}

export default useRotoApprovalStatus
