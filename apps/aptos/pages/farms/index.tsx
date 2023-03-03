import { useContext } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { FarmsPageLayout, FarmsContext } from 'components/Farms/components/index'
import FarmCard from 'components/Farms/components/FarmCard/FarmCard'
import { usePriceInvaUsdc } from 'hooks/useStablePrice'
import { getDisplayApr } from 'components/Farms/components/getDisplayApr'
import { FarmWithStakedValue } from '@spaceinvaders-swap/farms'

const FarmsPage = () => {
  const { account } = useActiveWeb3React()
  const { chosenFarmsMemoized } = useContext(FarmsContext)
  const invaPrice = usePriceInvaUsdc()

  return (
    <>
      {chosenFarmsMemoized?.map((farm: FarmWithStakedValue) => (
        <FarmCard
          key={farm.pid}
          farm={farm}
          displayApr={getDisplayApr(farm.apr, farm.lpRewardsApr) as string}
          invaPrice={invaPrice}
          account={account}
          removed={false}
        />
      ))}
    </>
  )
}

FarmsPage.Layout = FarmsPageLayout

export default FarmsPage
