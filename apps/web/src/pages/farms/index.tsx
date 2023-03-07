import { useContext } from 'react'
import { SUPPORT_FARMS } from 'config/constants/supportChains'
import { FarmsPageLayout, FarmsContext } from 'views/Farms'
import FarmCard from 'views/Farms/components/FarmCard/FarmCard'
import { getDisplayApr } from 'views/Farms/components/getDisplayApr'
import { usePriceRotoBusd } from 'state/farms/hooks'
import { useAccount } from 'wagmi'
import ProxyFarmContainer, {
  YieldBoosterStateContext,
} from 'views/Farms/components/YieldBooster/components/ProxyFarmContainer'

const ProxyFarmCardContainer = ({ farm }) => {
  const { address: account } = useAccount()
  const rotoPrice = usePriceRotoBusd()

  const { proxyFarm, shouldUseProxyFarm } = useContext(YieldBoosterStateContext)
  const finalFarm = shouldUseProxyFarm ? proxyFarm : farm

  return (
    <FarmCard
      key={finalFarm.pid}
      farm={finalFarm}
      displayApr={getDisplayApr(finalFarm.apr, finalFarm.lpRewardsApr)}
      rotoPrice={rotoPrice}
      account={account}
      removed={false}
    />
  )
}

const FarmsPage = () => {
  const { address: account } = useAccount()
  const { chosenFarmsMemoized } = useContext(FarmsContext)
  const rotoPrice = usePriceRotoBusd()
  return (
    <>
      {chosenFarmsMemoized.map((farm) =>
        farm.boosted ? (
          <ProxyFarmContainer farm={farm} key={farm.pid}>
            <ProxyFarmCardContainer farm={farm} />
          </ProxyFarmContainer>
        ) : (
          <FarmCard
            key={farm.pid}
            farm={farm}
            displayApr={getDisplayApr(farm.apr, farm.lpRewardsApr)}
            rotoPrice={rotoPrice}
            account={account}
            removed={false}
          />
        ),
      )}
    </>
  )
}

FarmsPage.Layout = FarmsPageLayout

FarmsPage.chains = SUPPORT_FARMS

export default FarmsPage
