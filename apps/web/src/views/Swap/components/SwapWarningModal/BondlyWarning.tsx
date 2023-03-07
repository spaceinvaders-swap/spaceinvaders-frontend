import { Text } from '@offsideswap/uikit'
import { useTranslation } from '@offsideswap/localization'

const BondlyWarning = () => {
  const { t } = useTranslation()

  return <Text>{t('Warning: BONDLY has been compromised. Please remove liquidity until further notice.')}</Text>
}

export default BondlyWarning
