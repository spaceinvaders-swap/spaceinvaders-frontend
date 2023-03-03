import { ChainId } from '@spaceinvaders-swap/sdk'
import { isStableFarm, SerializedFarmConfig } from '@spaceinvaders-swap/farms'

let logged = false

export const getFarmConfig = async (chainId: ChainId) => {
  try {
    return (await import(`/${chainId}.ts`)).default.filter(
      (f: SerializedFarmConfig) => f.pid !== null,
    ) as SerializedFarmConfig[]
  } catch (error) {
    if (!logged) {
      console.error('Cannot get farm config', error, chainId)
      logged = true
    }
    return []
  }
}

export const getStableConfig = async (chainId: ChainId) => {
  try {
    const farms = (await import(`/${chainId}.ts`)).default as SerializedFarmConfig[]

    return farms.filter(isStableFarm)
  } catch (error) {
    if (!logged) {
      console.error('Cannot get stable farm config', error, chainId)
      logged = true
    }
    return []
  }
}
