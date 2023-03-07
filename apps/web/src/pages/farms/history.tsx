import { useContext } from 'react'
import { SUPPORT_FARMS } from 'config/constants/supportChains'
import { FarmsPageLayout, FarmsContext } from 'views/Farms'
import FarmCard from 'views/Farms/components/FarmCard/FarmCard'
import { getDisplayApr } from 'views/Farms/components/getDisplayApr'
import { usePriceRotoBusd } from 'state/farms/hooks'
import { useAccount } from 'wagmi'

const FarmsHistoryPage = () => {
  const { address: account } = useAccount()
  const { chosenFarmsMemoized } = useContext(FarmsContext)
  const rotoPrice = usePriceRotoBusd()

  return (
    <>
      {chosenFarmsMemoized.map((farm) => (
        <FarmCard
          key={farm.pid}
          farm={farm}
          displayApr={getDisplayApr(farm.apr, farm.lpRewardsApr)}
          rotoPrice={rotoPrice}
          account={account}
          removed
        />
      ))}
    </>
  )
}

FarmsHistoryPage.Layout = FarmsPageLayout
FarmsHistoryPage.chains = SUPPORT_FARMS

export default FarmsHistoryPage
