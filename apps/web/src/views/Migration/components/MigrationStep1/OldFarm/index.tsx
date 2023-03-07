import React, { useMemo, useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { useAccount } from 'wagmi'
import { getFarmApr } from 'utils/apr'
import { useTranslation } from '@offsideswap/localization'
import { ROTO_PER_YEAR } from 'config'
import { useFarmsV1, usePriceRotoBusd } from 'state/farmsV1/hooks'
import { DeserializedFarm, FarmWithStakedValue } from '@offsideswap/farms'
import MigrationFarmTable from '../../MigrationFarmTable'
import { DesktopColumnSchema } from '../../types'

const OldFarmStep1: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { data: farmsLP, userDataLoaded } = useFarmsV1()
  const rotoPrice = usePriceRotoBusd()

  const userDataReady = !account || (!!account && userDataLoaded)

  const farms = farmsLP.filter((farm) => farm.pid !== 0)

  const stakedOrHasTokenBalance = farms.filter((farm) => {
    return (
      farm.userData &&
      (new BigNumber(farm.userData.stakedBalance).isGreaterThan(0) ||
        new BigNumber(farm.userData.tokenBalance).isGreaterThan(0))
    )
  })

  const farmsList = useCallback(
    (farmsToDisplay: DeserializedFarm[]): FarmWithStakedValue[] => {
      const farmsToDisplayWithAPR: FarmWithStakedValue[] = farmsToDisplay.map((farm) => {
        if (!farm.lpTotalInQuoteToken || !farm.quoteTokenPriceBusd) {
          return farm
        }
        const totalLiquidity = new BigNumber(farm.lpTotalInQuoteToken).times(farm.quoteTokenPriceBusd)
        const { rotoRewardsApr, lpRewardsApr } = getFarmApr(
          56,
          new BigNumber(farm.poolWeight),
          rotoPrice,
          totalLiquidity,
          farm.lpAddress,
          ROTO_PER_YEAR,
        )
        return { ...farm, apr: rotoRewardsApr, lpRewardsApr, liquidity: totalLiquidity }
      })

      return farmsToDisplayWithAPR
    },
    [rotoPrice],
  )

  const chosenFarmsMemoized = useMemo(() => {
    return farmsList(stakedOrHasTokenBalance)
  }, [stakedOrHasTokenBalance, farmsList])

  return (
    <MigrationFarmTable
      title={t('Old Farms')}
      noStakedFarmText={t('You are not currently staking in any v1 farms.')}
      account={account}
      rotoPrice={rotoPrice}
      columnSchema={DesktopColumnSchema}
      farms={chosenFarmsMemoized}
      userDataReady={userDataReady}
    />
  )
}

export default OldFarmStep1
