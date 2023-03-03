import { Text } from '@spaceinvaders-swap/uikit'
import { useTranslation } from '@spaceinvaders-swap/localization'

const BondlyWarning = () => {
  const { t } = useTranslation()

  return <Text>{t('Warning: BONDLY has been compromised. Please remove liquidity until further notice.')}</Text>
}

export default BondlyWarning
