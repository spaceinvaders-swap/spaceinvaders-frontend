import { useTranslation } from '@spaceinvaders-swap/localization'
import { Text } from '@spaceinvaders-swap/uikit'

const RugPullWarning = () => {
  const { t } = useTranslation()

  return (
    <>
      <Text>{t('Suspicious rugpull token')}</Text>
    </>
  )
}

export default RugPullWarning
