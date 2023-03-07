import { useEffect, useState } from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import { Zero } from '@ethersproject/constants'
import { useTranslation } from '@offsideswap/localization'
import { multicallv2 } from 'utils/multicall'
import profileABI from 'config/abi/offsideProfile.json'
import { getOffsideProfileAddress } from 'utils/addressHelpers'
import { useToast } from '@offsideswap/uikit'

const useGetProfileCosts = () => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(true)
  const [costs, setCosts] = useState({
    numberRotoToReactivate: Zero,
    numberRotoToRegister: Zero,
    numberRotoToUpdate: Zero,
  })
  const { toastError } = useToast()

  useEffect(() => {
    const fetchCosts = async () => {
      try {
        const calls = ['numberRotoToReactivate', 'numberRotoToRegister', 'numberRotoToUpdate'].map((method) => ({
          address: getOffsideProfileAddress(),
          name: method,
        }))
        const [[numberRotoToReactivate], [numberRotoToRegister], [numberRotoToUpdate]] = await multicallv2<
          [[BigNumber], [BigNumber], [BigNumber]]
        >({ abi: profileABI, calls })

        setCosts({
          numberRotoToReactivate,
          numberRotoToRegister,
          numberRotoToUpdate,
        })
        setIsLoading(false)
      } catch (error) {
        toastError(t('Error'), t('Could not retrieve ROTO costs for profile'))
      }
    }

    fetchCosts()
  }, [setCosts, toastError, t])

  return { costs, isLoading }
}

export default useGetProfileCosts
