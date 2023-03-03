import { useMemo } from 'react'
import uriToHttp from '@spaceinvaders-swap/utils/uriToHttp'

export default function useHttpLocations(uri: string | undefined): string[] {
  return useMemo(() => {
    return uri ? uriToHttp(uri) : []
  }, [uri])
}
