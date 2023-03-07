import BigNumber from 'bignumber.js'
import { useTranslation } from '@offsideswap/localization'
import { getBalanceAmount } from '@offsideswap/utils/formatBalance'

import { useMemo } from 'react'

export const useUserEnoughRotoValidator = (rotoAmount: string, stakingTokenBalance: BigNumber) => {
  const { t } = useTranslation()
  const errorMessage = t('Insufficient ROTO balance')

  const userNotEnoughRoto = useMemo(() => {
    if (new BigNumber(rotoAmount).gt(getBalanceAmount(stakingTokenBalance, 18))) return true
    return false
  }, [rotoAmount, stakingTokenBalance])
  return { userNotEnoughRoto, notEnoughErrorMessage: errorMessage }
}
