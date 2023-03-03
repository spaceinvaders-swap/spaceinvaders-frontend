import { useAccount } from '@spaceinvaders-swap/awgmi'
import { useIsMounted } from '@spaceinvaders-swap/hooks'

export default function HasAccount({ fallbackComp, children }) {
  const { account } = useAccount()
  const isMounted = useIsMounted()

  return isMounted && account ? <>{children}</> : fallbackComp
}
