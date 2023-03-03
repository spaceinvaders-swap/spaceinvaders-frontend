import { Button, ButtonProps } from '@spaceinvaders-swap/uikit'
import { WalletModalV2 } from '@spaceinvaders-swap/ui-wallets'
import { Trans, useTranslation } from '@spaceinvaders-swap/localization'
import { useState } from 'react'
import { useAuth } from 'hooks/useAuth'
import { wallets } from 'config/wallets'

export const ConnectWalletButton = ({ children, ...props }: ButtonProps) => {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()
  const { login } = useAuth()

  const handleClick = () => {
    setOpen(true)
  }

  return (
    <>
      <Button width="100%" onClick={handleClick} {...props}>
        {children || <Trans>Connect Wallet</Trans>}
      </Button>
      <WalletModalV2
        docText={t('Learn How to Create and Connect')}
        docLink="https://docs.spaceinvaders-swap.finance/get-started-aptos/wallet-guide"
        isOpen={open}
        wallets={wallets}
        login={login}
        onDismiss={() => setOpen(false)}
      />
    </>
  )
}
