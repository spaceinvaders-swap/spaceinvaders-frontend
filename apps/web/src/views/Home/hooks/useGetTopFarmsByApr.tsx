import { useState, useEffect } from 'react'
import { useFarms, usePriceInvaBusd } from 'state/farms/hooks'
import { useAppDispatch } from 'state'
import { fetchFarmsPublicDataAsync } from 'state/farms'
import { getFarmApr } from 'utils/apr'
import orderBy from 'lodash/orderBy'
import { DeserializedFarm, FarmWithStakedValue } from '@spaceinvaders-swap/farms'
import { FetchStatus } from 'config/constants/types'
import { getFarmConfig } from '@spaceinvaders-swap/farms/constants'
import { useActiveChainId } from 'hooks/useActiveChainId'

const useGetTopFarmsByApr = (isIntersecting: boolean) => {
  const dispatch = useAppDispatch()
  const { data: farms, regularInvaPerBlock } = useFarms()
  const [fetchStatus, setFetchStatus] = useState(FetchStatus.Idle)
  const [fetched, setFetched] = useState(false)
  const [topFarms, setTopFarms] = useState<FarmWithStakedValue[]>([null, null, null, null, null])
  const invaPriceBusd = usePriceInvaBusd()
  const { chainId } = useActiveChainId()

  useEffect(() => {
    const fetchFarmData = async () => {
      const farmsConfig = await getFarmConfig(chainId)
      setFetchStatus(FetchStatus.Fetching)
      const activeFarms = farmsConfig.filter((farm) => farm.pid !== 0)
      try {
        await dispatch(fetchFarmsPublicDataAsync({ pids: activeFarms.map((farm) => farm.pid), chainId }))
        setFetchStatus(FetchStatus.Fetched)
      } catch (e) {
        console.error(e)
        setFetchStatus(FetchStatus.Failed)
      }
    }

    if (isIntersecting && fetchStatus === FetchStatus.Idle) {
      fetchFarmData()
    }
  }, [dispatch, setFetchStatus, fetchStatus, topFarms, isIntersecting, chainId])

  useEffect(() => {
    const getTopFarmsByApr = (farmsState: DeserializedFarm[]) => {
      const farmsWithPrices = farmsState.filter(
        (farm) =>
          farm.lpTotalInQuoteToken &&
          farm.quoteTokenPriceBusd &&
          farm.pid !== 0 &&
          farm.multiplier &&
          farm.multiplier !== '0X',
      )
      const farmsWithApr: FarmWithStakedValue[] = farmsWithPrices.map((farm) => {
        const totalLiquidity = farm.lpTotalInQuoteToken.times(farm.quoteTokenPriceBusd)
        const { invaRewardsApr, lpRewardsApr } = getFarmApr(
          chainId,
          farm.poolWeight,
          invaPriceBusd,
          totalLiquidity,
          farm.lpAddress,
          regularInvaPerBlock,
        )
        return { ...farm, apr: invaRewardsApr, lpRewardsApr }
      })

      const sortedByApr = orderBy(farmsWithApr, (farm) => farm.apr + farm.lpRewardsApr, 'desc')
      setTopFarms(sortedByApr.slice(0, 5))
      setFetched(true)
    }

    if (fetchStatus === FetchStatus.Fetched && !topFarms[0] && farms?.length > 0) {
      getTopFarmsByApr(farms)
    }
  }, [setTopFarms, farms, fetchStatus, invaPriceBusd, topFarms, regularInvaPerBlock, chainId])

  return { topFarms, fetched }
}

export default useGetTopFarmsByApr
