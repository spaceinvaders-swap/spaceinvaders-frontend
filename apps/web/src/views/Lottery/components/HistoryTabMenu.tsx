import { ButtonMenu, ButtonMenuItem } from '@offsideswap/uikit'
import { useTranslation } from '@offsideswap/localization'

const HistoryTabMenu = ({ setActiveIndex, activeIndex }) => {
  const { t } = useTranslation()

  return (
    <ButtonMenu activeIndex={activeIndex} onItemClick={setActiveIndex} scale="sm" variant="subtle">
      <ButtonMenuItem>{t('All History')}</ButtonMenuItem>
      <ButtonMenuItem>{t('Your History')}</ButtonMenuItem>
    </ButtonMenu>
  )
}

export default HistoryTabMenu
