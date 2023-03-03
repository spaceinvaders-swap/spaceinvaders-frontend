import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import { useInva } from 'hooks/useContract'
import { useSWRContract, UseSWRContractKey } from 'hooks/useSWRContract'
import BigNumber from 'bignumber.js'

// TODO: refactor as useTokenApprovalStatus for generic use

export const useInvaApprovalStatus = (spender) => {
  const { address: account } = useAccount()
  const { reader: invaContract } = useInva()

  const key = useMemo<UseSWRContractKey>(
    () =>
      account && spender
        ? {
            contract: invaContract,
            methodName: 'allowance',
            params: [account, spender],
          }
        : null,
    [account, invaContract, spender],
  )

  const { data, mutate } = useSWRContract(key)

  return {
    isVaultApproved: data ? data.gt(0) : false,
    allowance: new BigNumber(data?.toString()),
    setLastUpdated: mutate,
  }
}

export default useInvaApprovalStatus
