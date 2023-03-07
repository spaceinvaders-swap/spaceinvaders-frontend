import { useAccount } from '@offsideswap/awgmi'
import { useIsMounted } from '@offsideswap/hooks'

export default function HasAccount({ fallbackComp, children }) {
  const { account } = useAccount()
  const isMounted = useIsMounted()

  return isMounted && account ? <>{children}</> : fallbackComp
}
