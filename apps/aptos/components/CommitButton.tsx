import { Button, ButtonProps } from '@spaceinvaders-swap/uikit'
import { useAccount } from '@spaceinvaders-swap/awgmi'
import { useIsMounted } from '@spaceinvaders-swap/hooks'
import { useActiveNetwork } from 'hooks/useNetwork'
import { ConnectWalletButton } from './ConnectWalletButton'
import Trans from './Trans'

const wrongNetworkProps: ButtonProps = {
  variant: 'danger',
  disabled: false,
  children: <Trans>Wrong Network</Trans>,
}

export const CommitButton = (props: ButtonProps) => {
  const { isWrongNetwork } = useActiveNetwork()
  const isMounted = useIsMounted()
  const { isConnected } = useAccount()

  if (!isConnected && isMounted) {
    return <ConnectWalletButton />
  }

  return (
    <Button
      {...props}
      onClick={(e) => {
        if (!isWrongNetwork) {
          props.onClick?.(e)
        }
      }}
      {...(isWrongNetwork && wrongNetworkProps)}
    />
  )
}
