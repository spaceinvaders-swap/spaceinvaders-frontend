import BigNumber from 'bignumber.js'
import { useTranslation } from '@spaceinvaders-swap/localization'
import { getBalanceAmount } from '@spaceinvaders-swap/utils/formatBalance'

import { useMemo } from 'react'

export const useUserEnoughInvaValidator = (invaAmount: string, stakingTokenBalance: BigNumber) => {
  const { t } = useTranslation()
  const errorMessage = t('Insufficient INVA balance')

  const userNotEnoughInva = useMemo(() => {
    if (new BigNumber(invaAmount).gt(getBalanceAmount(stakingTokenBalance, 18))) return true
    return false
  }, [invaAmount, stakingTokenBalance])
  return { userNotEnoughInva, notEnoughErrorMessage: errorMessage }
}
