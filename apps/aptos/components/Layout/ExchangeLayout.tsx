import { useTranslation } from '@spaceinvaders-swap/localization'
import { Image, Swap } from '@spaceinvaders-swap/uikit'

export const ExchangeLayout = ({ children }: React.PropsWithChildren) => {
  const { t } = useTranslation()
  return (
    <Swap.Page
      helpUrl="https://docs.spaceinvaders-swap.finance/get-started-aptos"
      externalText={t('Bridge assets to Aptos Chain')}
      externalLinkUrl="https://bridge.spaceinvaders-swap.finance/aptos"
      helpImage={<Image src="/help.png" width={178} height={243} alt="Aptos help" />}
    >
      {children}
    </Swap.Page>
  )
}
