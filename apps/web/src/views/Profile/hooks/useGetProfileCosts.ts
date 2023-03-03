import { useEffect, useState } from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import { Zero } from '@ethersproject/constants'
import { useTranslation } from '@spaceinvaders-swap/localization'
import { multicallv2 } from 'utils/multicall'
import profileABI from 'config/abi/spaceinvadersProfile.json'
import { getSpaceinvadersProfileAddress } from 'utils/addressHelpers'
import { useToast } from '@spaceinvaders-swap/uikit'

const useGetProfileCosts = () => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(true)
  const [costs, setCosts] = useState({
    numberInvaToReactivate: Zero,
    numberInvaToRegister: Zero,
    numberInvaToUpdate: Zero,
  })
  const { toastError } = useToast()

  useEffect(() => {
    const fetchCosts = async () => {
      try {
        const calls = ['numberInvaToReactivate', 'numberInvaToRegister', 'numberInvaToUpdate'].map((method) => ({
          address: getSpaceinvadersProfileAddress(),
          name: method,
        }))
        const [[numberInvaToReactivate], [numberInvaToRegister], [numberInvaToUpdate]] = await multicallv2<
          [[BigNumber], [BigNumber], [BigNumber]]
        >({ abi: profileABI, calls })

        setCosts({
          numberInvaToReactivate,
          numberInvaToRegister,
          numberInvaToUpdate,
        })
        setIsLoading(false)
      } catch (error) {
        toastError(t('Error'), t('Could not retrieve INVA costs for profile'))
      }
    }

    fetchCosts()
  }, [setCosts, toastError, t])

  return { costs, isLoading }
}

export default useGetProfileCosts
